'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function FloatingShape({ position, scale, speed }: { position: [number, number, number], scale: number, speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * speed
      meshRef.current.rotation.x = time * 0.5
      meshRef.current.rotation.y = time * 0.3
      meshRef.current.position.y = position[1] + Math.sin(time) * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#0ea5e9"
        wireframe
        transparent
        opacity={0.3}
        emissive="#0ea5e9"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function FloatingTorus({ position, scale, speed }: { position: [number, number, number], scale: number, speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * speed
      meshRef.current.rotation.x = time * 0.3
      meshRef.current.rotation.z = time * 0.5
      meshRef.current.position.x = position[0] + Math.cos(time) * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshStandardMaterial
        color="#a855f7"
        wireframe
        transparent
        opacity={0.2}
        emissive="#a855f7"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

function FloatingBox({ position, scale, speed }: { position: [number, number, number], scale: number, speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * speed
      meshRef.current.rotation.y = time * 0.4
      meshRef.current.rotation.z = time * 0.2
      meshRef.current.position.z = position[2] + Math.sin(time * 0.5) * 0.4
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#ec4899"
        wireframe
        transparent
        opacity={0.25}
        emissive="#ec4899"
        emissiveIntensity={0.4}
      />
    </mesh>
  )
}

export default function FloatingShapes() {
  return (
    <group>
      {/* Octahedrons */}
      <FloatingShape position={[-3, 2, -2]} scale={0.8} speed={0.5} />
      <FloatingShape position={[4, -1, -3]} scale={1.2} speed={0.3} />
      <FloatingShape position={[-2, -2, -4]} scale={0.6} speed={0.7} />
      
      {/* Torus */}
      <FloatingTorus position={[3, 1, -2]} scale={0.7} speed={0.4} />
      <FloatingTorus position={[-4, 0, -3]} scale={0.9} speed={0.6} />
      
      {/* Boxes */}
      <FloatingBox position={[2, -1.5, -2.5]} scale={0.5} speed={0.5} />
      <FloatingBox position={[-3, 1.5, -3.5]} scale={0.7} speed={0.4} />
    </group>
  )
}

