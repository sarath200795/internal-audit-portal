import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* A shaded voxel "Sam" — safety officer in a red hi-vis vest — built from boxes,
 * with an idle sway and a walk cycle. Used as the floating 3D assistant. */

function Box({ position, size, color, rough = 0.65 }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={rough} metalness={0} />
    </mesh>
  )
}

function SamModel({ walking, facing }) {
  const root = useRef()
  const legL = useRef()
  const legR = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const g = root.current
    if (!g) return
    if (walking) {
      // bob with each step + face direction of travel (3/4 view)
      g.position.y = Math.abs(Math.sin(t * 8)) * 0.12
      const target = facing < 0 ? 0.5 : -0.5
      g.rotation.y += (target - g.rotation.y) * 0.15
    } else {
      g.position.y = Math.sin(t * 1.6) * 0.05
      g.rotation.y += (Math.sin(t * 0.7) * 0.18 - g.rotation.y) * 0.05
    }
    const swing = walking ? Math.sin(t * 8) * 0.6 : 0
    if (legL.current) legL.current.rotation.x = swing
    if (legR.current) legR.current.rotation.x = -swing
  })

  const VEST = '#e23b3b'
  const SKIN = '#f0c89c'
  const HAIR = '#f4c24a'
  const NAVY = '#1e2a4a'
  const DARK = '#16233f'

  return (
    <group ref={root} position={[0, -0.2, 0]}>
      {/* legs (pivot at hip) */}
      <group ref={legL} position={[-0.36, -0.55, 0]}>
        <Box position={[0, -0.7, 0]} size={[0.5, 1.4, 0.55]} color={NAVY} />
        <Box position={[0, -1.5, 0.12]} size={[0.55, 0.32, 0.72]} color="#0f1b33" />
      </group>
      <group ref={legR} position={[0.36, -0.55, 0]}>
        <Box position={[0, -0.7, 0]} size={[0.5, 1.4, 0.55]} color={NAVY} />
        <Box position={[0, -1.5, 0.12]} size={[0.55, 0.32, 0.72]} color="#0f1b33" />
      </group>

      {/* torso / undershirt */}
      <Box position={[0, 0.2, 0]} size={[1.55, 1.7, 0.88]} color={DARK} />
      {/* red hi-vis vest (front + sides) */}
      <Box position={[0, 0.2, 0.06]} size={[1.5, 1.62, 0.84]} color={VEST} />
      {/* vertical reflective stripes on the chest */}
      <Box position={[-0.3, 0.22, 0.45]} size={[0.18, 1.4, 0.05]} color="#eef2f7" rough={0.4} />
      <Box position={[0.3, 0.22, 0.45]} size={[0.18, 1.4, 0.05]} color="#eef2f7" rough={0.4} />

      {/* arms */}
      <Box position={[-0.96, 0.28, 0]} size={[0.46, 1.5, 0.58]} color={VEST} />
      <Box position={[-0.96, -0.52, 0.02]} size={[0.46, 0.42, 0.58]} color={SKIN} />
      <Box position={[0.96, 0.28, 0]} size={[0.46, 1.5, 0.58]} color={VEST} />
      <Box position={[0.96, -0.52, 0.02]} size={[0.46, 0.42, 0.58]} color={SKIN} />

      {/* clipboard in left hand */}
      <group position={[-0.95, -0.45, 0.5]} rotation={[0.25, 0.1, 0.05]}>
        <Box position={[0, 0, 0]} size={[0.72, 0.92, 0.1]} color="#ffffff" rough={0.5} />
        <Box position={[0, 0.5, 0.02]} size={[0.3, 0.16, 0.12]} color="#94a3b8" />
        <Box position={[0, 0.06, 0.07]} size={[0.5, 0.08, 0.04]} color="#cbd5e1" />
        <Box position={[-0.06, -0.14, 0.07]} size={[0.34, 0.08, 0.04]} color="#dc2626" />
      </group>

      {/* head */}
      <Box position={[0, 1.5, 0]} size={[1.32, 1.3, 1.2]} color={SKIN} />
      {/* hair */}
      <Box position={[0, 2.05, 0]} size={[1.46, 0.72, 1.34]} color={HAIR} />
      <Box position={[0, 1.72, 0.56]} size={[1.4, 0.5, 0.3]} color={HAIR} />
      <Box position={[-0.72, 1.55, 0]} size={[0.16, 0.9, 1.2]} color={HAIR} />
      <Box position={[0.72, 1.55, 0]} size={[0.16, 0.9, 1.2]} color={HAIR} />
      {/* eyes */}
      <Box position={[-0.26, 1.46, 0.62]} size={[0.14, 0.2, 0.06]} color="#26303f" />
      <Box position={[0.26, 1.46, 0.62]} size={[0.14, 0.2, 0.06]} color="#26303f" />
      {/* mouth */}
      <Box position={[0, 1.18, 0.62]} size={[0.34, 0.08, 0.05]} color="#b87651" />
    </group>
  )
}

export default function SamCharacter3D({ walking = false, facing = 1, className = '' }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.4, 9], fov: 28 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[4, 6, 5]} intensity={1.15} />
        <directionalLight position={[-4, 2, -3]} intensity={0.35} color="#bcd4ff" />
        <SamModel walking={walking} facing={facing} />
      </Canvas>
    </div>
  )
}

// silence unused import in some bundlers
export const _three = THREE
