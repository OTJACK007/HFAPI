import { Card, CardBody, Button } from "@nextui-org/react";
import { Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";

interface Props {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  onNext: () => void;
  onBack: () => void;
}

export default function KYBRecto({ getRootProps, getInputProps, onNext, onBack }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Document de l'entreprise</h2>
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
