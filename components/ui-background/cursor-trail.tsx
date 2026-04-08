"use client"

import React, { useEffect, useRef } from "react"

export const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let mouseX = 0
    let mouseY = 0
    let lastX = 0
    let lastY = 0

    const colors = [
      "#346bf1", // Primary Blue
      "#4285F4", // Google Blue
      "#EA4335", // Google Red
      "#FBBC05", // Google Yellow
      "#34A853", // Google Green
      "#ffb4ab", // Soft Red
      "#b4c5ff", // Soft Blue
    ]

    let particles: Array<{
      x: number
      y: number
      size: number
      color: string
      vx: number
      vy: number
      life: number
      maxLife: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticle = (x: number, y: number, vx: number, vy: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = Math.random() * 4 + 2
      const life = 1.0
      return {
        x,
        y,
        size,
        color,
        vx: vx * 0.5 + (Math.random() - 0.5) * 2,
        vy: vy * 0.5 + (Math.random() - 0.5) * 2,
        life,
        maxLife: life,
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate mouse velocity
      const vx = mouseX - lastX
      const vy = mouseY - lastY
      
      // Spawn particles based on movement speed
      const speed = Math.sqrt(vx * vx + vy * vy)
      const particleCount = Math.min(Math.floor(speed / 2) + 1, 10)

      if (mouseX !== 0 || mouseY !== 0) {
        if (speed > 1) {
          for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle(
              mouseX + (Math.random() - 0.5) * 20, 
              mouseY + (Math.random() - 0.5) * 20, 
              vx, 
              vy
            ))
          }
        }
      }

      lastX = mouseX
      lastY = mouseY

      // Update and draw particles
      particles = particles.filter((p) => p.life > 0)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96 // Friction
        p.vy *= 0.96
        p.life -= 0.01 // Fading
        p.size *= 0.99 // Shrinking

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life * 0.6
        ctx.fill()
        ctx.globalAlpha = 1.0
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)
    resize()
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  )
}
