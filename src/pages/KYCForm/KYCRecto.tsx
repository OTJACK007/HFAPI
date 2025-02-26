import { Card, CardBody } from "@nextui-org/react";
import { Upload } from "lucide-react";
import { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";

interface Props {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
}

export default function KYCRecto({ getRootProps, getInputProps }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Photo recto du document</h2>
      <Card
        {...getRootProps()}
        className="border-2 border-dashed border-primary/50 bg-background/40"
      >
        <CardBody className="py-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="w-12 h-12 mb-4 text-primary" />
            <p className="text-sm text-gray-400">
              Prenez en photo le recto de votre document ou sélectionnez une image
            </p>
            <input {...getInputProps()} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
