import { Input, Select, SelectItem } from "@nextui-org/react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "./types";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export default function KYBBasicInfo({ register, errors }: Props) {
  const industries = [
    { value: 'tech', label: 'Technologies' },
    { value: 'finance', label: 'Finance' },
    { value: 'retail', label: 'Commerce de détail' },
    { value: 'manufacturing', label: 'Industrie' },
    { value: 'services', label: 'Services' },
    { value: 'other', label: 'Autre' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Informations de l'entreprise</h2>
      <div className="space-y-4">
        <Input
          {...register('companyName')}
          label="Nom de l'entreprise"
          variant="bordered"
          color="primary"
          isInvalid={!!errors.companyName}
          errorMessage={errors.companyName?.message}
          className="max-w-full"
          classNames={{
            label: "text-white/90",
            input: "text-white",
          }}
        />
        
        <Input
          {...register('registrationNumber')}
          label="Numéro SIREN/SIRET"
          variant="bordered"
          color="primary"
          isInvalid={!!errors.registrationNumber}
          errorMessage={errors.registrationNumber?.message}
          className="max-w-full"
          classNames={{
            label: "text-white/90",
            input: "text-white",
          }}
        />

        <Input
          {...register('vatNumber')}
          label="Numéro de TVA (optionnel)"
          variant="bordered"
          color="primary"
          isInvalid={!!errors.vatNumber}
          errorMessage={errors.vatNumber?.message}
          className="max-w-full"
          classNames={{
            label: "text-white/90",
            input: "text-white",
          }}
        />

        <Select
          {...register('industry')}
          label="Secteur d'activité"
          variant="bordered"
          color="primary"
          className="max-w-full"
          isInvalid={!!errors.industry}
          errorMessage={errors.industry?.message}
          classNames={{
            base: "max-w-full",
            label: "text-white/90 text-sm",
            value: "text-white text-sm",
            trigger: "h-[56px] bg-transparent border-2 border-white/20 data-[hover=true]:border-white/40 rounded-lg",
            listbox: "bg-background border-small border-white/10 rounded-lg",
            popover: "bg-background border-small border-white/10 rounded-lg",
          }}
        >
          {industries.map((industry) => (
            <SelectItem 
              key={industry.value} 
              value={industry.value}
              className="text-white data-[hover=true]:bg-white/10"
            >
              {industry.label}
            </SelectItem>
          ))}
        </Select>

        <div className="space-y-4 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold">Représentant légal</h3>
          
          <Input
            {...register('firstName')}
            label="Prénom"
            variant="bordered"
            color="primary"
            isInvalid={!!errors.firstName}
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
            errorMessage={errors.lastName?.message}
            className="max-w-full"
            classNames={{
              label: "text-white/90",
              input: "text-white",
            }}
          />

          <Input
            {...register('position')}
            label="Poste occupé"
            variant="bordered"
            color="primary"
            isInvalid={!!errors.position}
            errorMessage={errors.position?.message}
            className="max-w-full"
            classNames={{
              label: "text-white/90",
              input: "text-white",
            }}
          />

          <Input
            {...register('email')}
            type="email"
            label="Email professionnel"
            variant="bordered"
            color="primary"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            className="max-w-full"
            classNames={{
              label: "text-white/90",
              input: "text-white",
            }}
          />

          <Input
            {...register('phone')}
            type="tel"
            label="Téléphone professionnel"
            placeholder="+33 6 12 34 56 78"
            variant="bordered"
            color="primary"
            isInvalid={!!errors.phone}
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
        </div>
      </div>
    </div>
  );
}