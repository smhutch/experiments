  precision mediump float;

  varying vec2 vUv;
  varying float vWave;

  uniform float uTime;

  #pragma glslify: noise3 = require(glsl-noise/simplex/3d);

  void main() {
    vUv = uv;

    vec3 pos = position;
    float noiseFreq = 1.0;
    float noiseAmp = 0.25;
    vec3 noisePos = vec3(position.x * noiseFreq + uTime, pos.y, pos.z * noiseFreq + uTime);
    pos.z += noise3(noisePos) * noiseAmp;
    vWave = pos.z;
    pos.x += noise3(noisePos) * noiseAmp * 0.2;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
