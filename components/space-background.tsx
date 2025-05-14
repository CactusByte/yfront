"use client"

import { useEffect, useRef } from "react"

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size with device pixel ratio for sharp rendering
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Star properties
    const stars: {
      x: number
      y: number
      radius: number
      speed: number
      opacity: number
      twinkleSpeed: number
      twinklePhase: number
    }[] = []

    const numStars = Math.floor((canvas.width * canvas.height) / 10000)

    // Create stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.05,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.01 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }

    // Animation
    let animationFrameId: number
    let lastTime = 0

    const render = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight)
      gradient.addColorStop(0, "#0a0d1a")
      gradient.addColorStop(1, "#141b33")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      // Draw subtle nebula
      drawNebula(ctx, window.innerWidth * 0.8, window.innerHeight * 0.7, 400, "rgba(147, 51, 234, 0.02)")
      drawNebula(ctx, window.innerWidth * 0.2, window.innerHeight * 0.3, 350, "rgba(59, 130, 246, 0.02)")
      drawNebula(ctx, window.innerWidth * 0.5, window.innerHeight * 0.9, 300, "rgba(74, 255, 128, 0.015)")

      // Draw stars
      stars.forEach((star) => {
        // Update twinkle phase
        star.twinklePhase += (star.twinkleSpeed * deltaTime) / 16

        // Calculate current opacity based on twinkle
        const currentOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinklePhase))

        // Draw star
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`
        ctx.fill()

        // Add glow effect for larger stars
        if (star.radius > 1) {
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 4)
          glow.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.5})`)
          glow.addColorStop(1, "rgba(255, 255, 255, 0)")

          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        // Move stars
        star.y += (star.speed * deltaTime) / 16

        // Reset stars that go off screen
        if (star.y > window.innerHeight) {
          star.y = 0
          star.x = Math.random() * window.innerWidth
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    const drawNebula = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, "transparent")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}
