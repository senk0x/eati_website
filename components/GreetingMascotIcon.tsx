"use client";

import { useEffect, useId, useState } from "react";

const VB = 91;

const LEFT_EYE = { x: 24.3281, y: 41.7266, w: 4.817, h: 7.09626, rx: 2.4085 };
const LEFT_HIGHLIGHT = { x: 26.1797, y: 42.1562, w: 2.70222, h: 3.94759, rx: 1.35111 };
const RIGHT_EYE = { x: 31.3984, y: 41.7266, w: 4.84049, h: 7.11976, rx: 2.42025 };
const RIGHT_HIGHLIGHT = { x: 33.207, y: 42.1562, w: 2.70222, h: 3.94759, rx: 1.35111 };

const LEFT_ARM_PATH =
  "M-13.1913 92.4348C-12.0032 86.3672 -7.59193 79.0559 0.206371 67.3719C0.343029 67.1672 0.515738 66.9827 0.711894 66.834L2.26836 65.6538C3.08641 65.0335 4.26106 65.617 4.26105 66.6436L3.71089 74.5709L3.23576 81.2229L2.46053 87.9498L1.28518 93.8015C-0.0150183 103.186 -4.43845 105.218 -8.94041 102.5C-12.3174 100.461 -13.9494 96.3061 -13.1913 92.4348Z";

const WAVE_ARM_PATH =
  "M82.7627 41.3773C80.501 48.4521 73.8999 56.2392 62.0453 68.8976C61.8473 69.1091 61.6114 69.29 61.3551 69.425L59.3214 70.4959C58.2525 71.0587 57.001 70.1556 57.1983 68.9638L59.3607 59.8668L61.1909 52.236L63.3838 44.5758L65.873 38.0086C69.3699 26.774 75.332 25.7158 80.1907 30.5959C82.9739 33.3914 83.964 37.6199 82.7627 41.3773Z";

const WAVE_ORIGIN_X = 60.6;
const WAVE_ORIGIN_Y = 72.2;

function squishEye(eye: typeof LEFT_EYE, open: number) {
  const height = Math.max(0.5, eye.h * open);
  return {
    y: eye.y + (eye.h - height),
    height,
    rx: Math.max(0.5, eye.rx * open),
  };
}

function squishHighlight(highlight: typeof LEFT_HIGHLIGHT, open: number) {
  if (open <= 0.35) return null;
  const height = highlight.h * open;
  return {
    y: highlight.y + (highlight.h - height),
    height,
    rx: highlight.rx * open,
  };
}

