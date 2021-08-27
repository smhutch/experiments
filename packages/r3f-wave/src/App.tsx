import React, { Suspense, useRef } from "react";
import { DoubleSide, ShaderMaterial, Texture, TextureLoader } from "three";
import {
  Canvas,
  extend,
  ReactThreeFiber,
  useFrame,
  useLoader,
} from "@react-three/fiber";
import { OrbitControls, shaderMaterial } from "@react-three/drei";

import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

const WaveShaderMaterial = shaderMaterial(
  { uTime: 0, uTexture: new Texture() },
  vertexShader,
  fragmentShader
);

type WaveShaderMaterialType = InstanceType<typeof WaveShaderMaterial>;

extend({ WaveShaderMaterial });

const Wave = () => {
  const shaderMaterialRef = useRef<WaveShaderMaterialType>(null);
  const [image] = useLoader(TextureLoader, [
    "https://images.unsplash.com/photo-1629559189865-5c0e7ed51153?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=882&q=80",
  ]);

  useFrame(({ clock }) => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[0.4, 0.6, 16, 16]} />
      <waveShaderMaterial
        ref={shaderMaterialRef}
        side={DoubleSide}
        uTexture={image}
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, -0.5, 0.5] }}>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <pointLight position={[10, 0, 10]} />
      <Suspense fallback={null}>
        <Wave />
      </Suspense>
    </Canvas>
  );
};

export function App() {
  return <Scene />;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      waveShaderMaterial: ReactThreeFiber.Node<ShaderMaterial, {}> &
        Partial<{
          uTime: number;
          uTexture: Texture;
        }>;
    }
  }
}
