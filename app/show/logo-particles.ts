import type { RevealStyle } from "./band-choreography";

const STYLES: RevealStyle[] = ["supernova", "embers", "confetti", "ribbons", "rose", "butterfly", "glitch", "rain", "eclipse", "dream", "prism", "impact"];

const VERTEX = `
attribute vec2 aHome;
attribute vec4 aColor;
attribute float aSeed;
uniform vec2 uViewport;
uniform vec2 uLogoSize;
uniform vec2 uPointer;
uniform float uTime;
uniform float uStyle;
uniform float uPointSize;
uniform float uGlow;
varying vec4 vColor;
varying float vGlow;
float hash(float x) { return fract(sin(x * 127.1) * 43758.5453); }
void main() {
  float s = aSeed;
  float delay = hash(s + 1.0) * .24;
  float t = clamp((uTime - delay) / 1.6, 0.0, 1.0);
  float p = t * t;
  vec2 home = aHome * uLogoSize * .5;
  vec2 pos = home;
  float angle = atan(home.y,home.x) + (hash(s + 3.0) - .5) * .7;
  vec2 radial = vec2(cos(angle),sin(angle));
  float rand = hash(s + 4.0);
  float depth = 1.0;
  if (uStyle < .5) {
    pos += radial * p * (200.0 + rand * 600.0);
    depth += p * (rand - .25) * 2.0;
  } else if (uStyle < 1.5) {
    pos.x += sin(t * 9.0 + s) * t * 65.0;
    pos.y -= p * (180.0 + rand * 520.0);
  } else if (uStyle < 2.5) {
    pos += radial * t * (180.0 + rand * 290.0);
    pos.y += (t*t*550.0 - t*240.0);
  } else if (uStyle < 3.5) {
    pos.x += sin(home.y*.035+t*7.0) * p * 380.0;
    pos.y -= p * (140.0+rand*220.0);
  } else if (uStyle < 4.5) {
    float petal = floor((angle+3.14159)/.5236)*.5236;
    pos += vec2(cos(petal+t),sin(petal+t)) * p * (180.0+rand*350.0);
    depth = 1.0 + sin(p*3.14)*rand;
  } else if (uStyle < 5.5) {
    pos.x += sign(home.x) * p * 300.0 + sin(t*18.0+s)*t*30.0;
    pos.y -= t*t*(180.0+rand*340.0);
  } else if (uStyle < 6.5) {
    float row = floor(home.y/7.0);
    pos.x += (hash(row)-.5)*floor(t*8.0)*120.0;
    pos.y += floor(t*5.0)*sin(row)*4.0;
  } else if (uStyle < 7.5) {
    pos.y += p*(250.0+rand*550.0);
    pos.x -= p*100.0;
  } else if (uStyle < 8.5) {
    pos.x += sign(home.x)*p*(280.0+rand*220.0);
    pos.y += sin(home.x*.015+t*4.0)*t*55.0;
    depth = 1.0-p*.65;
  } else if (uStyle < 9.5) {
    float a = angle+t*5.0;
    pos = vec2(cos(a),sin(a))*length(home)*(1.0-p);
    depth = 1.0+p*2.0;
  } else if (uStyle < 10.5) {
    pos.x += sign(home.x)*p*260.0;
    pos.y += sin(floor(home.x/30.0))*p*330.0;
    depth = 1.0+sin(t*4.0)*rand;
  } else {
    pos += radial * pow(t,.65) * (250.0+rand*550.0);
    pos.y += p*120.0;
    depth = 1.0+p*rand*2.0;
  }
  pos += uPointer*t*(.5+rand);
  gl_Position = vec4(pos.x/uViewport.x*2.0,-pos.y/uViewport.y*2.0,0.0,1.0);
  gl_PointSize = max(1.0,uPointSize*depth*(1.0-t*.7)*(uGlow>.5?3.5:1.0));
  float alpha = aColor.a*(1.0-smoothstep(.32,1.0,t));
  vec3 tint = aColor.rgb;
  if (uStyle> .5 && uStyle<1.5) tint=mix(tint,vec3(1.0,.38,.08),t);
  if (uStyle>5.5 && uStyle<6.5) tint=mix(tint,vec3(.15,.95,1.0),t*.8);
  if (uStyle>6.5 && uStyle<7.5) tint=mix(tint,vec3(.65,.88,1.0),t*.7);
  if ((uStyle>3.5 && uStyle<4.5) || (uStyle>7.5 && uStyle<8.5)) tint=mix(tint,vec3(.72,.53,1.0),t*.75);
  vColor=vec4(tint,alpha);
  vGlow=uGlow;
}`;

const FRAGMENT = `
precision mediump float;
varying vec4 vColor;
varying float vGlow;
void main() {
  float d=length(gl_PointCoord-.5)*2.0;
  if(d>1.0) discard;
  float a=vGlow>.5?pow(1.0-d,2.0)*.24:1.0-smoothstep(.65,1.0,d);
  gl_FragColor=vec4(vColor.rgb,vColor.a*a);
}`;

