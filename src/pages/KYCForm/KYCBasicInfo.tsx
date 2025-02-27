import { Input } from "@nextui-org/react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "./types";
import { KYCFieldConfig, defaultKYCFieldConfig } from "../../config/kycFields";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  fieldConfig?: KYCFieldConfig;
}

export default function KYCBasicInfo({ register, errors, fieldConfig = defaultKYCFieldConfig }: Props) {
  // Utiliser la configuration par défaut si non spécifiée
  const fields = fieldConfig.basicInfo;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Informations personnelles</h2>
      <div className="space-y-4">
        {/* Les champs obligatoires - toujours affichés */}
        <Input
          {...register('firstName')}
          label="Prénom"
          variant="bordered"
          color="primary"
          isInvalid={!!errors.firstName}
          onInput={(e) => register('firstName').onChange(e)}
          errorMessage={errors.firstName?.message}
          className="max-w-full"
          classNames={{
            label: "text-white/90",
            input: "text-white",
          }}
        />
        <Input
          {...register('lastName')}
          label="Nom"
          variant="bordered"
          color="primary"
          isInvalid={!!errors.lastName}
          onInput={(e) => register('lastName').onChange(e)}
          errorMessage={errors.lastName?.message}
          className="max-w-full"
          classNames={{
            label: "text-white/90",
            input: "text-white",
          }}
        />

        {/* Champs configurables */}
        {fields.email && (
          <Input
            {...register('email')}
            type="email"
            label="Email"
            variant="bordered"
            color="primary"
            isInvalid={!!errors.email}
            onInput={(e) => register('email').onChange(e)}
            errorMessage={errors.email?.message}
            className="max-w-full"
            classNames={{
              label: "text-white/90",
              input: "text-white",
            }}
          />
        )}
        
        {fields.phone && (
          <Input
            {...register('phone')}
            type="tel"
            label="Téléphone"
            placeholder="+33 6 12 34 56 78"
            variant="bordered"
            color="primary"
            isInvalid={!!errors.phone}
            onInput={(e) => register('phone').onChange(e)}
            errorMessage={errors.phone?.message}
            className="max-w-full"
            classNames={{
              label: "text-white/90",
              input: "text-white",
            }}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">🇫🇷</span>
              </div>
            }
          />
        )}
        
        {fields.additionalInfo && (
          <Input
            {...register('additionalInfo')}
            label="Information additionnelle"
            variant="bordered"
            color="primary"
            onInput={(e) => register('additionalInfo').onChange(e)}
            className="max-w-full"
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