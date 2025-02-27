import { useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { Upload, Camera, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";
import Webcam from "react-webcam";
import { KYBFieldConfig, defaultKYBFieldConfig } from "../../config/kybFields";

interface Props {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  onNext: () => void;
  onBack: () => void;
  fieldConfig?: KYBFieldConfig;
}

export default function KYBVerso({ 
  getRootProps, 
  getInputProps, 
  onNext, 
  onBack,
  fieldConfig = defaultKYBFieldConfig
}: Props) {
  const [useCamera, setUseCamera] = useState(true);
  const [isCaptureReady, setIsCaptureReady] = useState(false);
  const webcamRef = useState<Webcam | null>(null)[0];
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  
  // On utilise l'option pour les documents du représentant, pas de l'entreprise
  const allowUpload = fieldConfig.documentCapture.allowDocumentUpload;

  const handleCapture = () => {
    // Logic to capture the document would be implemented here
    // For now, just proceed to next step
    onNext();
  };
  
  const flipCamera = () => {
    setFacingMode(prevMode => (prevMode === "user" ? "environment" : "user"));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Document d'identité (Verso)</h2>
      
      {useCamera ? (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full rounded-xl"
              onUserMedia={() => setIsCaptureReady(true)}
              videoConstraints={{
                facingMode: facingMode
              }}
            />
            
            {/* Document frame overlay */}
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
              <div className="w-[90%] h-[60%] border-2 border-primary/70 rounded-md"></div>
            </div>
            
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
            
            {/* Instructions overlay */}
            <div className="absolute bottom-4 left-0 right-0 mx-auto w-[90%] bg-background/80 backdrop-blur-sm rounded-lg p-3">
              <p className="text-sm text-white text-center">
                Alignez le verso de votre document dans le cadre
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="shadow"
              className="flex-1"
              onClick={handleCapture}
              disabled={!isCaptureReady}
            >
              Prendre la photo
            </Button>
            
            {allowUpload && (
              <Button
                variant="flat"
                className="bg-background/40"
                onClick={() => setUseCamera(false)}
              >
                <Upload className="w-5 h-5 text-primary" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Card
            {...getRootProps()}
            className="border-2 border-dashed border-primary/50 bg-background/40"
          >
            <CardBody className="py-8">
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="w-12 h-12 mb-4 text-primary" />
                <p className="text-sm text-gray-400">
                  Téléchargez le verso de votre document ou sélectionnez une image
                </p>
                <input {...getInputProps()} />
              </div>
            </CardBody>
          </Card>
          
          <Button
            variant="flat"
            className="w-full bg-background/40"
            onClick={() => setUseCamera(true)}
            startContent={<Camera className="w-5 h-5" />}
          >
            Utiliser la caméra à la place
          </Button>
        </div>
      )}
      
      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="bordered"
          onClick={onBack}
          startContent={<ChevronLeft size={20} />}
          className="flex-1 text-white"
        >
          Retour
        </Button>
        <Button
          onClick={onNext}
          color="primary"
          className="flex-1 text-white"
          endContent={<ChevronRight size={20} />}
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}