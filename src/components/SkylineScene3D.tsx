import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, EyeOff, RotateCw, Pause, Play, Sparkles } from 'lucide-react';

interface SkylineScene3DProps {
  cityName: string;
  fallbackImage: string;
}

export const SkylineScene3D: React.FC<SkylineScene3DProps> = ({ cityName, fallbackImage }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const [isCinematic, setIsCinematic] = useState(false);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);
  const isRotatingRef = useRef(true);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setHasReducedMotion(true);
      setIsRotating(false);
      isRotatingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Test WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    let animationFrameId: number;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0d10, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 7, 18);
    camera.lookAt(0, 3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 2. Procedural Window Grid Canvas Texture
    const canvasTex = document.createElement('canvas');
    canvasTex.width = 128;
    canvasTex.height = 256;
    const ctx = canvasTex.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#080a0e';
      ctx.fillRect(0, 0, 128, 256);
      ctx.fillStyle = '#f59e0b';
      // Draw grid of illuminated windows
      for (let y = 10; y < 240; y += 16) {
        for (let x = 8; x < 120; x += 14) {
          if (Math.random() > 0.35) {
            ctx.globalAlpha = 0.4 + Math.random() * 0.6;
            ctx.fillRect(x, y, 7, 10);
          }
        }
      }
    }
    const windowTexture = new THREE.CanvasTexture(canvasTex);
    windowTexture.colorSpace = THREE.SRGBColorSpace;
    windowTexture.wrapS = THREE.RepeatWrapping;
    windowTexture.wrapT = THREE.RepeatWrapping;

    // 3. Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x1a2638, 0x05070a, 1.2);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf59e0b, 2.5);
    keyLight.position.set(10, 15, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLight.position.set(-12, 10, -8);
    scene.add(rimLight);

    // 4. Ground Contact Grid
    const groundGeo = new THREE.CircleGeometry(16, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x07090c,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    const gridHelper = new THREE.PolarGridHelper(15, 16, 8, 64, 0xf59e0b, 0x1e293b);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // 5. Procedural City Skyline Group
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    const buildingMaterials = [
      new THREE.MeshStandardMaterial({
        color: 0x131720,
        roughness: 0.3,
        metalness: 0.8,
        map: windowTexture,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x181e29,
        roughness: 0.2,
        metalness: 0.9,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x0f131a,
        roughness: 0.4,
        metalness: 0.6,
        map: windowTexture,
      }),
    ];

    // Seeded procedural buildings placed organically
    const buildingCount = 28;
    const geometriesToDispose: THREE.BufferGeometry[] = [];

    for (let i = 0; i < buildingCount; i++) {
      const angle = (i / buildingCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const radius = 2 + Math.random() * 7;
      const bx = Math.cos(angle) * radius;
      const bz = Math.sin(angle) * radius;

      const width = 0.8 + Math.random() * 1.4;
      const depth = 0.8 + Math.random() * 1.4;
      const height = 2 + Math.random() * 6.5;

      const bGeo = new THREE.BoxGeometry(width, height, depth);
      geometriesToDispose.push(bGeo);
      const bMat = buildingMaterials[i % buildingMaterials.length];
      const building = new THREE.Mesh(bGeo, bMat);

      building.position.set(bx, height / 2, bz);
      cityGroup.add(building);

      // Add roof accent (antenna or geometric crown)
      if (Math.random() > 0.4) {
        const spireHeight = 1 + Math.random() * 2;
        const spireGeo = new THREE.ConeGeometry(0.12, spireHeight, 8);
        geometriesToDispose.push(spireGeo);
        const spireMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xf59e0b,
          emissiveIntensity: 0.6,
          metalness: 0.9,
          roughness: 0.1,
        });
        const spire = new THREE.Mesh(spireGeo, spireMat);
        spire.position.set(bx, height + spireHeight / 2, bz);
        cityGroup.add(spire);
      }
    }

    // Interactive pointer rotation
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      targetRotationY += deltaX * 0.008;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      prevMouseX = e.touches[0].clientX;
      targetRotationY += deltaX * 0.01;
    };

    const canvasElem = renderer.domElement;
    canvasElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvasElem.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Render loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden) return;

      if (isRotatingRef.current && !isDragging) {
        targetRotationY += 0.003;
      }

      // Smooth damping interpolation
      cityGroup.rotation.y += (targetRotationY - cityGroup.rotation.y) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvasElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvasElem.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);

      geometriesToDispose.forEach((g) => g.dispose());
      buildingMaterials.forEach((m) => m.dispose());
      groundGeo.dispose();
      groundMat.dispose();
      windowTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [hasWebGL]);

  if (!hasWebGL) {
    return (
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <img src={fallbackImage} alt={`${cityName} Skyline`} className="w-full h-full object-cover filter brightness-[0.85]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-6 flex items-end">
          <span className="text-xs font-mono text-amber-300">2D Architectural Panorama · {cityName}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-white/12 shadow-2xl bg-[#090b0e] group">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#0b0d10]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono text-amber-300 pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>3D Procedural Skyline: {cityName}</span>
      </div>

      {/* Bottom Collapsible Control Dock (Three.js Skill guideline) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#0f1218]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-sans text-neutral-300 shadow-xl transition-all">
        <button
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-200 transition-colors"
        >
          {isRotating ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-amber-400" />}
          <span className="text-[11px] font-mono">{isRotating ? 'Pause' : 'Rotate'}</span>
        </button>

        <span className="w-px h-3 bg-white/10" />

        <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
          Drag to orbit 360°
        </span>
      </div>
    </div>
  );
};
