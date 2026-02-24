import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, GradientTexture, Sphere } from '@react-three/drei';
// import { SafeHUD } from './components/SafeHUD';

function PulseSphere() {
  const mesh = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.distortion = Math.sin(time) * 0.4 + 0.5;
  });

  return (
    <Sphere ref={mesh} args={[1, 100, 100]} scale={1.5}>
      <MeshDistortMaterial
        color="#00ffff"
        speed={2}
        distort={0.5}
        radius={1}
        transmission={1}
        thickness={2}
        roughness={0.1}
        metalness={0.1}
      />
    </Sphere>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      {/* <SafeHUD /> */}
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <PulseSphere />
      </Canvas>
    </div>
  );
}
