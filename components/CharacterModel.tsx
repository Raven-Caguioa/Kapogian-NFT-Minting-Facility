'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

function PlaceholderModel() {
  return (
    <group position-y={-0.5}>
      <Text
        color="hsl(var(--foreground))"
        anchorX="center"
        anchorY="middle"
        fontSize={0.25}
        maxWidth={3}
        textAlign="center"
        lineHeight={1.2}
      >
        3D Model Not Found
        {'\n\n'}
        Please add the `pogito.glb` file to your project's `/public` folder.
      </Text>
    </group>
  );
}

export default function CharacterModel() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 50 }}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, touchAction: 'none' }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <PlaceholderModel />
      </Suspense>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
