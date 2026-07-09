'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 300 : 600

/**
 * Build a soft-edged white circle sprite. Used as the `map` on pointsMaterial
 * so each point renders as a round disc instead of the default GL quad.
 * The color of the point comes from the material's `color` — the sprite is
 * white so it multiplies cleanly.
 */
function makeCircleTexture(): THREE.CanvasTexture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const r = size / 2
  const gradient = ctx.createRadialGradient(r, r, 0, r, r, r)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,1)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null)
  const { mouse } = useThree()

  const circleTexture = useMemo(() => makeCircleTexture(), [])

  useEffect(() => {
    return () => {
      circleTexture.dispose()
    }
  }, [circleTexture])

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const speeds = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      speeds[i] = Math.random() * 0.5 + 0.1
    }

    return { positions, speeds }
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const time = clock.elapsedTime

    pointsRef.current.rotation.y = time * 0.03 + mouse.x * 0.1
    pointsRef.current.rotation.x = mouse.y * 0.05

    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posArray[i * 3 + 1] += speeds[i] * 0.005
      if (posArray[i * 3 + 1] > 10) posArray[i * 3 + 1] = -10
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          args={[positions, 3]}
          attach="attributes-position"
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#10B981"
        map={circleTexture}
        alphaTest={0.01}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export function ParticleField() {
  return (
    <Canvas
      data-testid="three-particle-canvas"
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ antialias: false, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Particles />
    </Canvas>
  )
}
