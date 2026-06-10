"use client"

import * as React from "react"
import { motion, useMotionTemplate, useMotionValue, animate, useTransform, type HTMLMotionProps } from "framer-motion"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// 1. Staggered Grid/List Animations
export const StaggerContainer = ({
  children,
  className,
  delay = 0.05,
  ...props
}: Omit<HTMLMotionProps<"div">, "children"> & { children?: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: delay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({
  children,
  className,
  ...props
}: Omit<HTMLMotionProps<"div">, "children"> & { children?: React.ReactNode }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        show: { 
          opacity: 1, 
          y: 0, 
          transition: { type: "spring", stiffness: 350, damping: 25 } 
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// 2. Motion Card with Spotlight Cursor Glow and Elevation
export function MotionCard({
  className,
  children,
  glowColor = "rgba(16, 185, 129, 0.12)", // Default emerald spotlight color
  ...props
}: Omit<HTMLMotionProps<"div">, "children"> & { children?: React.ReactNode; glowColor?: string }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={{ y: -4, scale: 1.012 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "relative rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md shadow-lg shadow-zinc-100/50 dark:shadow-black/20 hover:shadow-xl transition-all duration-300 overflow-hidden group",
        className
      )}
      {...props}
    >
      {/* Spotlight cursor glow overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              220px circle at ${mouseX}px ${mouseY}px,
              ${glowColor},
              transparent 80%
            )
          `
        }}
      />
      
      {/* Accent border highlight glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 border border-emerald-500/10 dark:border-emerald-500/20"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              120px circle at ${mouseX}px ${mouseY}px,
              ${glowColor.replace("0.12", "0.2")},
              transparent 80%
            )
          `
        }}
      />
      
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  )
}

// 3. Ultra-High Performance DOM-Direct Animated Counter
export function AnimatedCounter({
  value,
  duration = 1.0,
  prefix = "",
  suffix = "",
  decimals = 0,
  className
}: {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => {
    return latest.toFixed(decimals)
  })
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Small delay to let the initial page mount render first
    const delayTimer = setTimeout(() => {
      const controls = animate(count, value, {
        duration,
        ease: [0.16, 1, 0.3, 1], // Linear/Apple ease-out curve
      })
      return () => controls.stop()
    }, 100)
    return () => clearTimeout(delayTimer)
  }, [value, duration, count])

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest}${suffix}`
      }
    })
  }, [rounded, prefix, suffix])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}

// 4. Smooth Spring Progress Bar Transitions
export function AnimatedProgress({
  value,
  className
}: {
  value: number
  className?: string
}) {
  return (
    <div className={cn("w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden h-2", className)}>
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-emerald-500 h-full rounded-full"
      />
    </div>
  )
}

// 5. Progressive Chart Loader wrapper
export function AnimatedChartWrapper({
  children,
  className,
  ...props
}: Omit<HTMLMotionProps<"div">, "children"> & { children?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("w-full h-full", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
