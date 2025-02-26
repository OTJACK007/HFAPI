import { Select, SelectItem, Button } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "./types";
import { KYCFieldConfig, defaultKYCFieldConfig } from "../../config/kycFields";

interface AddressDocOption {
  key: string;
  value: string;
  label: string;
}

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  fieldConfig?: KYCFieldConfig;
  onNext?: () => void;
  onBack?: () => void;
}

export default function KYCSelectDocAddress({ 
  register, 
  errors, 
  fieldConfig = defaultKYCFieldConfig,
  onNext,
  onBack
}: Props) {
  // Liste complète des types de justificatifs de domicile
  const allAddressDocOptions: AddressDocOption[] = [
    { key: "bill", value: "bill", label: "Facture (électricité, eau, téléphone, etc.)" },
    { key: "certificate", value: "certificate", label: "Attestation de domicile" },
    { key: "bankStatement", value: "bankStatement", label: "Relevé bancaire" }
  ];

  // Filtrer les options en fonction de la configuration
  const availableAddressDocs = allAddressDocOptions.filter(doc => 
    fieldConfig.addressDocumentTypes[doc.key as keyof typeof fieldConfig.addressDocumentTypes]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Justificatif de domicile</h2>
      
      <div className="bg-primary/10 p-4 rounded-lg mb-4">
        <p className="text-sm text-white">
          Veuillez sélectionner le type de justificatif de domicile que vous souhaitez fournir.
        </p>
      </div>
      
      <Select
        {...register('addressDocType')}
        label="Type de justificatif"
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
        {availableAddressDocs.map((doc) => (
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
        <h3 className="text-sm font-semibold mb-2">Conditions d'acceptation</h3>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>• Document de moins de 3 mois</li>
          <li>• Document à votre nom complet</li>
          <li>• Adresse complète visible</li>
          <li>• Document lisible et non altéré</li>
        </ul>
      </div>
      
      {/* Boutons de navigation */}
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