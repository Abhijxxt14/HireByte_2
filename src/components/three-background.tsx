"use client";

import dynamic from 'next/dynamic'

const ThreeBackgroundCanvas = dynamic(() => import('@/components/three-background-canvas'), {
  ssr: false,
})

export default function ThreeBackground() {
  return <ThreeBackgroundCanvas />
}
