import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, PerspectiveCamera } from '@react-three/drei';
function ArenaModel() {
  // Loading the specific file from your public/models folder
  const { scene } = useGLTF('./models/arena_teleport_v03.nvscene.json');
  return <primitive object={scene} scale={1.5} />;
}
export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505' }}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 5, 15]} />
          <Stage intensity={0.5} environment="city" adjustCamera={false}>
            <ArenaModel />
          </Stage>
          <OrbitControls makeDefault />
        </Suspense>
      </Canvas>
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'cyan', fontFamily: 'monospace', pointerEvents: 'none' }}>
        🔱 NOODLE-VISION NEXUS: ARENA v03 ACTIVE
      </div>
    </div>
  );
}