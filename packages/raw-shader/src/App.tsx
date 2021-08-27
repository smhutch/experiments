import React, { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib/controls/OrbitControls";

import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";
import { useControls } from "leva";
import { render } from "react-dom";
import { Mesh, PlaneBufferGeometry } from "three";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ASPECT = WIDTH / HEIGHT;

// These are initialized once to avoid rebuilding the entire scene
// when UI controls change
let clock: THREE.Clock | undefined;
let scene: THREE.Scene | undefined;
let camera: THREE.Camera | undefined;
let mesh: THREE.Mesh<THREE.BufferGeometry, THREE.RawShaderMaterial> | undefined;
let orbit: OrbitControls | undefined;
let renderer: THREE.Renderer | undefined;

const initialControls = {
  color: "#FFFFFF",
  frequencyX: 10,
  frequencyY: 8,
  wireframe: true,
  segments: 16,
};

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);

  const controls = useControls({
    frequencyX: {
      value: initialControls.frequencyX,
      min: 1,
      max: 20,
    },
    frequencyY: {
      value: initialControls.frequencyY,
      min: 1,
      max: 20,
    },
    wireframe: initialControls.wireframe,
    color: initialControls.color,
  });

  useEffect(() => {
    const init = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Init scene
      scene = new THREE.Scene();

      // Init camera
      camera = new THREE.PerspectiveCamera(45, ASPECT, 1, 1000);
      camera.position.z = 1.5;
      camera.position.y = -1;
      camera.position.x = 0.5;

      // Init orbit controls
      orbit = new OrbitControls(camera, canvas);
      orbit.enableDamping = true;

      // Init mesh
      const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
        wireframe: initialControls.wireframe,
        transparent: true,
        uniforms: {
          uFrequency: {
            value: new THREE.Vector2(
              initialControls.frequencyX,
              initialControls.frequencyY
            ),
          },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#FFFFFF") },
        },
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Init renderer
      renderer = new THREE.WebGLRenderer({ canvas });
      renderer.setSize(WIDTH, HEIGHT);

      clock = new THREE.Clock();
    };

    if (!renderer) {
      // Initialize scene once.
      init();
    }

    let frameRequest = 0;

    const draw = () => {
      // Checks to keep TS happy. In practice these should never be undefined here.
      if (!renderer || !scene || !camera || !orbit || !mesh || !clock) return;

      const elapsedTime = clock.getElapsedTime();

      // Mutate values controlled from the UI
      mesh.material.wireframe = controls.wireframe;
      mesh.material.uniforms.uFrequency.value.x = controls.frequencyX;
      mesh.material.uniforms.uFrequency.value.y = controls.frequencyY;
      mesh.material.uniforms.uColor.value = new THREE.Color(controls.color);

      // Mutate animated values
      mesh.material.uniforms.uTime.value = elapsedTime;

      orbit.update();
      renderer.render(scene, camera);

      frameRequest = requestAnimationFrame(draw);
    };

    frameRequest = requestAnimationFrame(draw);

    () => {
      // When controls change, cancel existing animation frame requests
      cancelAnimationFrame(frameRequest);
    };
  }, [controls]);

  return (
    <Suspense fallback={null}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </Suspense>
  );
}
