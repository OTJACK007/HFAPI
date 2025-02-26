import { Input } from "@nextui-org/react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "./types";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export default function KYCBasicInfo({ register, errors }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Informations personnelles</h2>
      <div className="space-y-4">
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
      </div>
    </div>
  );
}