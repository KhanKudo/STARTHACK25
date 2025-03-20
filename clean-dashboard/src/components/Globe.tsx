"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
// @ts-ignore - We're adding a type declaration for ThreeGlobe
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "../data/globe.json";
import GlobeLocationPopup from "./GlobeLocationPopup";

// Type definition for ThreeGlobe (expanded when needed)
declare class ThreeGlobeType {
  globeMaterial(): any;
  hexPolygonsData(data: any): this;
  hexPolygonResolution(resolution: number): this;
  hexPolygonMargin(margin: number): this;
  showAtmosphere(show: boolean): this;
  atmosphereColor(color: string): this;
  atmosphereAltitude(altitude: number): this;
  hexPolygonColor(colorFn: () => string): this;
  arcsData(data: any[]): this;
  arcStartLat(fn: (d: any) => number): this;
  arcStartLng(fn: (d: any) => number): this;
  arcEndLat(fn: (d: any) => number): this;
  arcEndLng(fn: (d: any) => number): this;
  arcColor(fn: (d: any) => string): this;
  arcAltitude(fn: (d: any) => number): this;
  arcStroke(fn: () => number): this;
  arcDashLength(length: number): this;
  arcDashInitialGap(fn: (d: any) => number): this;
  arcDashGap(gap: number): this;
  arcDashAnimateTime(fn: () => number): this;
  pointsData(data: any[]): this;
  pointColor(fn: (d: any) => string): this;
  pointsMerge(merge: boolean): this;
  pointAltitude(altitude: number): this;
  pointRadius(radius: number): this;
  onPointClick(callback: (point: any, event: any) => void): this;
  onPointHover(callback: (point: any | null) => void): this;
  pointLabel(fn: (d: any) => string): this;
  pointDesc(fn: (d: any) => string): this;
  ringsData(data: any[]): this;
  ringColor(fn: () => string): this;
  ringMaxRadius(radius: number): this;
  ringPropagationSpeed(speed: number): this;
  ringRepeatPeriod(period: number): this;
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElements["mesh"] & {
      new (): ThreeGlobeType;
    };
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

export type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  markers?: Array<{
    location: [number, number];
    size: number;
    company?: string;
    initiative?: string;
    link?: string;
  }>;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

let numbersOfRings = [0];

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobeType | null>(null);
  const groupRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,1)",
    globeColor: "#FFF",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  // Initialize globe only once
  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      // @ts-ignore - ThreeGlobe exists at runtime
      globeRef.current = new ThreeGlobe();
      (groupRef.current as any).add(globeRef.current);
      setIsInitialized(true);
    }
  }, []);

  // Build material when globe is initialized or when relevant props change
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  }, [
    isInitialized,
    globeConfig.globeColor,
    globeConfig.emissive,
    globeConfig.emissiveIntensity,
    globeConfig.shininess,
  ]);

  // Build data when globe is initialized or when data changes
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;

    const arcs = data;
    let points = [];

    // Add points from data arcs
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number };
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    // Add points from markers if present
    if (globeConfig.markers && globeConfig.markers.length > 0) {
      globeConfig.markers.forEach(marker => {
        points.push({
          size: marker.size * 0.8 || defaultProps.pointSize * 0.8, // Standardize size multiplier
          color: "rgba(245, 0, 87, 0.8)", // Virgin red color
          lat: marker.location[0],
          lng: marker.location[1],
          company: marker.company,
          initiative: marker.initiative,
          link: marker.link
        });
      });
    }

    // remove duplicates for same lat and lng
    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every(
            (k) => v2[k as keyof typeof v2] === v[k as keyof typeof v],
          ),
        ) === i,
    );

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor("#ffffff")
      .atmosphereAltitude(0.2) // Increased atmosphere size for better illumination
      .hexPolygonColor(() => defaultProps.polygonColor);

    globeRef.current
      .arcsData(data)
      .arcStartLat((d: Position) => d.startLat)
      .arcStartLng((d: Position) => d.startLng)
      .arcEndLat((d: Position) => d.endLat)
      .arcEndLng((d: Position) => d.endLng)
      .arcColor((e: Position) => e.color)
      .arcAltitude((e: Position) => e.arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((e: Position) => e.order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globeRef.current
      .pointsData(filteredPoints)
      .pointColor((e: any) => e.color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(0.8);

    globeRef.current
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings,
      );
  }, [
    isInitialized,
    data,
    defaultProps.pointSize,
    defaultProps.showAtmosphere,
    defaultProps.atmosphereColor,
    defaultProps.atmosphereAltitude,
    defaultProps.polygonColor,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.rings,
    defaultProps.maxRings,
    globeConfig.markers
  ]);

  // Handle rings animation with cleanup
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;

    const interval = setInterval(() => {
      if (!globeRef.current) return;

      const newNumbersOfRings = genRandomNumbers(
        0,
        data.length,
        Math.floor((data.length * 4) / 5),
      );

      const ringsData = data
        .filter((d, i) => newNumbersOfRings.includes(i))
        .map((d) => ({
          lat: d.startLat,
          lng: d.startLng,
          color: d.color,
        }));

      globeRef.current.ringsData(ringsData);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [isInitialized, data]);

  return <group ref={groupRef} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffffff, 0);
  }, [gl, size]);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  
  // State for the popup
  const [selectedLocation, setSelectedLocation] = useState<{
    company?: string;
    initiative?: string;
    link?: string;
    position: { x: number, y: number };
  } | null>(null);
  
  // Add state to track mouse hover
  const [isHovering, setIsHovering] = useState(false);

  // Handle closing the popup
  const handleClosePopup = () => {
    setSelectedLocation(null);
  };
  
  // Mouse event handlers
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  return (
    <>
      <div 
        className="globe-wrapper" 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Canvas 
          scene={scene} 
          camera={{ 
            fov: 50, 
            near: 180, 
            far: 1800,
            position: [0, 0, cameraZ]
          }}
        >
          <WebGLRendererConfig />
          {/* Increased ambient light for more even base lighting */}
          <ambientLight color={globeConfig.ambientLight} intensity={0.9} />
          
          {/* Directional lights from multiple directions for even coverage */}
          <directionalLight
            color={globeConfig.directionalLeftLight}
            position={new Vector3(-400, 0, 0)}
            intensity={0.6}
          />
          <directionalLight
            color={globeConfig.directionalTopLight}
            position={new Vector3(0, 400, 0)}
            intensity={0.6}
          />
          <directionalLight
            color={globeConfig.directionalTopLight}
            position={new Vector3(400, 0, 0)}
            intensity={0.6}
          />
          <directionalLight
            color={globeConfig.directionalTopLight}
            position={new Vector3(0, -400, 0)}
            intensity={0.6}
          />
          
          {/* Add a light from behind to ensure back lighting */}
          <directionalLight
            color={globeConfig.directionalTopLight}
            position={new Vector3(0, 0, -400)}
            intensity={0.5}
          />
          
          {/* Point light positioned closer to the center for more even radial lighting */}
          <pointLight
            color={globeConfig.pointLight}
            position={new Vector3(0, 0, 300)}
            intensity={0.7}
            distance={500}
          />
          
          <GlobeWithClickHandler 
            {...props} 
            onPointClick={(point, event) => {
              // When a point is clicked, show the popup with location data
              if (point && event && point.company) {
                setSelectedLocation({
                  company: point.company,
                  initiative: point.initiative,
                  link: point.link,
                  position: { 
                    x: event.clientX, 
                    y: event.clientY 
                  }
                });
              }
            }}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minDistance={cameraZ}
            maxDistance={cameraZ}
            autoRotateSpeed={1}
            autoRotate={!isHovering && globeConfig.autoRotate} // Stop rotation on hover
            minPolarAngle={Math.PI / 3.5}
            maxPolarAngle={Math.PI - Math.PI / 3}
          />
        </Canvas>
      </div>
      
      {/* Render the popup if a location is selected */}
      {selectedLocation && (
        <div onClick={handleClosePopup} className="globe-popup-overlay">
          <GlobeLocationPopup
            company={selectedLocation.company || 'Virgin Location'}
            initiative={selectedLocation.initiative || 'Virgin Operations'}
            link={selectedLocation.link || 'https://www.virgin.com'}
            position={selectedLocation.position}
            onClose={handleClosePopup}
          />
        </div>
      )}
    </>
  );
}

