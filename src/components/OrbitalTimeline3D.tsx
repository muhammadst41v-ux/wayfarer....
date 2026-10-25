import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { useEffects } from '../context/EffectsContext';
import { Calendar, Clock, MapPin, ArrowRight, Eye, Layers, Box, RotateCw, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SmartImage } from './SmartImage';
import { imageTracker } from '../utils/imageTracker';

interface OrbitalDayNode {
  day: number;
  title: string;
  time: string;
  summary: string;
  details: string;
  location: string;
  coordinateLabel: string;
  image: string;
  fallbackUrls?: string[];
}

interface OrbitalTimeline3DProps {
  customNodes?: OrbitalDayNode[];
  headingTitle?: string;
}

export const OrbitalTimeline3D: React.FC<OrbitalTimeline3DProps> = ({
  customNodes,
  headingTitle = 'The 3D Orbital Expedition Timeline',
}) => {
  const { currentContent } = useTheme();
  const { effectsLevel } = useEffects();
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Normalize nodes to 7 days for the orbital cycle
  const rawNodes = customNodes || currentContent.orbitalItinerary || [];
  const nodes: OrbitalDayNode[] = Array.from({ length: 7 }, (_, i) => {
    if (rawNodes[i]) return rawNodes[i];
    const prev = rawNodes[i % rawNodes.length] || rawNodes[0];
    return {
      ...prev,
      day: i + 1,
      title: `Day ${i + 1}: ${prev.title}`,
    };
  });

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>(effectsLevel === 'off' ? '2d' : '3d');
  const [hasWebGL, setHasWebGL] = useState(true);

  const activeDayIndexRef = useRef(0);
  const isRotatingRef = useRef(true);

  useEffect(() => {
    activeDayIndexRef.current = activeDayIndex;
  }, [activeDayIndex]);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    if (effectsLevel === 'off') {
      setViewMode('2d');
    }
  }, [effectsLevel]);

  const activeNode = nodes[activeDayIndex] || nodes[0];

  const handleSelectDay = useCallback((index: number) => {
    setActiveDayIndex(index);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      setActiveDayIndex((prev) => (prev + 1) % nodes.length);
    } else if (e.key === 'ArrowLeft') {
      setActiveDayIndex((prev) => (prev - 1 + nodes.length) % nodes.length);
    } else if (e.key >= '1' && e.key <= '7') {
      setActiveDayIndex(parseInt(e.key) - 1);
    }
  };

  // Three.js WebGL Scene initialization
  useEffect(() => {
    if (viewMode === '2d') return;

    const container = mountRef.current;
    if (!container) return;

    // Test WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        setViewMode('2d');
        return;
      }
    } catch {
      setHasWebGL(false);
      setViewMode('2d');
      return;
    }

    let animationFrameId: number;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090b0e, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 10, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const centerPointLight = new THREE.PointLight(0xf59e0b, 3, 25);
    centerPointLight.position.set(0, 0, 0);
    scene.add(centerPointLight);

    // 3. Central Core Glowing Orb
    const coreGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Concentric Orbit Rings
    const orbitRadius = 7.5;
    const ringGeo = new THREE.RingGeometry(orbitRadius - 0.04, orbitRadius + 0.04, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    scene.add(ringMesh);

    // 4. 7 Orbiting Node Spheres & Picture Texture Planes
    const nodeMeshes: THREE.Mesh[] = [];
    const planeMeshes: THREE.Mesh[] = [];
    const loadedTextures: THREE.Texture[] = [];
    const nodeCount = 7;
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;

      // Base node sphere
      const nodeGeo = new THREE.SphereGeometry(0.65, 24, 24);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0x1a2130,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.7,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x, 0, z);
      nodeMesh.userData = { index: i };
      nodeMeshes.push(nodeMesh);
      nodeGroup.add(nodeMesh);

      // Picture Texture Plane above each node (3D Gallery texture with colored plane fallback)
      const planeGeo = new THREE.PlaneGeometry(1.6, 1.1);
      // Fallback: Default colored plane
      const planeMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.5,
        side: THREE.DoubleSide,
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.position.set(x, 1.35, z);
      planeMesh.userData = { index: i };
      planeMeshes.push(planeMesh);
      nodeGroup.add(planeMesh);

      // Recursive texture loader trying primary, then fallbacks, then colored plane
      const nodeData = nodes[i];
      const candidateUrls = [nodeData.image, ...(nodeData.fallbackUrls || [])].filter(Boolean);

      const tryLoadTexture = (urls: string[]) => {
        if (!urls.length) {
          // If all texture URLs fail, plane retains its colored plane material (0x1e293b)
          return;
        }
        const [currentUrl, ...remainingUrls] = urls;
        textureLoader.load(
          currentUrl,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            loadedTextures.push(tex);
            planeMesh.material = new THREE.MeshStandardMaterial({
              map: tex,
              side: THREE.DoubleSide,
            });
          },
          undefined,
          () => {
            imageTracker.recordFailure({
              url: currentUrl,
              alt: `3D Gallery Node Texture Day ${i + 1}: ${nodeData.title}`,
              placeName: nodeData.title,
              candidateIndex: candidateUrls.indexOf(currentUrl),
              totalCandidates: candidateUrls.length,
            });
            tryLoadTexture(remainingUrls);
          }
        );
      };

      tryLoadTexture(candidateUrls);

      // Orbital tether line to core
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, 0, z),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      nodeGroup.add(line);
    }

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const clickableObjects = [...nodeMeshes, ...planeMeshes];
      const intersects = raycaster.intersectObjects(clickableObjects);

      if (intersects.length > 0) {
        const clickedIndex = intersects[0].object.userData.index;
        if (typeof clickedIndex === 'number') {
          handleSelectDay(clickedIndex);
        }
      }
    };

    renderer.domElement.addEventListener('click', onPointerDown);

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation & Camera focus loop
    let currentOrbitAngle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden) return;

      if (isRotatingRef.current) {
        currentOrbitAngle += 0.002;
        nodeGroup.rotation.y = currentOrbitAngle;
      }

      // Keep texture planes billboarded toward camera
      planeMeshes.forEach((p) => {
        p.quaternion.copy(camera.quaternion);
      });

      // Highlight active node
      const activeIdx = activeDayIndexRef.current;
      nodeMeshes.forEach((mesh, idx) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (idx === activeIdx) {
          mat.color.setHex(0xf59e0b);
          mat.emissive.setHex(0xf59e0b);
          mat.emissiveIntensity = 0.9;
          mesh.scale.set(1.4, 1.4, 1.4);
        } else {
          mat.color.setHex(0x181e28);
          mat.emissive.setHex(0x38bdf8);
          mat.emissiveIntensity = 0.3;
          mesh.scale.set(1.0, 1.0, 1.0);
        }
      });

      // Scale active plane slightly
      planeMeshes.forEach((p, idx) => {
        if (idx === activeIdx) {
          p.scale.set(1.25, 1.25, 1.25);
        } else {
          p.scale.set(1.0, 1.0, 1.0);
        }
      });

      // Camera focal lerping toward active node position
      const targetAngle = (activeIdx / nodeCount) * Math.PI * 2 + nodeGroup.rotation.y;
      const targetX = Math.cos(targetAngle) * (orbitRadius + 4);
      const targetZ = Math.sin(targetAngle) * (orbitRadius + 4);

      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.z += (targetZ - camera.position.z) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onPointerDown);

      coreGeo.dispose();
      coreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      nodeMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      planeMeshes.forEach((p) => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });
      loadedTextures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [viewMode, handleSelectDay]);

  return (
    <section
      id="orbital-itinerary"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative py-24 px-6 sm:px-8 bg-[#090b0e] text-white overflow-hidden border-t border-white/8 select-none focus:outline-none"
      aria-label="3D Orbital Itinerary Timeline"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Temporal Spatial Arc
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10">
                {viewMode === '3d' ? '3D WebGL Orbital View' : '2D Accessible View'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-white">
              {headingTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle: 3D vs 2D */}
            <button
              onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 border border-white/10 transition-colors"
            >
              {viewMode === '3d' ? (
                <>
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>2D List Fallback</span>
                </>
              ) : (
                <>
                  <Box className="w-3.5 h-3.5 text-amber-400" />
                  <span>3D Orbit View</span>
                </>
              )}
            </button>

            {viewMode === '3d' && (
              <button
                onClick={() => setIsRotating(!isRotating)}
                title={isRotating ? 'Pause rotation' : 'Resume rotation'}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors"
              >
                {isRotating ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            )}
          </div>
        </div>

        {/* 3D WebGL Orbital Viewport */}
        {viewMode === '3d' && (
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-white/12 shadow-2xl bg-[#090b0e] mb-10">
            <div ref={mountRef} className="w-full h-full cursor-pointer" />

            {/* Quick Day Selector Dock inside 3D canvas */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-[#0e1117]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
              {nodes.map((node, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectDay(i)}
                  className={`w-7 h-7 rounded-full text-xs font-mono font-bold transition-all ${
                    i === activeDayIndex
                      ? 'bg-amber-400 text-neutral-950 scale-110 shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {node.day}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2D Accessible List Fallback */}
        {viewMode === '2d' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {nodes.map((node, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectDay(idx)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  idx === activeDayIndex
                    ? 'bg-amber-500/15 border-amber-400/80 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono text-amber-400 font-bold">Day {node.day}</span>
                  <span className="text-[10px] font-mono text-neutral-400">{node.time}</span>
                </div>
                <h4 className="text-sm font-serif text-white line-clamp-1">{node.title}</h4>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{node.summary}</p>
              </button>
            ))}
          </div>
        )}

        {/* Active Node Detail Card */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-[#12161f] border border-white/12 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-full sm:w-1/3 aspect-[4/3] rounded-xl overflow-hidden border border-white/10 shrink-0">
            <SmartImage
              src={activeNode.image}
              fallbackUrls={activeNode.fallbackUrls}
              placeName={activeNode.title}
              alt={activeNode.title}
              aspectRatio="4/3"
              className="w-full h-full object-cover filter brightness-[0.88]"
            />
          </div>

          <div className="flex-1 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Day {activeNode.day} Protocol Focus
              </span>
              <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {activeNode.time}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">
              {activeNode.title}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
              {activeNode.details}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{activeNode.location}</span>
                <span className="text-neutral-600">·</span>
                <span className="text-neutral-500">{activeNode.coordinateLabel}</span>
              </div>

              <Link
                to="/trips"
                className="text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                <span>Browse All Departures</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
