import React, { Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// This dynamically loads the actual recovered models from your C: drive
const UnityModel = ({ modelName }: { modelName: string }) => {
  // Path mapped via our Vite Bridge in vite.config.ts
  const gltf = useLoader(GLTFLoader, /@assets/\.gltf);
  return <primitive object={gltf.scene} scale={1.5} />;
};

export default UnityModel;