/** A deterministic GPU simulation: seeking never depends on the previous frame. */
export function createLogoParticles(canvas: HTMLCanvasElement, src: string, style: RevealStyle) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: "low-power" });
  if (!gl) return null; // The existing CSS fragments remain the fallback.
  const shaders: WebGLShader[] = [];
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let disposed = false;
  let ready = false;
  let count = 0;
  let imageAspect = 2;
  let sampleWidth = 1;
  let width = 0;
  let height = 0;
  let lastTime = -1;
  let pointer = [0, 0];
  const root = canvas.closest<HTMLElement>(".show-page")!;

  try {
    for (const [type, source] of [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, FRAGMENT]] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("No shader");
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Shader compilation failed");
    }
    program = gl.createProgram();
    if (!program) throw new Error("No program");
    shaders.forEach((shader) => gl.attachShader(program!, shader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Program link failed");
    buffer = gl.createBuffer();
    if (!buffer) throw new Error("No buffer");
  } catch {
    shaders.forEach((shader) => gl.deleteShader(shader));
    if (program) gl.deleteProgram(program);
    return null;
  }
  const uniforms = Object.fromEntries(["uViewport", "uLogoSize", "uPointer", "uTime", "uStyle", "uPointSize", "uGlow"].map((name) => [name, gl.getUniformLocation(program!, name)]));
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  for (const [name, size, offset] of [["aHome", 2, 0], ["aColor", 4, 8], ["aSeed", 1, 24]] as const) {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 28, offset);
  }
  gl.enable(gl.BLEND);
  gl.clearColor(0, 0, 0, 0);

  function draw(time: number) {
    lastTime = time;
    if (disposed || gl!.isContextLost()) return;
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    if (!ready || width <= 0 || height <= 0 || time < 0 || time > 2.15) return;
    const mobile = window.innerWidth <= 600;
    const boxWidth = mobile ? window.innerWidth * .86 : Math.min(window.innerWidth * .65, 760);
    const boxHeight = mobile ? 240 : Math.min(window.innerHeight * .38, 320);
    const logoWidth = Math.min(boxWidth, boxHeight * imageAspect);
    gl!.uniform2f(uniforms.uViewport, width, height);
    gl!.uniform2f(uniforms.uLogoSize, logoWidth, logoWidth / imageAspect);
    gl!.uniform2f(uniforms.uPointer, pointer[0], pointer[1]);
    gl!.uniform1f(uniforms.uTime, time);
    gl!.uniform1f(uniforms.uStyle, STYLES.indexOf(style));
    gl!.uniform1f(uniforms.uPointSize, logoWidth / sampleWidth * (canvas.width / width) * 2.2);
    gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE);
    gl!.uniform1f(uniforms.uGlow, 1);
    gl!.drawArrays(gl!.POINTS, 0, count);
    gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);
    gl!.uniform1f(uniforms.uGlow, 0);
    gl!.drawArrays(gl!.POINTS, 0, count);
  }

  const observer = new ResizeObserver(([entry]) => {
    width = entry.contentRect.width;
    height = entry.contentRect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    gl!.viewport(0, 0, canvas.width, canvas.height);
    draw(lastTime);
  });
  observer.observe(canvas);
  const img = new Image();
  img.onload = () => {
    if (disposed) return;
    const sample = document.createElement("canvas");
    imageAspect = img.naturalWidth / img.naturalHeight;
    sample.width = Math.min(240, img.naturalWidth);
    sample.height = Math.max(1, Math.round(sample.width / imageAspect));
    sampleWidth = sample.width;
    const ctx = sample.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, sample.width, sample.height);
    const pixels = ctx.getImageData(0, 0, sample.width, sample.height).data;
    const vertices: number[] = [];
    for (let y = 0; y < sample.height; y += 2) for (let x = 0; x < sample.width; x += 2) {
      const offset = (y * sample.width + x) * 4;
      if (pixels[offset + 3] < 40) continue;
      vertices.push(x / sample.width * 2 - 1, y / sample.height * 2 - 1, pixels[offset] / 255, pixels[offset + 1] / 255, pixels[offset + 2] / 255, pixels[offset + 3] / 255, y * sample.width + x);
    }
    count = vertices.length / 7;
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
    gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array(vertices), gl!.STATIC_DRAW);
    ready = count > 0;
    if (ready) root.dataset.particles = "ready";
    draw(lastTime);
  };
  img.src = src;
  const lose = (event: Event) => { event.preventDefault(); ready = false; delete root.dataset.particles; };
  canvas.addEventListener("webglcontextlost", lose);
  return {
    draw,
    move(x: number, y: number) { pointer = [x, y]; },
    dispose() {
      disposed = true;
      observer.disconnect();
      img.onload = null;
      delete root.dataset.particles;
      canvas.removeEventListener("webglcontextlost", lose);
      gl!.deleteBuffer(buffer);
      gl!.deleteProgram(program);
      shaders.forEach((shader) => gl!.deleteShader(shader));
    },
  };
}
