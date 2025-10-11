'use client'

import { useEffect, useState } from 'react'

interface NumberFlowProps {
  value: number
  duration?: number
  className?: string
}

const NumberFlow = ({ value, duration = 500, className = '' }: NumberFlowProps) => {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      const currentValue = Math.floor(progress * (value - displayValue) + displayValue)
      setDisplayValue(currentValue)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration, displayValue])

  return <span className={className}>{displayValue.toLocaleString()}</span>
}

export default NumberFlow