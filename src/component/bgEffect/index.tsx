import { type CSSProperties, useMemo } from "react"
import { TiHeart } from "react-icons/ti"

import "./index.scss"

const HEART_COUNT = 16

type HeartParticle = {
  id: number
  left: number
  size: number
  delay: number
  duration: number
  drift: number
  opacity: number
  color: "pink" | "white"
}

const createHeart = (id: number): HeartParticle => ({
  id,
  left: Math.random() * 100,
  size: 12 + Math.random() * 14,
  delay: Math.random() * -14,
  duration: 12 + Math.random() * 10,
  drift: (Math.random() - 0.5) * 52,
  opacity: 0.3,
  color: Math.random() > 0.5 ? "pink" : "white",
})

export const BGEffect = () => {
  const hearts = useMemo(
    () => Array.from({ length: HEART_COUNT }, (_, id) => createHeart(id)),
    [],
  )

  return (
    <div className="bg-effect" aria-hidden="true">
      {hearts.map(
        ({ id, left, size, delay, duration, drift, opacity, color }) => {
          return (
            <span
              key={id}
              className={`heart-particle heart-particle-${color}`}
              style={
                {
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  "--heart-drift": `${drift}px`,
                  "--heart-opacity": opacity,
                } as CSSProperties
              }
            >
              <TiHeart />
            </span>
          )
        },
      )}
    </div>
  )
}
