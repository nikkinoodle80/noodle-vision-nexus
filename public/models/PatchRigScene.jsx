import modelData from "../data/model.json";
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function PatchRigScene() {
  const mountRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x111111);
      const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      mountRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
      const material = new THREE.MeshStandardMaterial({ color: 0xff0051 });
      const knot = new THREE.Mesh(geometry, material);
      scene.add(knot);

      const light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(10, 10, 10);
      scene.add(light);

      const animate = function () {
        requestAnimationFrame(animate);
        knot.rotation.x += 0.01;
        knot.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      setError('WebGL not available');
      console.log('3D rendering disabled:', err.message);
    }
  }, []);

  if (error) {
    return (
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Patch Cable Rig (3D Preview)</h2>
        <div style={{ width: '100%', height: '400px', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ff' }}>
          [3D Rendering Disabled - WebGL Required]
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Patch Cable Rig (3D Preview)</h2>
      <div ref={mountRef} style={{ width: '100%', height: '400px' }} className="border" />
    </div>
  );
}
useEffect(() => {
  console.log("🧠 Model Loaded:", modelData);
}, []);
