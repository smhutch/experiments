// transform coordinates into clip space coordinates
uniform mat4 projectionMatrix;
// apply transformations relative to the Camera (position, rotation, FoV, near, far) 
uniform mat4 viewMatrix;
// apply transformations relative to the Mesh (position, rotation, scale)
uniform mat4 modelMatrix;
// wave frequencies, controlled from the UI
uniform vec2 uFrequency;
// elapsed animation time
uniform float uTime;

// This position attribute comes from the Three.js geometry.
attribute vec3 position;
// uv comes from the Three.js geometry.
attribute vec2 uv;
// A custom attribute
attribute float aRandom;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  modelPosition.z += sin(modelPosition.y * uFrequency.y) * 0.1;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
