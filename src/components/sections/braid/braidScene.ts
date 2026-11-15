/**
 * Procedural three-strand braid of fine gold wire, rendered with Three.js.
 *
 * Every wire is a tube whose centreline is computed on the GPU, so the whole
 * braid is one mesh and one draw call, and scroll progress can morph it from
 * three parallel ribbons into an interlaced braid without rebuilding geometry.
 *
 * Braid model: strand k (phase φk = 2πk/3) follows
 *   y = A·sin(f·t + φk),  z = B·sin(2(f·t + φk))
 * which produces the alternating over/under crossings of a plait. With f = 0
 * the strands lie side by side, untouched — the state before braiding begins.
 * Each strand is a flat ribbon of fine wires, as in the workshop photographs.
 */
import {
  ACESFilmicToneMapping,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
  type IUniform,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type BraidQuality = "high" | "low";

type Options = {
  reducedMotion: boolean;
  quality: BraidQuality;
};

const STRANDS = 3;

const QUALITY = {
  high: { wires: 7, segments: 720, radial: 8, maxDpr: 2 },
  low: { wires: 5, segments: 420, radial: 6, maxDpr: 1.5 },
} as const;

/** Braid dimensions in scene units. */
const BRAID = {
  halfLength: 7,
  ampY: 0.56,
  ampZ: 0.17,
  /** Angular frequency of the finished braid (radians per unit length). */
  freq: 2.35,
  wireRadius: 0.033,
  ribbonWidth: 0.44,
  /** Signed curvature: a gentle arc, like part of a necklace. */
  bend: -0.05,
};

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function buildGeometry(wires: number, segments: number, radial: number) {
  const perWire = (segments + 1) * (radial + 1);
  const count = perWire * STRANDS * wires;
  const position = new Float32Array(count * 3);
  const strand = new Float32Array(count);
  const wire = new Float32Array(count);
  const index = new Uint32Array(segments * radial * 6 * STRANDS * wires);

  let v = 0;
  let k = 0;
  for (let s = 0; s < STRANDS; s++) {
    for (let w = 0; w < wires; w++) {
      const base = v;
      for (let i = 0; i <= segments; i++) {
        const u = i / segments;
        for (let j = 0; j <= radial; j++) {
          // position.xy carry (u, θ); the vertex shader builds the real position.
          position[v * 3] = u;
          position[v * 3 + 1] = (j / radial) * Math.PI * 2;
          position[v * 3 + 2] = 0;
          strand[v] = s;
          wire[v] = w;
          v++;
        }
      }
      for (let i = 0; i < segments; i++) {
        for (let j = 0; j < radial; j++) {
          const a = base + i * (radial + 1) + j;
          const b = a + radial + 1;
          index[k++] = a;
          index[k++] = a + 1;
          index[k++] = b;
          index[k++] = b;
          index[k++] = a + 1;
          index[k++] = b + 1;
        }
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(position, 3));
  geometry.setAttribute("aStrand", new BufferAttribute(strand, 1));
  geometry.setAttribute("aWire", new BufferAttribute(wire, 1));
  geometry.setIndex(new BufferAttribute(index, 1));
  return geometry;
}

const VERTEX_HEAD = /* glsl */ `
uniform float uFreq;
uniform float uHalfLength;
uniform float uAmpY;
uniform float uAmpZ;
uniform float uWireRadius;
uniform float uWireSpacing;
uniform float uWireCount;
uniform float uBend;
attribute float aStrand;
attribute float aWire;

void braidVertex(in vec3 p, out vec3 outPos, out vec3 outNormal) {
  float t = mix(-uHalfLength, uHalfLength, p.x);
  float theta = p.y;
  float a = uFreq * t + aStrand * 2.0943951;

  vec3 c = vec3(t, uAmpY * sin(a), uAmpZ * sin(2.0 * a));
  vec3 d = vec3(1.0, uAmpY * uFreq * cos(a), 2.0 * uAmpZ * uFreq * cos(2.0 * a));
  vec3 T = normalize(d);
  vec3 W = normalize(cross(vec3(0.0, 0.0, 1.0), T)); // across the ribbon
  vec3 N = cross(T, W);                                // out of the ribbon

  float off = (aWire - (uWireCount - 1.0) * 0.5) * uWireSpacing;
  vec3 wc = c + W * off - N * (off * off) * 0.9;       // ribbon arches slightly
  vec3 n = cos(theta) * W + sin(theta) * N;
  vec3 pos = wc + n * uWireRadius;

  if (abs(uBend) > 1e-4) {
    float ang = pos.x * uBend;
    float s = sin(ang);
    float co = cos(ang);
    pos = vec3(s / uBend + pos.y * s, (co - 1.0) / uBend + pos.y * co, pos.z);
    n = vec3(n.x * co + n.y * s, -n.x * s + n.y * co, n.z);
  }
  outPos = pos;
  outNormal = n;
}
`;

export class BraidScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(30, 1, 0.1, 100);
  private group = new Group();
  private geometry: BufferGeometry;
  private material: MeshStandardMaterial;
  private envDispose: () => void;
  private uniforms: Record<string, IUniform<number>>;

  private target = 0;
  private progress = 0;
  private pointer = { x: 0, y: 0 };
  private pointerSmooth = { x: 0, y: 0 };
  private running = false;
  private frame = 0;
  private start = performance.now();
  private lastFrame = performance.now();
  private reducedMotion: boolean;

  constructor(canvas: HTMLCanvasElement, { reducedMotion, quality }: Options) {
    const q = QUALITY[quality];
    this.reducedMotion = reducedMotion;

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.maxDpr));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = SRGBColorSpace;

    // Studio reflections without loading an HDR file.
    const pmrem = new PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room, 0.04).texture;
    this.scene.environment = envMap;
    this.envDispose = () => {
      envMap.dispose();
      pmrem.dispose();
      room.dispose();
    };

    const key = new DirectionalLight(new Color("#ffe2b3"), 2.4);
    key.position.set(-3, 4, 5);
    const rim = new DirectionalLight(new Color("#ffb259"), 1.6);
    rim.position.set(4, -2, -3);
    this.scene.add(key, rim);

    this.geometry = buildGeometry(q.wires, q.segments, q.radial);
    this.uniforms = {
      uFreq: { value: 0 },
      uHalfLength: { value: BRAID.halfLength },
      uAmpY: { value: BRAID.ampY },
      uAmpZ: { value: BRAID.ampZ },
      uWireRadius: { value: BRAID.wireRadius },
      uWireSpacing: { value: BRAID.ribbonWidth / (q.wires - 1) },
      uWireCount: { value: q.wires },
      uBend: { value: BRAID.bend },
    };

    this.material = new MeshStandardMaterial({
      color: new Color("#e3ae5f"),
      metalness: 1,
      roughness: 0.3,
      envMapIntensity: 1.15,
    });
    this.material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.vertexShader = VERTEX_HEAD + shader.vertexShader;
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <beginnormal_vertex>",
          "vec3 braidPos; vec3 braidNormal;\nbraidVertex(position, braidPos, braidNormal);\nvec3 objectNormal = braidNormal;",
        )
        .replace("#include <begin_vertex>", "vec3 transformed = braidPos;");
    };

    const mesh = new Mesh(this.geometry, this.material);
    mesh.frustumCulled = false; // positions are produced in the shader
    this.group.add(mesh);
    this.group.rotation.set(0.55, -0.18, 0.42);
    this.scene.add(this.group);

    this.camera.position.set(0, 0, 10);

    if (reducedMotion) {
      this.target = this.progress = 1;
    }
    this.applyProgress();
  }

  /** Scroll progress through the section, 0–1. */
  setProgress(value: number) {
    // With reduced motion the model stays in its finished, braided state.
    if (this.reducedMotion) return;
    this.target = value;
    if (!this.running) this.renderOnce();
  }

  /** Pointer position normalised to −1…1. */
  setPointer(x: number, y: number) {
    this.pointer.x = x;
    this.pointer.y = y;
  }

  resize(width: number, height: number) {
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    const aspect = width / height;
    this.camera.aspect = aspect;
    // On narrow (portrait) canvases, run the braid more steeply so it fills the frame.
    const portrait = aspect < 1;
    this.camera.fov = portrait ? 34 : 30;
    this.group.rotation.z = portrait ? 1.0 : 0.42;
    this.camera.updateProjectionMatrix();
    this.renderOnce();
  }

  /** Start or pause the render loop (pause when off-screen). */
  setActive(active: boolean) {
    if (this.reducedMotion) {
      if (active) this.renderOnce();
      return;
    }
    if (active === this.running) return;
    this.running = active;
    if (active) this.frame = requestAnimationFrame(this.loop);
    else cancelAnimationFrame(this.frame);
  }

  dispose() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.geometry.dispose();
    this.material.dispose();
    this.envDispose();
    this.renderer.dispose();
  }

  private loop = () => {
    if (!this.running) return;
    this.renderOnce();
    this.frame = requestAnimationFrame(this.loop);
  };

  private applyProgress() {
    const p = this.progress;
    // 0–0.22: parallel ribbons, seen up close. 0.22–0.9: braiding tightens.
    const braid = smoothstep(0.2, 0.9, p);
    this.uniforms.uFreq.value = BRAID.freq * braid;
    this.camera.position.z = 6.4 + 3.6 * smoothstep(0.0, 0.45, p);
  }

  private renderOnce() {
    const now = performance.now();
    const time = (now - this.start) / 1000;
    // Frame-rate independent easing: the same feel at 30 fps or 120 fps.
    const dt = Math.min(0.1, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    const ease = (rate: number) => 1 - Math.exp(-rate * dt);

    // Ease towards the scroll target so scrubbing feels weighted.
    this.progress += (this.target - this.progress) * (this.reducedMotion ? 1 : ease(5));
    this.applyProgress();

    if (!this.reducedMotion) {
      this.pointerSmooth.x += (this.pointer.x - this.pointerSmooth.x) * ease(3);
      this.pointerSmooth.y += (this.pointer.y - this.pointerSmooth.y) * ease(3);
      // A slow roll about the braid's length shows the over/under depth.
      this.group.rotation.x = 0.55 + Math.sin(time * 0.35) * 0.22 + this.pointerSmooth.y * 0.25;
      this.group.rotation.y = -0.18 + this.pointerSmooth.x * 0.3;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

/** True when the browser can create a WebGL context at all. */
export function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
