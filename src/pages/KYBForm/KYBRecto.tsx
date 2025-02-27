import { useState, useRef } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { Upload, Camera, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";
import Webcam from "react-webcam";
import { KYBFieldConfig, defaultKYBFieldConfig } from "../../config/kybFields";
import { DocumentScanAnimation } from "../../components/DocumentScanAnimation";
import FullscreenCamera from "../../components/FullscreenCamera";

interface Props {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  onNext: () => void;
  onBack: () => void;
  title?: string;
  fieldConfig?: KYBFieldConfig;
}

export default function KYBRecto({ 
  getRootProps, 
  getInputProps, 
  onNext, 
  onBack, 
  title = "Document de l'entreprise",
  fieldConfig = defaultKYBFieldConfig
}: Props) {
  const [useCamera, setUseCamera] = useState(true);
  const [isCaptureReady, setIsCaptureReady] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showScanAnimation, setShowScanAnimation] = useState(false);
  
  // Déterminer quelle option d'upload utiliser selon le type de document
  const isCompanyDocument = title.includes("entreprise");
  const allowUpload = isCompanyDocument 
    ? fieldConfig.documentCapture.allowCompanyDocumentUpload 
    : fieldConfig.documentCapture.allowDocumentUpload;

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setShowScanAnimation(true);
  };

  const flipCamera = () => {
    setFacingMode(prevMode => (prevMode === "user" ? "environment" : "user"));
  };

  const handleRetry = () => {
    setCapturedImage(null);
    setShowScanAnimation(false);
  };

  const handleContinue = () => {
    setShowScanAnimation(false);
    onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      
      {useCamera ? (
        <div className="space-y-4">
          <FullscreenCamera 
            webcamRef={webcamRef}
            facingMode={facingMode}
            onFlipCamera={flipCamera}
            onCapture={handleCapture}
            isCaptureReady={isCaptureReady}
            frameText="Alignez votre document dans le cadre et assurez-vous qu'il est lisible"
          />
          
          {!showScanAnimation && (
            <div className="flex gap-2">
              <Button
                color="primary"
                variant="shadow"
                className="flex-1"
                onClick={() => {
                  if (webcamRef.current) {
                    const imageSrc = webcamRef.current.getScreenshot();
                    if (imageSrc) {
                      handleCapture(imageSrc);
                    }
                  }
                }}
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
          )}
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
                  Téléchargez votre document ou prenez-le en photo
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Formats acceptés : PDF, JPG, PNG
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
      
      {!showScanAnimation && (
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
      )}

      {/* Scanning Animation Overlay */}
      {showScanAnimation && capturedImage && (
        <DocumentScanAnimation 
          imageSrc={capturedImage}
          onRetry={handleRetry}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}