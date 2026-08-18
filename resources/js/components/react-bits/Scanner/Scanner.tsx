import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

import "./Scanner.css";

type ScanDirection = "vertical" | "horizontal" | "diagonal";

export interface ScannerProps {
    color1?: string;
    color2?: string;
    color3?: string;
    speed?: number;
    sweepSpeed?: number;
    sweepWidth?: number;
    sweepFalloff?: number;
    scale?: number;
    frequency?: number;
    ripple?: number;
    bandDensity?: number;
    lineSharpness?: number;
    glow?: number;
    scanDirection?: ScanDirection;
    colorSpread?: number;
    brightness?: number;
    contrast?: number;
    softness?: number;
    vignette?: number;
    scanline?: boolean;
    grain?: boolean;
    grainIntensity?: number;
    opacity?: number;
    mouseInteraction?: boolean;
    mouseRadius?: number;
    mouseStrength?: number;
    className?: string;
}

interface ScannerContext {
    renderer: Renderer;
    program: Program;
    mesh: Mesh;
}

const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result) {
        return [1, 1, 1];
    }

    return [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
    ];
};

const directionToFloat = (direction: ScanDirection): number => {
    if (direction === "horizontal") {
        return 1.0;
    }

    if (direction === "diagonal") {
        return 2.0;
    }

    return 0.0;
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uSweepSpeed;
uniform float uSweepWidth;
uniform float uSweepFalloff;
uniform float uScale;
uniform float uFrequency;
uniform float uRipple;
uniform float uBandDensity;
uniform float uLineSharpness;
uniform float uGlow;
uniform float uColorSpread;
uniform float uBrightness;
uniform float uContrast;
uniform float uSoftness;
uniform float uVignette;
uniform float uOpacity;
uniform float uScanline;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uDirection;
uniform vec2 uMouse;
uniform float uMouseEnabled;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uMouseActive;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

const float TAU = 6.2831853;

float signalField(vec2 p, float t) {
  float w = sin(p.x * 1.3 + t * 0.7);
  w += sin(p.y * 1.7 - t * 0.52) * 0.8;
  w += sin((p.x + p.y) * 0.9 + t * 0.91) * 0.6;
  w += sin((p.x - p.y) * 1.53 - t * 0.63) * 0.42;
  return w * 0.35;
}

vec3 palette(float f) {
  f = clamp(f, 0.0, 1.0);
  f = pow(f, uContrast);
  vec3 c = mix(uColor1, uColor2, smoothstep(0.08, 0.6, f));
  return mix(c, uColor3, smoothstep(0.68, 1.0, f));
}

float scanBand(float x, float aa, float sharp) {
  float v = mix(0.5, 0.5 + 0.5 * cos(x * TAU), aa);
  return pow(v, sharp);
}

void main() {
  float aspect = iResolution.x / iResolution.y;
  vec2 uv0 = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
  vec2 p = uv0 / max(uScale, 0.001);

  float t = iTime * uSpeed;

  float mouseBoost = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mUv = vec2((uMouse.x * 2.0 - 1.0) * aspect, uMouse.y * 2.0 - 1.0);
    vec2 md = uv0 - mUv;
    float r = max(uMouseRadius, 0.001);
    mouseBoost = exp(-dot(md, md) / (r * r)) * uMouseStrength * uMouseActive;
  }

  float axis;
  if (uDirection < 0.5) axis = p.y;
  else if (uDirection < 1.5) axis = p.x;
  else axis = (p.x + p.y) * 0.70710678;

  float sig = signalField(p * uFrequency, t);
  float coord = axis + sig * uRipple;

  float phase = coord / max(uSweepWidth, 0.05) - t * uSweepSpeed;
  float sweep = pow(0.5 + 0.5 * cos(phase * TAU), max(uSweepFalloff, 0.1));

  float lc = coord * uBandDensity;
  float aa = 1.0 / (1.0 + uSoftness * fwidth(lc) * 3.0);
  aa = clamp(aa * (1.0 + mouseBoost * 0.6), 0.0, 1.0);

  float bodyBase = clamp(0.5 + 0.5 * sig, 0.0, 1.0);
  float body = bodyBase * bodyBase * uGlow * sweep;

  float sharp = max(uLineSharpness, 0.1);
  float split = uColorSpread * 0.16;
  float fr = clamp(scanBand(lc + split, aa, sharp) * sweep + body, 0.0, 1.0);
  float fg = clamp(scanBand(lc, aa, sharp) * sweep + body, 0.0, 1.0);
  float fb = clamp(scanBand(lc - split, aa, sharp) * sweep + body, 0.0, 1.0);

  vec3 col = vec3(palette(fr).r, palette(fg).g, palette(fb).b);

  float inten = (fr + fg + fb) * 0.3333333 * uBrightness;
  inten *= 1.0 + mouseBoost * 0.9;

  if (uScanline > 0.5) {
    inten *= 1.0 - 0.18 * (0.5 + 0.5 * cos(gl_FragCoord.y * 1.7));
  }

  if (uGrain > 0.5) {
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453);
    inten += (g - 0.5) * uGrainIntensity;
  }

  inten *= clamp(1.0 - uVignette * smoothstep(0.55, 1.65, length(uv0)), 0.0, 1.0);
  inten = clamp(inten, 0.0, 1.0);

  float a = clamp(inten * uOpacity, 0.0, 1.0);
  fragColor = vec4(clamp(col, 0.0, 1.0) * a, a);
}
`;

const ctxMap = new WeakMap<HTMLDivElement, ScannerContext>();

export function Scanner({
    color1 = "#163B5C",
    color2 = "#0E7373",
    color3 = "#F7FAFC",
    speed = 0.45,
    sweepSpeed = 0.22,
    sweepWidth = 1.6,
    sweepFalloff = 6,
    scale = 1.5,
    frequency = 2,
    ripple = 0.18,
    bandDensity = 10,
    lineSharpness = 5.5,
    glow = 0.18,
    scanDirection = "vertical",
    colorSpread = 0.55,
    brightness = 0.95,
    contrast = 1.1,
    softness = 1.5,
    vignette = 0.55,
    scanline = true,
    grain = true,
    grainIntensity = 0.035,
    opacity = 0.72,
    mouseInteraction = true,
    mouseRadius = 0.5,
    mouseStrength = 0.35,
    className = "",
}: ScannerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseEnabledRef = useRef(mouseInteraction);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        let renderer: Renderer;

        try {
            renderer = new Renderer({
                webgl: 2,
                alpha: true,
                premultipliedAlpha: true,
                antialias: false,
                dpr: Math.min(window.devicePixelRatio || 1, 2),
            });
        } catch (error) {
            if (import.meta.env.DEV) {
                console.warn("Scanner: WebGL2 is unavailable.", error);
            }

            return;
        }

        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);

        const canvas = gl.canvas as HTMLCanvasElement;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        container.appendChild(canvas);

        const geometry = new Triangle(gl);
        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new Float32Array([1, 1]) },
                uSpeed: { value: speed },
                uSweepSpeed: { value: sweepSpeed },
                uSweepWidth: { value: sweepWidth },
                uSweepFalloff: { value: sweepFalloff },
                uScale: { value: scale },
                uFrequency: { value: frequency },
                uRipple: { value: ripple },
                uBandDensity: { value: bandDensity },
                uLineSharpness: { value: lineSharpness },
                uGlow: { value: glow },
                uColorSpread: { value: colorSpread },
                uBrightness: { value: brightness },
                uContrast: { value: contrast },
                uSoftness: { value: softness },
                uVignette: { value: vignette },
                uOpacity: { value: opacity },
                uScanline: { value: scanline ? 1.0 : 0.0 },
                uGrain: { value: grain ? 1.0 : 0.0 },
                uGrainIntensity: { value: grainIntensity },
                uDirection: { value: directionToFloat(scanDirection) },
                uMouse: { value: new Float32Array([0.5, 0.5]) },
                uMouseEnabled: { value: mouseInteraction ? 1.0 : 0.0 },
                uMouseRadius: { value: mouseRadius },
                uMouseStrength: { value: mouseStrength },
                uMouseActive: { value: 0.0 },
                uColor1: { value: new Float32Array(hexToRgb(color1)) },
                uColor2: { value: new Float32Array(hexToRgb(color2)) },
                uColor3: { value: new Float32Array(hexToRgb(color3)) },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });
        ctxMap.set(container, { renderer, program, mesh });

        const setSize = () => {
            const rect = container.getBoundingClientRect();
            const width = Math.max(1, Math.floor(rect.width));
            const height = Math.max(1, Math.floor(rect.height));
            renderer.setSize(width, height);
            const resolution = program.uniforms.iResolution
                .value as Float32Array;
            resolution[0] = gl.drawingBufferWidth;
            resolution[1] = gl.drawingBufferHeight;
            renderer.render({ scene: mesh });
        };

        const resizeObserver = new ResizeObserver(setSize);
        resizeObserver.observe(container);
        setSize();

        let currentMouse = [0.5, 0.5];
        let targetMouse = [0.5, 0.5];
        let mouseActive = 0;
        let targetMouseActive = 0;

        const onMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            targetMouse = [
                (event.clientX - rect.left) / rect.width,
                1.0 - (event.clientY - rect.top) / rect.height,
            ];
            targetMouseActive = 1;
        };

        const onMouseLeave = () => {
            targetMouseActive = 0;
        };

        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseleave", onMouseLeave);

        let animationId = 0;
        let isVisible = true;
        let isPageVisible = !document.hidden;
        const startTime = performance.now();

        const loop = (time: number) => {
            program.uniforms.iTime.value = (time - startTime) * 0.001;

            if (!mouseEnabledRef.current) {
                targetMouseActive = 0;
            }

            currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
            currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
            (program.uniforms.uMouse.value as Float32Array)[0] =
                currentMouse[0];
            (program.uniforms.uMouse.value as Float32Array)[1] =
                currentMouse[1];
            mouseActive += 0.05 * (targetMouseActive - mouseActive);
            program.uniforms.uMouseActive.value = mouseActive;

            renderer.render({ scene: mesh });
            animationId = requestAnimationFrame(loop);
        };

        const tryStart = () => {
            if (isVisible && isPageVisible && animationId === 0) {
                animationId = requestAnimationFrame(loop);
            }
        };

        const tryStop = () => {
            if (animationId !== 0) {
                cancelAnimationFrame(animationId);
                animationId = 0;
            }
        };

        const intersectionObserver = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    tryStart();
                } else {
                    tryStop();
                }
            },
            { threshold: 0 },
        );
        intersectionObserver.observe(container);

        const onVisibilityChange = () => {
            isPageVisible = !document.hidden;
            if (isPageVisible) {
                tryStart();
            } else {
                tryStop();
            }
        };

        document.addEventListener("visibilitychange", onVisibilityChange);
        tryStart();

        return () => {
            tryStop();
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            document.removeEventListener(
                "visibilitychange",
                onVisibilityChange,
            );
            canvas.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("mouseleave", onMouseLeave);
            ctxMap.delete(container);

            if (canvas.parentNode === container) {
                container.removeChild(canvas);
            }

            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const context = ctxMap.get(container);

        if (!context) {
            return;
        }

        const uniforms = context.program.uniforms;

        uniforms.uSpeed.value = speed;
        uniforms.uSweepSpeed.value = sweepSpeed;
        uniforms.uSweepWidth.value = sweepWidth;
        uniforms.uSweepFalloff.value = sweepFalloff;
        uniforms.uScale.value = scale;
        uniforms.uFrequency.value = frequency;
        uniforms.uRipple.value = ripple;
        uniforms.uBandDensity.value = bandDensity;
        uniforms.uLineSharpness.value = lineSharpness;
        uniforms.uGlow.value = glow;
        uniforms.uColorSpread.value = colorSpread;
        uniforms.uBrightness.value = brightness;
        uniforms.uContrast.value = contrast;
        uniforms.uSoftness.value = softness;
        uniforms.uVignette.value = vignette;
        uniforms.uOpacity.value = opacity;
        uniforms.uScanline.value = scanline ? 1.0 : 0.0;
        uniforms.uGrain.value = grain ? 1.0 : 0.0;
        uniforms.uGrainIntensity.value = grainIntensity;
        uniforms.uDirection.value = directionToFloat(scanDirection);
        uniforms.uMouseEnabled.value = mouseInteraction ? 1.0 : 0.0;
        uniforms.uMouseRadius.value = mouseRadius;
        uniforms.uMouseStrength.value = mouseStrength;

        const c1 = hexToRgb(color1);
        const c2 = hexToRgb(color2);
        const c3 = hexToRgb(color3);
        (uniforms.uColor1.value as Float32Array).set(c1);
        (uniforms.uColor2.value as Float32Array).set(c2);
        (uniforms.uColor3.value as Float32Array).set(c3);

        mouseEnabledRef.current = mouseInteraction;
    }, [
        speed,
        sweepSpeed,
        sweepWidth,
        sweepFalloff,
        scale,
        frequency,
        ripple,
        bandDensity,
        lineSharpness,
        glow,
        colorSpread,
        brightness,
        contrast,
        softness,
        vignette,
        opacity,
        scanline,
        grain,
        grainIntensity,
        scanDirection,
        mouseInteraction,
        mouseRadius,
        mouseStrength,
        color1,
        color2,
        color3,
    ]);

    return (
        <div
            ref={containerRef}
            className={`scanner-container ${className}`.trim()}
        />
    );
}
