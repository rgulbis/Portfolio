import { useEffect, useRef } from 'react';
import CubeRenderer from './CubeRenderer.js';

export const cubeDefaults = {
  groundShadow: true,
  topLine1: 'Sveiki!',
  topLine2: 'Hello!',
  hintText: 'Click It!',
  leftLine1: 'Programming',
  leftLine2: 'Technician',
  rightLine1: 'Roberts',
  rightLine2: 'Gulbis',
  textSize: 154,
  showText: true,
  edgeTreatment: 'Continuous wrap',
  cubeOutline: false,
  direction: 'Outward only',
  gridSize: 6,
  relief: 0.06,
  showEdges: true,
  animate: true,
  pointerLift: true,
  clickRipple: true,
  cubeScale: 0.46,
};

export default function Cube({ className = '', style, ...props }) {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const settings = { ...cubeDefaults, ...props };

  useEffect(() => {
    const r = new CubeRenderer(canvasRef.current, settings);
    rendererRef.current = r;
    return () => r.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push prop changes into the running render loop without remounting
  useEffect(() => {
    if (rendererRef.current) rendererRef.current.setProps(settings);
  });

  return (
    <div
      className={`relative overflow-hidden bg-transparent font-mono ${className}`}
      style={style}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
