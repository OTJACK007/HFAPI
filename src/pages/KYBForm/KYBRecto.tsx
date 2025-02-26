import { useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { Upload, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";
import Webcam from "react-webcam";

interface Props {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  onNext: () => void;
  onBack: () => void;
}

export default function KYBRecto({ getRootProps, getInputProps, onNext, onBack }: Props) {
  const [useCamera, setUseCamera] = useState(true);
  const [isCaptureReady, setIsCaptureReady] = useState(false);
  const webcamRef = useState<Webcam | null>(null)[0];

  const handleCapture = () => {
    // Logic to capture the document would be implemented here
    // For now, just proceed to next step
    onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Document de l'entreprise</h2>
      
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
                Alignez votre document dans le cadre et assurez-vous qu'il est lisible
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
            
            <Button
              variant="flat"
              className="bg-background/40"
              onClick={() => setUseCamera(false)}
            >
              <Upload className="w-5 h-5 text-primary" />
            </Button>
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