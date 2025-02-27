import { useState, useRef } from "react";
import { Button } from "@nextui-org/react";
import { Camera, RotateCw } from "lucide-react";
import Webcam from "react-webcam";
import FullscreenCamera from "../../components/FullscreenCamera";

interface Props {
  isCameraActive: boolean;
  handleCaptureSelfie: () => void;
  setIsCameraActive: (active: boolean) => void;
}

export default function KYBSelfie({ isCameraActive, handleCaptureSelfie, setIsCameraActive }: Props) {
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isCaptureReady, setIsCaptureReady] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const flipCamera = () => {
    setFacingMode(prevMode => (prevMode === "user" ? "environment" : "user"));
  };
  
  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    // Passer à l'étape suivante via la prop
    handleCaptureSelfie();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Selfie du représentant légal</h2>
      {isCameraActive ? (
        <div className="relative rounded-xl overflow-hidden">
          <FullscreenCamera
            webcamRef={webcamRef}
            facingMode={facingMode}
            onFlipCamera={flipCamera}
            onCapture={handleCapture}
            isCaptureReady={isCaptureReady}
            frameText="Placez votre visage au centre du cadre"
          />
          <Button
            color="primary"
            variant="shadow"
            size="lg"
            onClick={() => {
              if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                  handleCapture(imageSrc);
                }
              }
            }}
            className="mt-4 w-full"
          >
            Prendre la photo
          </Button>
        </div>
      ) : (
        <Button
          color="primary"
          variant="shadow"
          size="lg"
          onClick={() => setIsCameraActive(true)}
          className="w-full h-48 flex flex-col items-center justify-center"
          startContent={<Camera className="w-8 h-8" />}
        >
          Activer la caméra
        </Button>
      )}
      
      <div className="mt-4 p-4 bg-background/40 border border-white/10 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Instructions</h3>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>• Assurez-vous d'être dans un endroit bien éclairé</li>
          <li>• Regardez directement la caméra</li>
          <li>• Votre visage doit être clairement visible</li>
          <li>• Ne portez pas de lunettes de soleil ou de chapeau</li>
        </ul>
      </div>
    </div>
  );
}