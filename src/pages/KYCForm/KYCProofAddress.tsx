import { useState, useRef } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { Upload, Camera, FileText, RotateCw } from "lucide-react";
import { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";
import Webcam from "react-webcam";
import { KYCFieldConfig, defaultKYCFieldConfig } from "../../config/kycFields";
import { DocumentScanAnimation } from "../../components/DocumentScanAnimation";
import { useKYCFlow } from "../../hooks/useKYCFlow";
import FullscreenCamera from "../../components/FullscreenCamera";

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
  
  // Accéder à la fonction nextStep du flux KYC
  const { nextStep } = useKYCFlow();
  
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
    // IMPORTANT: Masquer l'animation d'abord, puis naviguer
    setShowScanAnimation(false);
    // Utilisons setTimeout pour s'assurer que le state a bien été mis à jour
    // avant de naviguer vers la prochaine étape
    setTimeout(() => {
      nextStep();
    }, 10);
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