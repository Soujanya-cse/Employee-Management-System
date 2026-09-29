const getParticleOffset = (index, axis, spread) => {
  const value = Math.sin((index + 1) * (axis + 1) * 12.9898) * 43758.5453;
  const fraction = value - Math.floor(value);

  return (fraction - 0.5) * spread;
};

const FloatingParticles = ({
  count,
  spreadX,
  spreadY,
  spreadZ,
  opacity,
}) => {
  const particles = [];

  for (let index = 0; index < count; index += 1) {
    particles.push(
      <mesh
        key={index}
        position={[
          getParticleOffset(index, 0, spreadX),
          getParticleOffset(index, 1, spreadY),
          getParticleOffset(index, 2, spreadZ),
        ]}
      >
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={opacity}
        />
      </mesh>,
    );
  }

  return <group>{particles}</group>;
};

export default FloatingParticles;