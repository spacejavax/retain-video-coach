"use client"

import createGlobe, { type COBEOptions } from "cobe"
import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

type GlobeConfig = COBEOptions & {
  onRender?: (state: Partial<COBEOptions>) => void
}

const GLOBE_CONFIG: GlobeConfig = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [0.93, 0.91, 0.87],
  markerColor: [216 / 255, 74 / 255, 49 / 255],
  glowColor: [0.84, 0.82, 0.77],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
}

export function Globe({ className, config = GLOBE_CONFIG }: { className?: string; config?: GlobeConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const widthRef = useRef(0)
  const rotationRef = useRef(0)
  const pointerStartRef = useRef<number | null>(null)
  const pointerOriginRef = useRef(0)
  const reduceMotionRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const resizeObserver = new ResizeObserver(([entry]) => { widthRef.current = entry.contentRect.width })
    resizeObserver.observe(canvas)
    widthRef.current = canvas.offsetWidth

    let activePointer: number | null = null
    const startDrag = (event: PointerEvent) => {
      event.preventDefault()
      activePointer = event.pointerId
      pointerStartRef.current = event.clientX
      pointerOriginRef.current = rotationRef.current
      canvas.setPointerCapture(event.pointerId)
      canvas.style.cursor = "grabbing"
    }
    const moveDrag = (event: PointerEvent) => {
      if (activePointer !== event.pointerId || pointerStartRef.current === null) return
      event.preventDefault()
      rotationRef.current = pointerOriginRef.current + (event.clientX - pointerStartRef.current) / 80
    }
    const endDrag = (event: PointerEvent) => {
      if (activePointer !== event.pointerId) return
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      activePointer = null
      pointerStartRef.current = null
      canvas.style.cursor = "grab"
    }
    const rotateWithKeyboard = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      event.preventDefault()
      rotationRef.current += event.key === "ArrowLeft" ? -0.25 : 0.25
    }
    canvas.addEventListener("pointerdown", startDrag)
    canvas.addEventListener("pointermove", moveDrag)
    canvas.addEventListener("pointerup", endDrag)
    canvas.addEventListener("pointercancel", endDrag)
    canvas.addEventListener("keydown", rotateWithKeyboard)

    const runtimeConfig: GlobeConfig = {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: (state: Partial<COBEOptions>) => {
        if (pointerStartRef.current === null && !reduceMotionRef.current) phiRef.current += 0.0035
        state.phi = phiRef.current + rotationRef.current
        state.width = widthRef.current * 2
        state.height = widthRef.current * 2
        config.onRender?.(state)
      },
    }
    const globe = createGlobe(canvas, runtimeConfig)

    const frame = requestAnimationFrame(() => canvas.classList.add("is-ready"))
    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      canvas.removeEventListener("pointerdown", startDrag)
      canvas.removeEventListener("pointermove", moveDrag)
      canvas.removeEventListener("pointerup", endDrag)
      canvas.removeEventListener("pointercancel", endDrag)
      canvas.removeEventListener("keydown", rotateWithKeyboard)
      globe.destroy()
    }
  }, [config])

  return <div className={cn("globe-root", className)}><canvas
    aria-label="Interactive globe. Drag horizontally or use the left and right arrow keys to rotate."
    className="globe-canvas"
    ref={canvasRef}
    role="img"
    tabIndex={0}
  /></div>
}
