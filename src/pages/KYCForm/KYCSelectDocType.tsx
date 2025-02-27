import { Select, SelectItem } from "@nextui-org/react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "./types";
import { KYCFieldConfig, defaultKYCFieldConfig } from "../../config/kycFields";

interface DocumentOption {
  key: string;
  value: string;
  label: string;
}

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  fieldConfig?: KYCFieldConfig;
}

export default function KYCSelectDocType({ register, errors, fieldConfig = defaultKYCFieldConfig }: Props) {
  // Liste complète des types de documents
  const allDocumentOptions: DocumentOption[] = [
    { key: "id", value: "id", label: "Carte d'identité" },
    { key: "passport", value: "passport", label: "Passeport" },
    { key: "residence", value: "residence", label: "Titre de séjour" },
    { key: "license", value: "license", label: "Permis de conduire" }
  ];

  // Filtrer les options en fonction de la configuration
  const availableDocuments = allDocumentOptions.filter(doc => 
    fieldConfig.documentTypes[doc.key as keyof typeof fieldConfig.documentTypes]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Type de document</h2>
      <Select
        {...register('documentType')}
        label="Sélectionnez un document"
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
    </div>
  );
}