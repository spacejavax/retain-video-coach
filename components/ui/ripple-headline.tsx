"use client";

import { useEffect, useState } from "react";
import RippleDistortion, { type RippleDistortionProps } from "./ripple-distortion";

const WIDTH = 1600;
const HEIGHT = 900;

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function buildHeadlineImage(text: string, backgroundSrc: string) {
  await document.fonts.ready;

  const bg = new Image();
  bg.crossOrigin = "anonymous";
  bg.src = backgroundSrc;
  await new Promise<void>((resolve, reject) => {
    bg.onload = () => resolve();
    bg.onerror = () => reject(new Error("failed to load background"));
  });

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no 2d context");

  ctx.drawImage(bg, 0, 0, WIDTH, HEIGHT);

  const serifVar = getComputedStyle(document.documentElement).getPropertyValue("--newsreader-serif").trim();
  const fontFamily = `${serifVar || "Georgia"}, Georgia, serif`;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const maxWidth = WIDTH * 0.82;
  let fontSize = 128;
  let lines: string[] = [];
  while (fontSize > 48) {
    ctx.font = `500 ${fontSize}px ${fontFamily}`;
    lines = wrapText(ctx, text, maxWidth);
    if (lines.length <= 3) break;
    fontSize -= 4;
  }

  const lineHeight = fontSize * 1.08;
  const totalHeight = lineHeight * lines.length;
  const startY = HEIGHT / 2 - totalHeight / 2 + lineHeight / 2;

  ctx.font = `500 ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = "#f5efe9";
  lines.forEach((line, i) => ctx.fillText(line, WIDTH / 2, startY + i * lineHeight));

  return canvas.toDataURL("image/png");
}

export interface RippleHeadlineProps extends Omit<RippleDistortionProps, "src"> {
  text: string;
  backgroundSrc: string;
}

const RippleHeadline = ({ text, backgroundSrc, className, ...rippleProps }: RippleHeadlineProps) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    buildHeadlineImage(text, backgroundSrc)
      .then(dataUrl => {
        if (!cancelled) setSrc(dataUrl);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [text, backgroundSrc]);

  if (!src) return <div className={className} aria-hidden="true" />;

  return <RippleDistortion className={className} src={src} {...rippleProps} />;
};

export default RippleHeadline;
