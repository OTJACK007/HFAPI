import { useState } from "react";
import { Button } from "@nextui-org/react";
import { Camera, RotateCw } from "lucide-react";
import Webcam from "react-webcam";

interface Props {
  isCameraActive: boolean;
  handleCaptureSelfie: () => void;
  setIsCameraActive: (active: boolean) => void;
}

export default function KYBSelfie({ isCameraActive, handleCaptureSelfie, setIsCameraActive }: Props) {
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  
  const flipCamera = () => {
    setFacingMode(prevMode => (prevMode === "user" ? "environment" : "user"));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Selfie du représentant légal</h2>
      {isCameraActive ? (
        <div className="relative rounded-xl overflow-hidden">
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full rounded-xl"
            videoConstraints={{
              facingMode: facingMode
            }}
          />
          
          {/* Flip camera button */}
          <div className="absolute top-4 right-4">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="bg-background/50 backdrop-blur-sm"
              onClick={flipCamera}
            >
              <RotateCw className="w-4 h-4 text-white" />
            </Button>
          </div>
          
          <Button
            color="primary"
            variant="shadow"
            size="lg"
            onClick={handleCaptureSelfie}
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