/**
 * Isometric relief cube — 2D canvas renderer.
 * Draws three visible cube faces as an N×N grid of extruded cells whose heights
 * come from a shared 3D value-noise field, with lettering decalled per cell.
 */
export default class CubeRenderer {
  constructor(canvas, props = {}) {
    this.canvas = canvas;
    this.props = props;
    this.ctx = canvas.getContext('2d');
    this.pointer = { x: -1e5, y: -1e5, active: false };
    this.ripples = [];
    this._tex = {};
    this._fit = {};
    this.t0 = performance.now();

    this._onResize = () => this.resize();
    this._onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      this.pointer = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
    };
    this._onLeave = () => {
      this.pointer.active = false;
    };
    this._onDown = (e) => {
      const r = canvas.getBoundingClientRect();
      this.ripples = this.ripples.slice(-4);
      this.ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
    };

    window.addEventListener('resize', this._onResize);
    if ('ResizeObserver' in window) {
      this._ro = new ResizeObserver(() => this.resize());
      this._ro.observe(canvas);
    }
    canvas.addEventListener('pointermove', this._onMove);
    canvas.addEventListener('pointerleave', this._onLeave);
    canvas.addEventListener('pointerdown', this._onDown);

    this.resize();
    // Fonts arriving late invalidate cached text textures
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        this._tex = {};
      });
    }

    const loop = () => {
      this.frame();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  setProps(props) {
    this.props = props;
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this._onResize);
    if (this._ro) this._ro.disconnect();
    const cv = this.canvas;
    if (cv) {
      cv.removeEventListener('pointermove', this._onMove);
      cv.removeEventListener('pointerleave', this._onLeave);
      cv.removeEventListener('pointerdown', this._onDown);
    }
  }

  resize() {
    const cv = this.canvas;
    if (!cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect();
    this.w = r.width;
    this.h = r.height;
    cv.width = Math.max(1, Math.round(r.width * dpr));
    cv.height = Math.max(1, Math.round(r.height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // --- value noise ---
  hash(i, j, seed) {
    const n = Math.sin(i * 127.1 + j * 311.7 + seed * 74.7) * 43758.5453;
    return n - Math.floor(n);
  }

  vnoise(x, y, seed) {
    const i = Math.floor(x), j = Math.floor(y);
    const fx = x - i, fy = y - j;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const a = this.hash(i, j, seed), b = this.hash(i + 1, j, seed);
    const c = this.hash(i, j + 1, seed), d = this.hash(i + 1, j + 1, seed);
    return (a * (1 - ux) + b * ux) * (1 - uy) + (c * (1 - ux) + d * ux) * uy;
  }

  fbm(x, y, seed) {
    let v = 0, amp = 0.6, f = 1;
    for (let o = 0; o < 3; o++) {
      v += amp * this.vnoise(x * f, y * f, seed + o * 13);
      amp *= 0.5;
      f *= 2.05;
    }
    return v / 1.05;
  }

  hash3(i, j, k, seed) {
    const n = Math.sin(i * 127.1 + j * 311.7 + k * 74.7 + seed * 19.3) * 43758.5453;
    return n - Math.floor(n);
  }

  vnoise3(x, y, z, seed) {
    const i = Math.floor(x), j = Math.floor(y), k = Math.floor(z);
    const fx = x - i, fy = y - j, fz = z - k;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy), uz = fz * fz * (3 - 2 * fz);
    const H = (di, dj, dk) => this.hash3(i + di, j + dj, k + dk, seed);
    const lx = (a, b) => a * (1 - ux) + b * ux;
    const c00 = lx(H(0, 0, 0), H(1, 0, 0)), c10 = lx(H(0, 1, 0), H(1, 1, 0));
    const c01 = lx(H(0, 0, 1), H(1, 0, 1)), c11 = lx(H(0, 1, 1), H(1, 1, 1));
    const c0 = c00 * (1 - uy) + c10 * uy, c1 = c01 * (1 - uy) + c11 * uy;
    return c0 * (1 - uz) + c1 * uz;
  }

  fbm3(x, y, z, seed) {
    let v = 0, amp = 0.6, f = 1;
    for (let o = 0; o < 3; o++) {
      v += amp * this.vnoise3(x * f, y * f, z * f, seed + o * 13);
      amp *= 0.5;
      f *= 2.05;
    }
    return v / 1.05;
  }

  // One shared type size per face run: shrink until the longest line clears the face edges
  fitSize(texts, size, maxFrac) {
    const K = 768;
    const key = texts.join('\u0001') + '|' + size + '|' + maxFrac;
    if (this._fit[key] != null) return this._fit[key];
    this._scratch = this._scratch || document.createElement('canvas').getContext('2d');
    const c = this._scratch;
    const s = size * (K / 1000);
    c.font = '700 ' + s + 'px "IBM Plex Mono", ui-monospace, monospace';
    if ('letterSpacing' in c) c.letterSpacing = (s * 0.16).toFixed(1) + 'px';
    let widest = 1;
    for (const t of texts) if (t) widest = Math.max(widest, c.measureText(t).width + s * 0.2);
    const out = size * Math.min(1, (maxFrac * K) / widest);
    this._fit[key] = out;
    return out;
  }

  // All of a face's lines rendered once into a texture, in that face's own UV space.
  // lines: [{ txt, u, v, rot }] with u/v in 0..1 across the face and rot in degrees
  faceTexture(lines, ink, size) {
    const K = 768;
    const key = JSON.stringify(lines) + '|' + ink + '|' + size;
    if (this._tex[key]) return this._tex[key];
    const cv = document.createElement('canvas');
    cv.width = K;
    cv.height = K;
    const c = cv.getContext('2d');
    const boxes = [];
    for (const ln of lines) {
      if (!ln.txt) continue;
      const s = (ln.size || size) * (K / 1000);
      c.save();
      c.fillStyle = ink;
      c.font = '700 ' + s + 'px "IBM Plex Mono", ui-monospace, monospace';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      if ('letterSpacing' in c) c.letterSpacing = (s * 0.16).toFixed(1) + 'px';
      const w = c.measureText(ln.txt).width + s * 0.2;
      const hh = s * 0.8;
      c.translate(ln.u * K, ln.v * K);
      c.rotate(((ln.rot || 0) * Math.PI) / 180);
      const push = ln.push || 0;
      if (push) c.translate((push * w) / 2, 0);
      c.fillText(ln.txt, s * 0.08, 0);
      c.restore();
      const rad = ((ln.rot || 0) * Math.PI) / 180;
      const cu = ln.u + push * (w / 2 / K) * Math.cos(rad);
      const cvv = ln.v + push * (w / 2 / K) * Math.sin(rad);
      const horiz = Math.abs((ln.rot || 0) % 180) < 45;
      const ew = (horiz ? w / 2 : hh) / K, eh = (horiz ? hh : w / 2) / K;
      boxes.push({ u0: cu - ew, u1: cu + ew, v0: cvv - eh, v1: cvv + eh });
    }
    const rec = { cv, K, boxes };
    this._tex[key] = rec;
    return rec;
  }

  frame() {
    const ctx = this.ctx;
    if (!ctx) return;
    const p = this.props;
    const N = Math.max(3, Math.min(28, Math.round(p.gridSize ?? 12)));
    const relief = p.relief ?? 0.16;
    const animate = p.animate ?? true;
    const pointerLift = p.pointerLift ?? true;
    const showEdges = p.showEdges ?? true;
    const bg = p.background ?? null;
    const t = animate ? (performance.now() - this.t0) / 1000 : 0;

    const w = this.w, h = this.h;
    ctx.clearRect(0, 0, w, h);
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
    }

    const C = Math.cos(Math.PI / 6), S = Math.sin(Math.PI / 6);
    const scale = Math.min(w, h) * (p.cubeScale ?? 0.38);
    const ox = w / 2, oy = h / 2;
    const proj = (X, Y, Z) => [ox + (X - Y) * C * scale, oy + ((X + Y) * S - Z) * scale];

    const half = 0.5, step = 1 / N;
    // face defs: axis index of the normal (0=X,1=Y,2=Z), noise seed, base lightness
    const faces = [
      { n: 2, seed: 3.1, L: 87 }, // top
      { n: 0, seed: 17.7, L: 63 }, // right
      { n: 1, seed: 41.3, L: 41 }, // left
    ];
    const shade = [63, 41, 87]; // lightness by visible normal axis for box sides

    const rippleOn = p.clickRipple ?? true;
    const now = performance.now();
    const ripples = [];
    if (rippleOn && this.ripples) {
      this.ripples = this.ripples.filter((r) => now - r.t < 2200);
      for (const r of this.ripples) {
        const age = (now - r.t) / 1000;
        ripples.push({ x: r.x, y: r.y, age, decay: Math.exp(-age * 1.5) });
      }
    }

    const boxes = [];
    for (const f of faces) {
      const [a1, a2] = [0, 1, 2].filter((k) => k !== f.n);
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const u = -half + i * step, v = -half + j * step;
          const edgeMode = p.edgeTreatment ?? 'Continuous wrap';
          let nv;
          if (edgeMode === 'Continuous wrap') {
            // one shared 3D field, sampled at the cell's position on the cube surface,
            // so cells meeting at an edge resolve to the same height
            const s3 = [0, 0, 0];
            s3[a1] = u + step / 2;
            s3[a2] = v + step / 2;
            s3[f.n] = half;
            nv = this.fbm3(s3[0] * 3.0 + t * 0.2, s3[1] * 3.0 + t * 0.12, s3[2] * 3.0 - t * 0.16, 7.3);
          } else {
            nv = this.fbm((u + half) * 3.2 + t * 0.22, (v + half) * 3.2 - t * 0.15, f.seed);
          }
          nv = Math.pow(Math.max(0, Math.min(1, nv * 1.25 - 0.05)), 1.35);
          if (edgeMode === 'Taper to edge' || edgeMode === 'Flat border') {
            const du = Math.min(i, N - 1 - i) / ((N - 1) / 2), dv = Math.min(j, N - 1 - j) / ((N - 1) / 2);
            const e = Math.min(du, dv);
            if (edgeMode === 'Flat border') {
              nv = e < ((0.99 / ((N - 1) / 2)) * (Math.max(1, Math.round(N * 0.09)) - 0.01)) ? 0 : nv;
            } else {
              const k = Math.max(0, Math.min(1, e / 0.34));
              nv *= k * k * (3 - 2 * k);
            }
          }
          const dir = p.direction ?? 'Outward only';
          let signed = nv;
          if (dir === 'Both ways') signed = (nv - 0.5) * 2;
          else if (dir === 'Inward only') signed = -nv;
          let hgt = signed * relief;
          if (Math.abs(hgt) < 0.004) hgt = (signed < 0 ? -1 : 1) * 0.004;
          const min = [0, 0, 0], max = [0, 0, 0];
          min[a1] = u;
          max[a1] = u + step * 0.995;
          min[a2] = v;
          max[a2] = v + step * 0.995;
          const cx = (min[a1] + max[a1]) / 2, cy = (min[a2] + max[a2]) / 2;
          const needScreen = (pointerLift && this.pointer.active) || ripples.length > 0;
          if (needScreen) {
            const c3 = [0, 0, 0];
            c3[a1] = cx;
            c3[a2] = cy;
            c3[f.n] = half + Math.max(hgt, 0);
            const [sx, sy] = proj(c3[0], c3[1], c3[2]);
            if (pointerLift && this.pointer.active) {
              const d = Math.hypot(sx - this.pointer.x, sy - this.pointer.y) / (scale * 0.55);
              if (d < 1) hgt += (dir === 'Inward only' ? -1 : 1) * relief * 1.15 * Math.pow(1 - d, 2);
            }
            for (const rp of ripples) {
              const d = Math.hypot(sx - rp.x, sy - rp.y) / scale;
              const front = rp.age * 1.7;
              const ring = Math.exp(-Math.pow((d - front) / 0.22, 2));
              hgt += (dir === 'Inward only' ? -1 : 1) * relief * 2.2 * rp.decay * ring;
            }
          }
          const sign = hgt < 0 ? -1 : 1;
          min[f.n] = Math.min(half, half + hgt);
          max[f.n] = Math.max(half, half + hgt);
          boxes.push({
            min,
            max,
            n: f.n,
            a1,
            a2,
            sign,
            L: f.L,
            hn: Math.abs(hgt) / (relief || 1),
            depth: (min[0] + max[0] + min[1] + max[1] + min[2] + max[2]) / 2 - (sign < 0 ? 0.02 : 0),
          });
        }
      }
    }
    boxes.sort((a, b) => a.depth - b.depth);

    if (p.groundShadow ?? true) {
      const [bx, by] = proj(-half, -half, -half);
      const rx = scale * 1.15, ry = scale * 0.3;
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      g.addColorStop(0, 'hsla(34 12% 22% / 0.24)');
      g.addColorStop(0.55, 'hsla(34 12% 22% / 0.1)');
      g.addColorStop(1, 'hsla(34 12% 22% / 0)');
      ctx.save();
      ctx.translate(bx, by - scale * 0.02);
      ctx.scale(rx, ry);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(0.5, scale / 900);
    ctx.strokeStyle = 'hsla(34 6% 8% / 0.22)';

    const quad = (pts, L) => {
      ctx.beginPath();
      const p0 = proj(pts[0][0], pts[0][1], pts[0][2]);
      ctx.moveTo(p0[0], p0[1]);
      for (let k = 1; k < pts.length; k++) {
        const q = proj(pts[k][0], pts[k][1], pts[k][2]);
        ctx.lineTo(q[0], q[1]);
      }
      ctx.closePath();
      ctx.fillStyle = 'hsl(34 8% ' + L.toFixed(1) + '%)';
      ctx.fill();
      if (showEdges) ctx.stroke();
    };

    // quad on the plane axis=value, spanning the other two axes of the box
    const cornersOf = (b, axis, value) => {
      const [o1, o2] = [0, 1, 2].filter((k) => k !== axis);
      const mk = (v1, v2) => {
        const q = [0, 0, 0];
        q[axis] = value;
        q[o1] = v1;
        q[o2] = v2;
        return q;
      };
      return [
        mk(b.min[o1], b.min[o2]),
        mk(b.max[o1], b.min[o2]),
        mk(b.max[o1], b.max[o2]),
        mk(b.min[o1], b.max[o2]),
      ];
    };
    const planeQuad = (b, axis, value, L) => quad(cornersOf(b, axis, value), L);

    // per-face UV mapping + lettering textures
    const showText = p.showText ?? true;
    const allText = [
      p.topLine1 ?? 'PORTFOLIO',
      p.topLine2 ?? '2026',
      p.leftLine1 ?? 'SELECTED',
      p.leftLine2 ?? 'WORK',
      p.rightLine1 ?? 'ABOUT',
      p.rightLine2 ?? 'CONTACT',
    ];
    // sides share one size (kept consistent between them); the top pair fits on its own
    const leftSize = this.fitSize(allText.slice(2, 4), p.textSize ?? 220, 0.94);
    const rightSize = this.fitSize(allText.slice(4), p.textSize ?? 220, 0.94);
    const topSize = this.fitSize(allText.slice(0, 1), p.textSize ?? 220, 0.72);
    const top2Size = this.fitSize(allText.slice(1, 2), p.textSize ?? 220, 0.74);
    const hintTxt = p.hintText ?? 'Click It!';
    const hintSize = this.fitSize([hintTxt], p.textSize ?? 220, 0.3);
    const uvMap = {
      2: { uA: 0, uF: false, vA: 1, vF: false },
      0: { uA: 1, uF: true, vA: 2, vF: true },
      1: { uA: 0, uF: false, vA: 2, vF: true },
    };
    // placements traced from the marked-up reference: two lines per visible face
    const texFor = !showText
      ? { 0: null, 1: null, 2: null }
      : {
          // top pair: each centred along its own run, mirrored about the face's centre diagonal
          2: this.faceTexture(
            [
              { txt: p.topLine1 ?? 'PORTFOLIO', u: 0.8, v: 0.86, rot: 0, push: -1 },
              { txt: p.topLine2 ?? '2026', u: 0.86, v: 0.8, rot: -90, push: 1, size: top2Size },
              { txt: hintTxt, u: 0.06, v: 0.09, rot: 0, push: 1, size: hintSize },
            ],
            'hsl(34 7% 30%)',
            topSize
          ),
          // side pairs: identical u/v on both faces, so they mirror across the front edge
          0: this.faceTexture(
            [
              { txt: p.rightLine1 ?? 'ABOUT', u: 0.04, v: 0.22, rot: 0, push: 1 },
              { txt: p.rightLine2 ?? 'CONTACT', u: 0.04, v: 0.5, rot: 0, push: 1 },
            ],
            'hsl(34 7% 33%)',
            rightSize
          ),
          1: this.faceTexture(
            [
              { txt: p.leftLine1 ?? 'SELECTED', u: 0.96, v: 0.25, rot: 0, push: -1 },
              { txt: p.leftLine2 ?? 'WORK', u: 0.96, v: 0.47, rot: 0, push: -1 },
            ],
            'hsl(34 10% 76%)',
            leftSize
          ),
        };
    const uNorm = (val, flip) => (flip ? half - val : val + half);
    // paint the face texture onto one cell's outward top, clipped to that cell,
    // mapped on the plane the cell was pushed out to — so the letters break along the grid
    const decal = (b) => {
      const tex = texFor[b.n];
      if (!tex) return;
      const m = uvMap[b.n];
      const ua = uNorm(b.min[m.uA], m.uF), ub = uNorm(b.max[m.uA], m.uF);
      const va = uNorm(b.min[m.vA], m.vF), vb = uNorm(b.max[m.vA], m.vF);
      const u0 = Math.min(ua, ub), u1 = Math.max(ua, ub);
      const v0 = Math.min(va, vb), v1 = Math.max(va, vb);
      let hit = false;
      for (const bx of tex.boxes) {
        if (u1 >= bx.u0 && u0 <= bx.u1 && v1 >= bx.v0 && v0 <= bx.v1) {
          hit = true;
          break;
        }
      }
      if (!hit) return;
      const val = b.max[b.n];
      const O = [0, 0, 0], U = [0, 0, 0], V = [0, 0, 0];
      const setPt = (arr, un, vn) => {
        arr[b.n] = val;
        arr[m.uA] = m.uF ? half - un : un - half;
        arr[m.vA] = m.vF ? half - vn : vn - half;
      };
      setPt(O, 0, 0);
      setPt(U, 1, 0);
      setPt(V, 0, 1);
      const o = proj(O[0], O[1], O[2]), u = proj(U[0], U[1], U[2]), v = proj(V[0], V[1], V[2]);
      ctx.save();
      const c4 = cornersOf(b, b.n, val).map((q) => proj(q[0], q[1], q[2]));
      ctx.beginPath();
      ctx.moveTo(c4[0][0], c4[0][1]);
      for (let k = 1; k < 4; k++) ctx.lineTo(c4[k][0], c4[k][1]);
      ctx.closePath();
      ctx.clip();
      ctx.transform(
        (u[0] - o[0]) / tex.K,
        (u[1] - o[1]) / tex.K,
        (v[0] - o[0]) / tex.K,
        (v[1] - o[1]) / tex.K,
        o[0],
        o[1]
      );
      ctx.drawImage(tex.cv, 0, 0);
      ctx.restore();
    };

    for (const b of boxes) {
      const tint = Math.min(12, b.hn * 12) * b.sign;
      const f = (axisL, k) => Math.max(5, Math.min(96, (axisL - (87 - b.L) * 0.35 + tint) * k));
      if (b.sign > 0) {
        planeQuad(b, 1, b.max[1], f(shade[1], 1));
        planeQuad(b, 0, b.max[0], f(shade[0], 1));
        planeQuad(b, 2, b.max[2], f(shade[2], 1));
        decal(b);
      } else {
        // recessed cell: floor of the pit plus its two far walls
        planeQuad(b, b.n, b.min[b.n], f(shade[b.n], 0.6));
        planeQuad(b, b.a1, b.min[b.a1], f(shade[b.a1], 0.42));
        planeQuad(b, b.a2, b.min[b.a2], f(shade[b.a2], 0.5));
      }
    }

    if (p.cubeOutline ?? false) {
      const line = (A, B) => {
        const a = proj(A[0], A[1], A[2]), b2 = proj(B[0], B[1], B[2]);
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b2[0], b2[1]);
        ctx.stroke();
      };
      ctx.save();
      ctx.strokeStyle = 'hsla(34 12% 96% / 0.5)';
      ctx.lineWidth = Math.max(1, scale / 320);
      const H = half;
      // the three edges shared by visible faces
      line([H, -H, H], [H, H, H]);
      line([-H, H, H], [H, H, H]);
      line([H, H, -H], [H, H, H]);
      // silhouette
      line([-H, -H, H], [H, -H, H]);
      line([-H, -H, H], [-H, H, H]);
      line([H, -H, H], [H, -H, -H]);
      line([H, -H, -H], [H, H, -H]);
      line([-H, H, H], [-H, H, -H]);
      line([-H, H, -H], [H, H, -H]);
      ctx.restore();
    }
  }
}