export function hexToRgb(hex: string) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}

interface GlobeWithClickHandlerProps extends WorldProps {
  onPointClick: (point: any, event: MouseEvent) => void;
}

// This component extends the Globe component with click handling
function GlobeWithClickHandler({ onPointClick, ...props }: GlobeWithClickHandlerProps) {
  const groupRef = useRef<any>(null);
  const pointsDataRef = useRef<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Create a click event handler for the canvas
  useEffect(() => {
    if (!groupRef.current) return;

    // Find the canvas element
    const canvas = document.querySelector('.globe-container canvas') as HTMLCanvasElement;
    if (!canvas) return;

    // Track mouse position for drag detection
    let mouseDownX: number | null = null;
    let mouseDownY: number | null = null;
    const dragThreshold = 5; // pixels of movement to consider it a drag instead of a click
    
    // Handle mouse down to track potential drag start
    const handleMouseDown = (event: MouseEvent) => {
      mouseDownX = event.clientX;
      mouseDownY = event.clientY;
    };
    
    // Handle click/release on the canvas
    const handleMouseUp = (event: MouseEvent) => {
      // If we don't have a mouseDown position, ignore
      if (mouseDownX === null || mouseDownY === null) return;
      
      // Calculate distance moved during potential drag
      const deltaX = Math.abs(event.clientX - mouseDownX);
      const deltaY = Math.abs(event.clientY - mouseDownY);
      const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Reset tracking
      mouseDownX = null;
      mouseDownY = null;
      
      // If movement exceeds threshold, it was a drag, not a click
      if (totalMovement > dragThreshold) return;
      
      // At this point we have a genuine click, not a drag
      
      // Get click coordinates
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Check if we have valid point data
      if (!pointsDataRef.current.length) return;
      
      // Find the closest point to the click location (simplified)
      const pointRadius = 10; // approximate size of point markers in pixels
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Find points with company info (markers)
      const companyPoints = pointsDataRef.current.filter(p => p.company);
      if (!companyPoints.length) return;
      
      // Convert lat/lng to rough screen coordinates (very simplified approximation)
      // This is an extremely simplified model assuming the globe is centered and stationary
      // A real implementation would use raycasting or proper 3D to 2D projection
      const visiblePoints = companyPoints.filter(point => {
        // Get spherical coordinates
        const lat = point.lat * (Math.PI / 180);
        const lng = point.lng * (Math.PI / 180);
        
        // Simple spherical to screen projection (very approximate)
        // Assumes globe is centered and static - this is a simplified model
        const radius = Math.min(rect.width, rect.height) * 0.45;
        const screenX = centerX + radius * Math.cos(lat) * Math.sin(lng);
        const screenY = centerY - radius * Math.sin(lat);
        
        // Calculate distance from click to this point
        const distance = Math.sqrt(
          Math.pow(screenX - x, 2) + 
          Math.pow(screenY - y, 2)
        );
        
        // Store calculated position for potential use
        point._screenX = screenX;
        point._screenY = screenY;
        point._distance = distance;
        
        // Consider this point "visible" if it's close enough to the click
        return distance < pointRadius * point.size * 20; // Adjust multiplier based on testing
      });
      
      // Sort by distance to click
      visiblePoints.sort((a, b) => a._distance - b._distance);
      
      // If we have a close point, use it
      if (visiblePoints.length > 0) {
        onPointClick(visiblePoints[0], event);
      }
    };
    
    // Handle canvas click
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isInitialized, onPointClick]);

  // Update pointsDataRef when markers change
  useEffect(() => {
    if (!isInitialized) return;
    
    // Extract points from markers for click detection
    const points: Array<{
      size: number;
      color: string;
      lat: number;
      lng: number;
      company?: string;
      initiative?: string;
      link?: string;
      _screenX?: number;
      _screenY?: number;
      _distance?: number;
    }> = [];
    
    if (props.globeConfig.markers && props.globeConfig.markers.length > 0) {
      props.globeConfig.markers.forEach(marker => {
        points.push({
          size: marker.size * 0.8 || 0.8, // Match the size in the main Globe component
          color: "rgba(245, 0, 87, 0.8)", // Virgin red color
          lat: marker.location[0],
          lng: marker.location[1],
          company: marker.company,
          initiative: marker.initiative,
          link: marker.link
        });
      });
    }
    
    pointsDataRef.current = points;
    setIsInitialized(true);
  }, [props.globeConfig.markers, isInitialized]);

  return (
    <>
      <Globe {...props} />
      <group ref={groupRef} />
    </>
  );
} 