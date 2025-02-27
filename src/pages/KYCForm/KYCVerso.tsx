import { useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { Upload, Camera } from "lucide-react";
import { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";
import Webcam from "react-webcam";
import { KYCFieldConfig, defaultKYCFieldConfig } from "../../config/kycFields";

interface Props {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  fieldConfig?: KYCFieldConfig;
}

export default function KYCVerso({ getRootProps, getInputProps, fieldConfig = defaultKYCFieldConfig }: Props) {
  const [useCamera, setUseCamera] = useState(true);
  const [isCaptureReady, setIsCaptureReady] = useState(false);
  const webcamRef = useState<Webcam | null>(null)[0];
  
  // Option d'upload de document activée ou non
  const allowUpload = fieldConfig.documentCapture.allowDocumentUpload;

  const handleCapture = () => {
    // Logic to capture the document would be implemented here
    setIsCaptureReady(true);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Photo verso du document</h2>
      
      {useCamera ? (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full rounded-xl"
              onUserMedia={() => setIsCaptureReady(true)}
            />
            
            {/* Document frame overlay */}
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
              <div className="w-[90%] h-[60%] border-2 border-primary/70 rounded-md"></div>
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
      
      {/* Common instructions */}
      <div className="mt-4 p-4 bg-background/40 border border-white/10 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Instructions</h3>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>• Assurez-vous que le document est bien éclairé</li>
          <li>• Tous les détails doivent être clairement visibles</li>
          <li>• Le document doit être entièrement visible dans le cadre</li>
          <li>• Évitez les reflets ou les ombres sur le document</li>
        </ul>
      </div>
    </div>
  );
}