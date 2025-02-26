import { Select, SelectItem } from "@nextui-org/react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "./types";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export default function KYCSelectDocType({ register, errors }: Props) {
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
        <SelectItem 
          key="id" 
          value="id"
          className="text-white data-[hover=true]:bg-white/10"
        >
          Carte d'identité
        </SelectItem>
        <SelectItem 
          key="passport" 
          value="passport"
          className="text-white data-[hover=true]:bg-white/10"
        >
          Passeport
        </SelectItem>
        <SelectItem 
          key="residence" 
          value="residence"
          className="text-white data-[hover=true]:bg-white/10"
        >
          Titre de séjour
        </SelectItem>
        <SelectItem 
          key="license" 
          value="license"
          className="text-white data-[hover=true]:bg-white/10"
        >
          Permis de conduire
        </SelectItem>
      </Select>
    </div>
  );
}