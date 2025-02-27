import { useState } from "react";
import { Input, Select, SelectItem } from "@nextui-org/react";
import countryList from "react-select-country-list";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "./types";
import { KYCFieldConfig, defaultKYCFieldConfig } from "../../config/kycFields";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  fieldConfig?: KYCFieldConfig;
}

export default function KYCAddress({ register, errors, fieldConfig = defaultKYCFieldConfig }: Props) {
  const countries = countryList().getData();
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  
  // Utiliser la configuration par défaut si non spécifiée
  const fields = fieldConfig.addressInfo;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Adresse</h2>
      <div className="space-y-4">
        {/* Champs obligatoires - toujours affichés */}
        <Input
          value={addressLine}
          onChange={(e) => {
            setAddressLine(e.target.value);
            register('addressLine').onChange(e);
          }}
          placeholder="Entrez votre adresse"
          label="Ligne d'adresse"
          variant="bordered"
          color="primary"
          isInvalid={!!errors.addressLine}
          errorMessage={errors.addressLine?.message}
          classNames={{
            label: "text-white/90",
            input: "text-white",
          }}
        />

        <Input
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            register('city').onChange(e);
          }}
          placeholder="Entrez votre ville"
          label="Ville"
          variant="bordered"
          color="primary"
          isInvalid={!!errors.city}
          errorMessage={errors.city?.message}
          classNames={{
            label: "text-white/90",
            input: "text-white",
          }}
        />

        <Select
          {...register('country')}
          label="Pays"
          variant="bordered"
          color="primary"
          className="max-w-full"
          isInvalid={!!errors.country}
          errorMessage={errors.country?.message}
          classNames={{
            base: "max-w-full",
            label: "text-white/90 text-sm",
            value: "text-white text-sm",
            trigger: "h-[56px] bg-transparent border-2 border-white/20 data-[hover=true]:border-white/40 rounded-lg",
            listbox: "bg-background border-small border-white/10 rounded-lg",
            popover: "bg-background border-small border-white/10 rounded-lg",
          }}
        >
          {countries.map((country) => (
            <SelectItem 
              key={country.value} 
              value={country.value}
              className="text-white data-[hover=true]:bg-white/10"
            >
              {country.label}
            </SelectItem>
          ))}
        </Select>

        {/* Champs configurables */}
        {fields.postalCode && (
          <Input
            {...register('postalCode')}
            label="Code postal"
            variant="bordered"
            color="primary"
            isInvalid={!!errors.postalCode}
            errorMessage={errors.postalCode?.message}
            classNames={{
              label: "text-white/90",
              input: "text-white",
            }}
          />
        )}

        {fields.state && (
          <Input
            {...register('state')}
            label="État/Province/Région"
            variant="bordered"
            color="primary"
            isInvalid={!!errors.state}
            errorMessage={errors.state?.message}
            classNames={{
              label: "text-white/90",
              input: "text-white",
            }}
          />
        )}
      </div>
    </div>
  );
}