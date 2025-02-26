import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, Progress } from '@nextui-org/react';
import { useDropzone } from 'react-dropzone';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FormData, formSchema } from './KYBForm/types';

import KYBCompanyInfo from './KYBForm/KYBCompanyInfo';
import KYBRepresentativeInfo from './KYBForm/KYBRepresentativeInfo';
import KYBAddress from './KYBForm/KYBAddress';
import KYBBusinessDocType from './KYBForm/KYBBusinessDocType';
import KYBRecto from './KYBForm/KYBRecto';
import KYBVerso from './KYBForm/KYBVerso';
import KYBSelectDocType from './KYBForm/KYBSelectDocType';
import KYBMobile from './KYBForm/KYBMobile';
import KYBLiveness from './KYBForm/KYBLiveness';

export default function KYBForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [businessDoc, setBusinessDoc] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const { register, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { getRootProps: getBusinessDocProps, getInputProps: getBusinessDocInputProps } = useDropzone({
    accept: { 'application/pdf': [], 'image/*': [] },
    onDrop: files => setBusinessDoc(files[0]),
  });

  const { getRootProps: getFrontProps, getInputProps: getFrontInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: files => setDocumentFront(files[0]),
  });

  const { getRootProps: getBackProps, getInputProps: getBackInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: files => setDocumentBack(files[0]),
  });

  const handleCaptureSelfie = () => {
    if (!isCameraActive) {
      setIsCameraActive(true);
      return;
    }
    // Logic to capture selfie will be implemented here
  };

  const handleNextStep = () => {
    if (step < 8) {
      setStep(step + 1);
    } else {
      navigate('/verifying');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <KYBCompanyInfo register={register} errors={errors} />;

      case 2:
        return <KYBRepresentativeInfo register={register} errors={errors} />;

      case 3:
        return <KYBAddress register={register} errors={errors} />;

      case 4:
        return <KYBBusinessDocType 
          register={register} 
          errors={errors}
          onNext={handleNextStep}
          onBack={() => setStep(step - 1)}
        />;

      case 5:
        return <KYBRecto 
          getRootProps={getBusinessDocProps} 
          getInputProps={getBusinessDocInputProps}
          onNext={handleNextStep}
          onBack={() => setStep(step - 1)}
        />;

      case 6:
        return <KYBSelectDocType register={register} errors={errors} />;

      case 7:
        return <KYBRecto 
          getRootProps={getFrontProps} 
          getInputProps={getFrontInputProps}
          onNext={handleNextStep}
          onBack={() => setStep(step - 1)}
        />;

      case 8:
        return <KYBMobile onContinueOnDevice={() => setStep(step + 1)} />;

      case 9:
        return (
          <KYBLiveness
            isCameraActive={isCameraActive}
            handleCaptureSelfie={handleCaptureSelfie}
            setIsCameraActive={setIsCameraActive}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-background to-background" />
      
      {/* Header with Progress */}
      <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex justify-center mb-4">
            <img
              src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile/logo%20brands/newHlogoHumanface%20(1).png"
              alt="HumanFace Logo"
              className="h-8"
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold">Vérification d'entreprise</h1>
            <span className="text-sm text-primary">
              {step}/9
            </span>
          </div>
          <Progress 
            value={(step / 9) * 100}
            className="h-1"
            color="primary"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-24 px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-background/40 border border-white/10">
            <CardBody className="p-6">
              <div className="space-y-8">
                {renderStep()}
                
                {step !== 4 && step !== 5 && step !== 7 && (
                  <div className="flex gap-2 pt-4">
                    {step > 1 && step !== 7 && (
                      <Button
                        type="button"
                        variant="bordered"
                        onClick={() => setStep(step - 1)}
                        startContent={<ChevronLeft size={20} />}
                        className="flex-1 text-white"
                      >
                        Retour
                      </Button>
                    )}
                    {step !== 7 && (
                      <Button
                        onClick={handleNextStep}
                        color="primary"
                        className={`flex-1 text-white ${step === 1 ? 'w-full' : ''}`}
                        endContent={step < 8 && <ChevronRight size={20} />}
                      >
                        {step === 8 ? 'Terminer' : 'Continuer'}
                      </Button>
                    )}
                  </div>
                )}
                <div className="flex flex-col items-center gap-2 mt-8 pt-6 border-t border-white/10">
                  <img
                    src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile/logo%20brands/LogoHumanfaceCarre.png"
                    alt="HumanFace Logo"
                    className="w-8 h-8"
                  />
                  <p className="text-xs text-gray-500">
                    powered by <a href="https://humanface.xyz" className="hover:text-primary transition-colors">humanface.xyz</a>
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}