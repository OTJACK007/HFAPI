import { useState, useEffect } from "react";
import { Input, Card, CardBody, Button } from "@nextui-org/react";
import { ChevronLeft, ChevronRight, KeyRound } from "lucide-react";
import { UseFormRegister, Controller, Control, FieldErrors } from "react-hook-form";
import { FormData } from "./types";

interface Props {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  documentType: string;
  onNext: () => void;
  onBack: () => void;
}

export default function KYBIDNumber({ register, control, errors, documentType, onNext, onBack }: Props) {
  const [illustrationSrc, setIllustrationSrc] = useState("");
  const [idLabel, setIdLabel] = useState("");
  const [idPlaceholder, setIdPlaceholder] = useState("");
  
  useEffect(() => {
    // Définir l'image d'illustration et les textes en fonction du type de document
    switch (documentType) {
      case "id":
        setIllustrationSrc("https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//CNIIDNumberIllustration.gif");
        setIdLabel("Numéro de la carte d'identité");
        setIdPlaceholder("123456789012");
        break;
      case "passport":
        setIllustrationSrc("https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//PassportIDNumberIllustration.gif");
        setIdLabel("Numéro du passeport");
        setIdPlaceholder("12AB34567");
        break;
      case "residence":
        setIllustrationSrc("https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//TitreSejourIDNumberIllustration.gif");
        setIdLabel("Numéro du titre de séjour");
        setIdPlaceholder("123456789012");
        break;
      case "license":
        setIllustrationSrc("https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//PermisIDNumberIllustration.gif");
        setIdLabel("Numéro du permis de conduire");
        setIdPlaceholder("12AB12345678");
        break;
      default:
        setIllustrationSrc("https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//CNIIDNumberIllustration.gif");
        setIdLabel("Numéro du document");
        setIdPlaceholder("Entrez le numéro du document");
    }
  }, [documentType]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Numéro du document du représentant</h2>
      
      <div className="space-y-6">
        <div className="flex items-center gap-2 bg-primary/10 p-3 rounded-lg">
          <KeyRound className="text-primary w-6 h-6 flex-shrink-0" />
          <p className="text-sm text-white">
            Veuillez saisir le numéro du document d'identité du représentant légal
          </p>
        </div>
        
        <div className="space-y-1">
          <Input
            {...register('documentNumber')}
            label={idLabel}
            variant="bordered"
            color="primary"
            placeholder={idPlaceholder}
            isInvalid={!!errors.documentNumber}
            errorMessage={errors.documentNumber?.message}
            classNames={{
              label: "text-white/90",
              input: "text-white",
            }}
          />
          <p className="text-xs text-gray-400">
            Ce numéro se trouve sur le document comme illustré ci-dessous
          </p>
        </div>
        
        <Card className="bg-background/40 border border-white/10">
          <CardBody className="p-3 flex justify-center">
            {illustrationSrc && (
              <img 
                src={illustrationSrc} 
                alt="Illustration du numéro de document" 
                className="max-h-48 object-contain" 
              />
            )}
          </CardBody>
        </Card>
      </div>
      
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