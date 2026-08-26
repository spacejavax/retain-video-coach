"use client"

import React, {
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
} from "react"
import { AnimatePresence, motion, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations: MotionProps = {
    initial: { scale: 0.6, opacity: 0, y: 24 },
    animate: { scale: 1, opacity: 1, y: 0, originY: 0 },
    exit: { scale: 0.7, opacity: 0, y: -12, transition: { duration: 0.2 } },
    transition: { type: "spring", stiffness: 500, damping: 24, mass: 0.8 },
  }

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  )
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  delay?: number
  active?: boolean
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, active = true, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(-1)
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    )

    useEffect(() => {
      if (!active) return
      let timeout: ReturnType<typeof setTimeout> | null = null

      if (index < childrenArray.length - 1) {
        timeout = setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length)
        }, index === -1 ? 0 : delay)
      }

      return () => {
        if (timeout !== null) {
          clearTimeout(timeout)
        }
      }
    }, [index, delay, active, childrenArray.length])

    const itemsToShow = useMemo(() => {
      const result = childrenArray.slice(0, index + 1).reverse()
      return result
    }, [index, childrenArray])

    return (
      <div
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"