function easeOutSmooth(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInQuad(t: number) {
  return t * t;
}

function easeOutQuad(t: number) {
  return t * (2 - t);
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function lerpSegment(
  elapsed: number,
  start: number,
  duration: number,
  from: number,
  to: number,
  ease: (t: number) => number
) {
  if (elapsed < start) return from;
  if (elapsed >= start + duration) return to;
  const t = (elapsed - start) / duration;
  return from + (to - from) * ease(t);
}

function sampleBlink(elapsed: number) {
  const cycle = 5210;
  const t = elapsed % cycle;
  if (t < 2200) return 1;
  if (t < 2280) return lerpSegment(t, 2200, 80, 1, 0.06, easeInQuad);
  if (t < 2410) return lerpSegment(t, 2280, 130, 0.06, 1, easeOutQuad);
  return 1;
}

function sampleWave(elapsed: number) {
  const cycle = 3940;
  const t = elapsed % cycle;
  if (t < 600) return 0;
  if (t < 900) return lerpSegment(t, 600, 300, 0, 28, easeOutSmooth);
  if (t < 1160) return lerpSegment(t, 900, 260, 28, -16, easeInOutQuad);
  if (t < 1400) return lerpSegment(t, 1160, 240, -16, 22, easeInOutQuad);
  if (t < 1620) return lerpSegment(t, 1400, 220, 22, -12, easeInOutQuad);
  if (t < 1940) return lerpSegment(t, 1620, 320, -12, 0, easeOutSmooth);
  return 0;
}

/** Animated mascot from `Frame 101541.svg` — blink + wave only, no extra artwork. */
export default function GreetingMascotIcon({ size = 72 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  const clipId = `hero-mascot-clip-${uid}`;
  const mouthMaskId = `hero-mascot-mouth-${uid}`;
  const [eyeOpen, setEyeOpen] = useState(1);
  const [waveDeg, setWaveDeg] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const nextEye = sampleBlink(elapsed);
      const nextWave = sampleWave(elapsed);
      setEyeOpen((prev) => (Math.abs(prev - nextEye) < 0.004 ? prev : nextEye));
      setWaveDeg((prev) => (Math.abs(prev - nextWave) < 0.04 ? prev : nextWave));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const leftEye = squishEye(LEFT_EYE, eyeOpen);
  const rightEye = squishEye(RIGHT_EYE, eyeOpen);
  const leftHighlight = squishHighlight(LEFT_HIGHLIGHT, eyeOpen);
  const rightHighlight = squishHighlight(RIGHT_HIGHLIGHT, eyeOpen);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VB} ${VB}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="4" y="4" width="83" height="83" rx="17.5182" />
        </clipPath>
        <mask id={mouthMaskId} maskUnits="userSpaceOnUse" x="18" y="51" width="25" height="12">
          <path
            d="M18.3555 57.3359C18.3555 54.0445 21.3393 51.5988 24.6113 51.9668C28.525 52.4069 31.9158 52.4113 35.8291 51.9727C39.1018 51.6058 42.0896 54.049 42.0898 57.3408C42.0898 60.2454 39.7356 62.6005 36.8311 62.6006H23.6201C20.7127 62.6004 18.3557 60.2434 18.3555 57.3359Z"
            fill="white"
            stroke="#2E5794"
            strokeWidth={0.0234976}
          />
        </mask>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect x="4" y="4" width="83" height="83" rx="17.5182" fill="#88B8FF" />
        <path d={LEFT_ARM_PATH} fill="white" />

        <rect x="1.83984" y="26.6406" width="56.7666" height="61.1679" rx="15.0044" fill="white" />
        <rect x="8.83984" y="37.5938" width="42.8125" height="27.1579" rx="7.14517" fill="#CDE1FF" />

        <rect
          x={LEFT_EYE.x}
          y={leftEye.y}
          width={LEFT_EYE.w}
          height={leftEye.height}
          rx={leftEye.rx}
          fill="black"
        />
        {leftHighlight ? (
          <rect
            x={LEFT_HIGHLIGHT.x}
            y={leftHighlight.y}
            width={LEFT_HIGHLIGHT.w}
            height={leftHighlight.height}
            rx={leftHighlight.rx}
            fill="white"
          />
        ) : null}
        <rect
          x={RIGHT_EYE.x}
          y={rightEye.y}
          width={RIGHT_EYE.w}
          height={rightEye.height}
          rx={rightEye.rx}
          fill="black"
        />
        {rightHighlight ? (
          <rect
            x={RIGHT_HIGHLIGHT.x}
            y={rightHighlight.y}
            width={RIGHT_HIGHLIGHT.w}
            height={rightHighlight.height}
            rx={rightHighlight.rx}
            fill="white"
          />
        ) : null}

        <path
          d="M17.7939 57.3359C17.7939 53.679 21.0998 51.0065 24.6738 51.4082C28.5463 51.8437 31.8953 51.848 35.7666 51.4141C39.3404 51.0135 42.6521 53.6826 42.6523 57.3408C42.6523 60.5557 40.0459 63.1621 36.8311 63.1621H23.6201C20.4023 63.1619 17.7942 60.5537 17.7939 57.3359Z"
          fill="black"
          stroke="#2E5794"
          strokeWidth={1.10032}
        />

        <g mask={`url(#${mouthMaskId})`}>
          <path
            d="M18.3555 57.3359C18.3555 54.0445 21.3393 51.5988 24.6113 51.9668C28.525 52.4069 31.9158 52.4113 35.8291 51.9727C39.1018 51.6058 42.0896 54.049 42.0898 57.3408C42.0898 60.2454 39.7356 62.6005 36.8311 62.6006H23.6201C20.7127 62.6004 18.3557 60.2434 18.3555 57.3359Z"
            fill="black"
            stroke="#2E5794"
            strokeWidth={0.0234976}
          />
          <path
            d="M30.209 59.2852C31.674 59.2852 32.9997 59.7036 33.959 60.3789C34.9185 61.0544 35.5107 61.9864 35.5107 63.0146C35.5107 64.0428 34.9184 64.975 33.959 65.6504C32.9997 66.3256 31.6739 66.7441 30.209 66.7441C28.7438 66.7441 27.4174 66.3257 26.458 65.6504C25.4986 64.975 24.9063 64.0428 24.9062 63.0146C24.9062 61.9864 25.4985 61.0544 26.458 60.3789C27.4174 59.7035 28.7437 59.2852 30.209 59.2852Z"
            fill="#FFBFBF"
            stroke="#2E5794"
            strokeWidth={0.0234976}
          />
          <path
            d="M34.499 55.5479C34.2786 56.011 33.6189 56.011 33.3984 55.5479L31.21 50.9492C31.018 50.5452 31.3124 50.0793 31.7598 50.0791H36.1377C36.5853 50.0791 36.8796 50.5451 36.6875 50.9492L34.499 55.5479Z"
            fill="white"
            stroke="#2E5794"
            strokeWidth={0.0937184}
          />
        </g>

        <path
          d="M10.3945 38.6641H49.7059"
          stroke="#2E5794"
          strokeWidth={4.48803}
          strokeLinecap="round"
        />
        <rect
          x="29.8398"
          y="20.1953"
          width="6.45535"
          height="15.1126"
          rx="3.22767"
          transform="rotate(45 29.8398 20.1953)"
          fill="white"
        />
        <rect
          x="36.8828"
          y="20.1953"
          width="6.45535"
          height="15.1126"
          rx="3.22767"
          transform="rotate(45 36.8828 20.1953)"
          fill="white"
        />

        <g transform={`rotate(${waveDeg} ${WAVE_ORIGIN_X} ${WAVE_ORIGIN_Y})`}>
          <path d={WAVE_ARM_PATH} fill="white" />
        </g>
      </g>

      <rect
        x="2"
        y="2"
        width="87"
        height="87"
        rx="19.5182"
        stroke="white"
        strokeWidth="4"
        fill="none"
      />
    </svg>
  );
}
