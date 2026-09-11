import { Canvas } from "@react-three/fiber";
import { Blob } from "./three/Blob";

export function BackgroundBlob() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
      <div className="relative w-[98vmin] max-w-160 aspect-square translate-y-8">
        <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 22], fov: 30 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[75, 75, 5]} intensity={0.8} />
          <directionalLight position={[-5, -5, 2]} intensity={1.8} />
          <Blob />
        </Canvas>
      </div>
    </div>
  );
}