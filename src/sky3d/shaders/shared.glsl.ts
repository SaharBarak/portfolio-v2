// Shared GLSL shader utilities

// Basic 2D noise function
export const noiseGLSL = /* glsl */ `
  // Hash function for noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // 2D noise function
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
`;

// Stars shader
export const starsGLSL = /* glsl */ `
  // Generate procedural stars
  float stars(vec2 uv, float density) {
    vec2 id = floor(uv * density);
    vec2 gv = fract(uv * density) - 0.5;

    float n = hash(id);
    float size = fract(n * 345.32) * 0.02;
    float brightness = smoothstep(size, 0.0, length(gv));

    // Twinkle
    float twinkle = sin(n * 6.28 + n * 100.0) * 0.5 + 0.5;
    brightness *= twinkle;

    return brightness * step(0.97, n);
  }
`;

// FBM (Fractal Brownian Motion) for clouds
export const fbmGLSL = /* glsl */ `
  // Hash function for noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // 2D noise function
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Cloud rotation matrix
  const mat2 cloudMatrix = mat2(1.6, 1.2, -1.2, 1.6);

  // Fractal Brownian Motion
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
      f += w * noise(p);
      p = cloudMatrix * p;
      w *= 0.5;
    }
    return f;
  }
`;
