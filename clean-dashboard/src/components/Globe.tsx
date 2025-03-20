import React, { useCallback, useEffect, useRef, useState } from 'react';
import createGlobe, { COBEOptions } from 'cobe';
import { GLOBE_CONFIG, cn } from '../utils/globeUtils';
import './Globe.css';

interface GlobeProps {
  className?: string;
  config?: COBEOptions;
}

const Globe: React.FC<GlobeProps> = ({
  className,
  config = GLOBE_CONFIG,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phi = useRef<number>(0);
  const theta = useRef<number>(0);
  const lastX = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);
  const width = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const globeInstance = useRef<any>(null);

  const onResize = useCallback(() => {
    if (canvasRef.current) {
      width.current = canvasRef.current.offsetWidth;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();

    const onRender = (state: any) => {
      // Auto rotation if not being dragged
      if (!isDragging.current) {
        phi.current += 0.003;
      }
      
      state.phi = phi.current;
      state.theta = theta.current;
      state.width = width.current * 2;
      state.height = width.current * 2;
    };

    globeInstance.current = createGlobe(canvasRef.current!, {
      ...config,
      width: width.current * 2,
      height: width.current * 2,
      onRender,
    });

    // Set opacity to 1 once loaded
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 100);
    
    return () => {
      window.removeEventListener("resize", onResize);
      if (globeInstance.current) {
        globeInstance.current.destroy();
      }
    };
  }, [config]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing';
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    lastX.current = null;
    lastY.current = null;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || lastX.current === null || lastY.current === null) return;
    
    const deltaX = e.clientX - lastX.current;
    const deltaY = e.clientY - lastY.current;
    
    // Update rotation based on drag amount
    phi.current += deltaX * 0.005;
    theta.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, theta.current + deltaY * 0.005));
    
    lastX.current = e.clientX;
    lastY.current = e.clientY;
  };

  return (
    <div className={cn("globe-inner-container", className)}>
      <canvas 
        ref={canvasRef}
        className="globe-canvas-element"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onPointerMove={handlePointerMove}
      />
    </div>
  );
};

export default Globe; 