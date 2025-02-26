import { Input } from "@nextui-org/react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "./types";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export default function KYBRepresentativeInfo({ register, errors }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Représentant légal</h2>
      <div className="space-y-4">
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
  );
}