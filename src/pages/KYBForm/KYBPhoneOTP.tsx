import { useState, useEffect } from "react";
import { Input, Button, Card } from "@nextui-org/react";
import { Smartphone, RefreshCw } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "./types";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  phone: string;
  onVerified: () => void;
  onBack: () => void;
}

export default function KYBPhoneOTP({ register, errors, phone, onVerified, onBack }: Props) {
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  
  // Format phone to show only last 4 digits
  const maskedPhone = phone ? 
    `+XX X XX XX ${phone.slice(-4)}` : 
    "votre numéro professionnel";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleResend = () => {
    setIsResending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      setTimer(30);
      // Show a success message or toast here
    }, 1500);
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      setVerificationError("Le code doit contenir 6 chiffres");
      return;
    }
    
    setIsVerifying(true);
    setVerificationError("");
    
    // Simulate verification (in a real app, you would call your API)
    setTimeout(() => {
      setIsVerifying(false);
      
      // For demo purposes, any 6-digit code is valid
      if (otp.length === 6) {
        onVerified();
      } else {
        setVerificationError("Code invalide. Veuillez réessayer.");
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Vérification du téléphone professionnel</h2>
      
      <div className="flex items-center justify-center">
        <div className="bg-primary/20 p-4 rounded-full">
          <Smartphone className="w-8 h-8 text-primary" />
        </div>
      </div>
      
      <Card className="bg-background/40 border border-primary/20 p-4">
        <p className="text-sm text-center text-white">
          Nous avons envoyé un code par SMS à <span className="font-semibold">{maskedPhone}</span>
        </p>
      </Card>
      
      <div className="space-y-4">
        <Input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
          label="Code de vérification"
          placeholder="Entrez le code à 6 chiffres"
          variant="bordered"
          color="primary"
          maxLength={6}
          inputMode="numeric"
          isInvalid={!!verificationError}
          errorMessage={verificationError}
          classNames={{
            label: "text-white/90",
            input: "text-white text-center text-xl tracking-widest",
          }}
        />

        <Button
          color="primary"
          className="w-full"
          onClick={handleVerify}
          isLoading={isVerifying}
        >
          Vérifier
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Vous n'avez pas reçu de code ?
          </p>
          {timer > 0 ? (
            <p className="text-sm text-gray-500">
              Renvoyer le code dans <span className="font-semibold">{timer}s</span>
            </p>
          ) : (
            <Button
              variant="light"
              color="primary"
              isIconOnly={false}
              isLoading={isResending}
              startContent={!isResending && <RefreshCw className="w-4 h-4" />}
              onClick={handleResend}
              className="mt-1"
            >
              Renvoyer le code
            </Button>
          )}
        </div>
      </div>
      
      <Button
        variant="flat"
        className="w-full text-white bg-background/40"
        onClick={onBack}
      >
        Retour
      </Button>
    </div>
  );
}