import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2, 1),
      new THREE.MeshPhongMaterial({ color: 0x006194, wireframe: true, transparent: true, opacity: 0.3 }),
    );
    group.add(core);

    const outerShell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.8, 0),
      new THREE.MeshPhongMaterial({ color: 0x007bb9, wireframe: true, transparent: true, opacity: 0.1 }),
    );
    group.add(outerShell);

    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(80 * 3);
    for (let i = 0; i < 80 * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 8;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particles = new THREE.Points(
      particlesGeo,
      new THREE.PointsMaterial({ size: 0.03, color: 0x006194, transparent: true, opacity: 0.6 }),
    );
    scene.add(particles);

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(1, 1, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      group.rotation.y += 0.003;
      group.rotation.x += 0.001;
      particles.rotation.y += 0.0005;
      group.position.x += (mouseX * 0.8 - group.position.x) * 0.03;
      group.position.y += (-mouseY * 0.8 - group.position.y) * 0.03;
      renderer.render(scene, camera);
    }

    animate();

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-5 opacity-60 pointer-events-none" />;
}
