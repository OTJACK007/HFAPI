import { Select, SelectItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "./types";
import { KYBFieldConfig, defaultKYBFieldConfig } from "../../config/kybFields";

interface DocumentOption {
  key: string;
  value: string;
  label: string;
}

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  onNext: () => void;
  onBack: () => void;
  fieldConfig?: KYBFieldConfig;
}

export default function KYBBusinessDocType({ register, errors, onNext, onBack, fieldConfig = defaultKYBFieldConfig }: Props) {
  // Liste complète des types de documents d'entreprise
  const allDocumentOptions: DocumentOption[] = [
    { key: "kbis", value: "kbis", label: "Extrait Kbis" },
    { key: "registration", value: "registration", label: "Certificat d'immatriculation" },
    { key: "articles", value: "articles", label: "Statuts de l'entreprise" },
    { key: "tax", value: "tax", label: "Attestation fiscale" }
  ];

  // Filtrer les options en fonction de la configuration
  const availableDocuments = allDocumentOptions.filter(doc => 
    fieldConfig.businessDocTypes[doc.key as keyof typeof fieldConfig.businessDocTypes]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Documents de l'entreprise</h2>
      <Select
        {...register('businessDocType')}
        label="Type de document"
        variant="bordered"
        color="primary"
        classNames={{
          base: "max-w-full",
          label: "text-white/90 text-sm",
          value: "text-white text-sm",
          trigger: "h-[56px] bg-transparent border-2 border-white/20 data-[hover=true]:border-white/40 rounded-lg",
          listbox: "bg-background border-small border-white/10 rounded-lg",
          popover: "bg-background border-small border-white/10 rounded-lg",
        }}
      >
        {availableDocuments.map((doc) => (
          <SelectItem 
            key={doc.key} 
            value={doc.value}
            className="text-white data-[hover=true]:bg-white/10"
          >
            {doc.label}
          </SelectItem>
        ))}
      </Select>

      <div className="mt-4 p-4 bg-background/40 border border-white/10 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Documents acceptés</h3>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>• Document original ou copie certifiée conforme</li>
          <li>• Document de moins de 3 mois</li>
          <li>• Format PDF ou image haute résolution</li>
          <li>• Tous les champs doivent être lisibles</li>
        </ul>
        
        <div className="flex gap-2 pt-8">
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
    </div>
  );
}