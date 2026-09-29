import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import FloatingParticles from "./FloatingParticles";

function MainShape() {
  const meshRef = useRef(null);

  useFrame(({ mouse }) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.x +=
      (mouse.y * 0.45 - meshRef.current.rotation.x) * 0.025;

    meshRef.current.rotation.y +=
      (mouse.x * 0.65 - meshRef.current.rotation.y) * 0.025;
  });

  return (
    <mesh ref={meshRef} position={[3.2, 0.3, -1]}>
      <icosahedronGeometry args={[2.1, 1]} />
      <meshBasicMaterial
        color="#6F9BB8"
        wireframe
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

function SecondaryShapes() {
  const groupRef = useRef(null);

  useFrame(({ mouse }) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.x +=
      (mouse.y * 0.25 - groupRef.current.rotation.x) * 0.02;

    groupRef.current.rotation.y +=
      (mouse.x * 0.35 - groupRef.current.rotation.y) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-3.4, 1.5, -1]}>
        <octahedronGeometry args={[1.1, 0]} />
        <meshBasicMaterial
          color="#FFFFFF"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      <mesh position={[3.8, -2.1, -2]}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial
          color="#2F5D7C"
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>

      <mesh position={[-3.2, -2, -1]}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial
          color="#6F9BB8"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

function ParallaxCamera() {
  useFrame(({ mouse, camera }) => {
    camera.position.x += (mouse.x * 0.9 - camera.position.x) * 0.025;
    camera.position.y += (mouse.y * 0.6 - camera.position.y) * 0.025;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

const AuthBackgroundScene = () => (
  <>
    <ambientLight intensity={1} />
    <ParallaxCamera />
    <MainShape />
    <SecondaryShapes />
    <FloatingParticles
      count={55}
      spreadX={13}
      spreadY={8}
      spreadZ={6}
      opacity={0.35}
    />
  </>
);

export default AuthBackgroundScene;