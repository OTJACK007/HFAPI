import { Input, Select, SelectItem } from "@nextui-org/react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "./types";
import { KYBFieldConfig, defaultKYBFieldConfig } from "../../config/kybFields";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  fieldConfig?: KYBFieldConfig;
}

export default function KYBCompanyInfo({ register, errors, fieldConfig = defaultKYBFieldConfig }: Props) {
  // Utiliser la configuration par défaut si non spécifiée
  const fields = fieldConfig.companyInfo;

  const industries = [
    { value: 'tech', label: 'Technologies' },
    { value: 'finance', label: 'Finance' },
    { value: 'retail', label: 'Commerce de détail' },
    { value: 'manufacturing', label: 'Industrie' },
    { value: 'services', label: 'Services' },
    { value: 'other', label: 'Autre' },
  ];

  const employeeCounts = [
    { value: '1-10', label: '1-10 employés' },
    { value: '11-50', label: '11-50 employés' },
    { value: '51-200', label: '51-200 employés' },
    { value: '201-500', label: '201-500 employés' },
    { value: '501-1000', label: '501-1000 employés' },
    { value: '1000+', label: 'Plus de 1000 employés' },
  ];

  const revenueRanges = [
    { value: 'less-100k', label: 'Moins de 100K €' },
    { value: '100k-500k', label: '100K € - 500K €' },
    { value: '500k-1m', label: '500K € - 1M €' },
    { value: '1m-5m', label: '1M € - 5M €' },
    { value: '5m-10m', label: '5M € - 10M €' },
    { value: '10m+', label: 'Plus de 10M €' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Informations de l'entreprise</h2>
      <div className="space-y-4">
        {/* Champs obligatoires - toujours affichés */}
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
          {...register('website')}
          label="Site web"
          placeholder="https://www.entreprise.com"
          type="url"
          variant="bordered"
          color="primary"
          isInvalid={!!errors.website}
          errorMessage={errors.website?.message}
          className="max-w-full"
          classNames={{
            label: "text-white/90",
            input: "text-white",
          }}
        />

        {/* Champs configurables */}
        {fields.vatNumber && (
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
        )}

        {fields.incorporationDate && (
          <Input
            {...register('incorporationDate')}
            label="Date de création"
            type="date"
            placeholder="JJ/MM/AAAA"
            variant="bordered"
            color="primary"
            isInvalid={!!errors.incorporationDate}
            errorMessage={errors.incorporationDate?.message}
            className="max-w-full"
            classNames={{
              label: "text-white/90",
              input: "text-white",
            }}
          />
        )}

        {fields.employeeCount && (
          <Select
            {...register('employeeCount')}
            label="Nombre d'employés"
            variant="bordered"
            color="primary"
            className="max-w-full"
            isInvalid={!!errors.employeeCount}
            errorMessage={errors.employeeCount?.message}
            classNames={{
              base: "max-w-full",
              label: "text-white/90 text-sm",
              value: "text-white text-sm",
              trigger: "h-[56px] bg-transparent border-2 border-white/20 data-[hover=true]:border-white/40 rounded-lg",
              listbox: "bg-background border-small border-white/10 rounded-lg",
              popover: "bg-background border-small border-white/10 rounded-lg",
            }}
          >
            {employeeCounts.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="text-white data-[hover=true]:bg-white/10"
              >
                {option.label}
              </SelectItem>
            ))}
          </Select>
        )}

        {fields.annualRevenue && (
          <Select
            {...register('annualRevenue')}
            label="Chiffre d'affaires annuel"
            variant="bordered"
            color="primary"
            className="max-w-full"
            isInvalid={!!errors.annualRevenue}
            errorMessage={errors.annualRevenue?.message}
            classNames={{
              base: "max-w-full",
              label: "text-white/90 text-sm",
              value: "text-white text-sm",
              trigger: "h-[56px] bg-transparent border-2 border-white/20 data-[hover=true]:border-white/40 rounded-lg",
              listbox: "bg-background border-small border-white/10 rounded-lg",
              popover: "bg-background border-small border-white/10 rounded-lg",
            }}
          >
            {revenueRanges.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="text-white data-[hover=true]:bg-white/10"
              >
                {option.label}
              </SelectItem>
            ))}
          </Select>
        )}

        {fields.industry && (
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
        )}
      </div>
    </div>
  );
}