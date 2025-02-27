import { useState, useRef } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { Upload, Camera, FileText, RotateCw } from "lucide-react";
import { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";
import Webcam from "react-webcam";
import { KYCFieldConfig, defaultKYCFieldConfig } from "../../config/kycFields";
import { DocumentScanAnimation } from "../../components/DocumentScanAnimation";

interface Props {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  fieldConfig?: KYCFieldConfig;
  addressDocType?: string;
}

export default function KYCProofAddress({ 
  getRootProps, 
  getInputProps, 
  fieldConfig = defaultKYCFieldConfig,
  addressDocType = "bill"
}: Props) {
  const [useCamera, setUseCamera] = useState(true);
  const [isCaptureReady, setIsCaptureReady] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showScanAnimation, setShowScanAnimation] = useState(false);
  
  // Option d'upload de document activée ou non
  const allowUpload = fieldConfig.documentCapture.allowAddressDocumentUpload;

  // Fonction pour obtenir le titre du document en fonction du type
  const getDocumentTitle = () => {
    switch (addressDocType) {
      case "bill": return "Facture";
      case "certificate": return "Attestation de domicile";
      case "bankStatement": return "Relevé bancaire";
      default: return "Justificatif de domicile";
    }
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setShowScanAnimation(true);
    }
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
    // Nous n'avons pas de méthode onNext ici, donc l'utilisateur pourra continuer
    // en utilisant les boutons de navigation principaux du flux
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Capture du justificatif de domicile
      </h2>
      
      <div className="flex items-center gap-3 bg-primary/10 p-3 rounded-lg mb-4">
        <FileText className="text-primary w-6 h-6 flex-shrink-0" />
        <p className="text-sm text-white">
          Veuillez prendre en photo votre {getDocumentTitle().toLowerCase()} ou télécharger le document
        </p>
      </div>
      
      {useCamera ? (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden">
            {!showScanAnimation && (
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
            )}
            
            {/* Document frame overlay */}
            {!showScanAnimation && (
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
                <div className="w-[90%] h-[60%] border-2 border-primary/70 rounded-md"></div>
              </div>
            )}
            
            {/* Flip camera button */}
            {!showScanAnimation && (
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
            )}
            
            {/* Instructions overlay */}
            {!showScanAnimation && (
              <div className="absolute bottom-4 left-0 right-0 mx-auto w-[90%] bg-background/80 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm text-white text-center">
                  Alignez votre document dans le cadre et assurez-vous qu'il est lisible
                </p>
              </div>
            )}
          </div>
          
          {!showScanAnimation && (
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
                  Téléchargez votre {getDocumentTitle().toLowerCase()} ou sélectionnez une image
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
      
      {/* Common instructions */}
      <div className="mt-4 p-4 bg-background/40 border border-white/10 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Instructions</h3>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>• Le document doit être de moins de 3 mois</li>
          <li>• Votre nom et adresse complète doivent être visibles</li>
          <li>• Tous les détails doivent être clairement lisibles</li>
          <li>• Évitez les reflets ou les ombres sur le document</li>
        </ul>
      </div>
      
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