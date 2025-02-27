import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select, SelectItem, Card, CardBody, Progress } from '@nextui-org/react';
import { useDropzone } from 'react-dropzone';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FormData, formSchema } from './KYBForm/types';
import { KYBStepConfig, defaultKYBConfig } from '../config/kybSteps';
import { KYBFieldConfig, defaultKYBFieldConfig } from '../config/kybFields';
import { KYBThemeConfig, defaultKYBTheme } from '../config/KYBTheme';
import { useKYBFlow } from '../hooks/useKYBFlow';
import { KYBThemeWrapper } from '../components/ThemeWrapper';

import KYBCompanyInfo from './KYBForm/KYBCompanyInfo';
import KYBRepresentativeInfo from './KYBForm/KYBRepresentativeInfo';
import KYBEmailOTP from './KYBForm/KYBEmailOTP';
import KYBPhoneOTP from './KYBForm/KYBPhoneOTP';
import KYBAddress from './KYBForm/KYBAddress';
import KYBBusinessDocType from './KYBForm/KYBBusinessDocType';
import KYBRecto from './KYBForm/KYBRecto';
import KYBVerso from './KYBForm/KYBVerso';
import KYBSelectDocType from './KYBForm/KYBSelectDocType';
import KYBIDNumber from './KYBForm/KYBIDNumber';
import KYBMobile from './KYBForm/KYBMobile';
import KYBSelfie from './KYBForm/KYBSelfie';
import KYBLiveness from './KYBForm/KYBLiveness';
import KYBSelectDocAddress from './KYBForm/KYBSelectDocAddress';
import KYBProofAddress from './KYBForm/KYBProofAddress';

// Vous pouvez importer ou définir dynamiquement votre configuration depuis votre API/base de données
// Par exemple: const kybConfig = await fetchKYBConfigFromDatabase(); 

interface KYBFormProps {
  stepConfig?: KYBStepConfig;
  fieldConfig?: KYBFieldConfig;
  themeConfig?: KYBThemeConfig;
}

export default function KYBForm({ 
  stepConfig = defaultKYBConfig,
  fieldConfig = defaultKYBFieldConfig,
  themeConfig = defaultKYBTheme
}: KYBFormProps) {
  const navigate = useNavigate();
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [businessDoc, setBusinessDoc] = useState<File | null>(null);
  const [addressDoc, setAddressDoc] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: 'id',
      addressDocType: 'bill'
    }
  });
  
  const { register, control, formState: { errors }, watch } = methods;
  const documentType = useWatch({
    control,
    name: 'documentType',
    defaultValue: 'id'
  });
  
  const addressDocType = useWatch({
    control,
    name: 'addressDocType',
    defaultValue: 'bill'
  });
  
  const email = watch('email', '');
  const phone = watch('phone', '');

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
  
  const { getRootProps: getAddressDocProps, getInputProps: getAddressDocInputProps } = useDropzone({
    accept: { 'application/pdf': [], 'image/*': [] },
    onDrop: files => setAddressDoc(files[0]),
  });

  const handleCaptureSelfie = () => {
    if (!isCameraActive) {
      setIsCameraActive(true);
      return;
    }
    // Logic to capture selfie will be implemented here
    nextStep();
  };

  const { 
    currentStep, 
    currentStepIndex, 
    totalSteps, 
    nextStep, 
    prevStep,
    activeSteps,
    isMobile
  } = useKYBFlow(stepConfig);

  const [step, setStep] = useState(1);

  // Synchroniser l'état du step avec le gestionnaire de flow
  useEffect(() => {
    if (currentStep) {
      setStep(currentStep.index);
    }
  }, [currentStep]);

  const handleLivenessComplete = () => {
    navigate('/verifying');
  };

  const renderStep = () => {
    switch (currentStep?.id) {
      case 'companyInfo':
        return <KYBCompanyInfo register={register} errors={errors} fieldConfig={fieldConfig} />;

      case 'representativeInfo':
        return <KYBRepresentativeInfo register={register} errors={errors} fieldConfig={fieldConfig} />;
        
      case 'emailVerification':
        return (
          <KYBEmailOTP 
            register={register} 
            errors={errors} 
            email={email}
            onVerified={nextStep}
            onBack={prevStep}
          />
        );
        
      case 'phoneVerification':
        return (
          <KYBPhoneOTP 
            register={register} 
            errors={errors} 
            phone={phone}
            onVerified={nextStep}
            onBack={prevStep}
          />
        );

      case 'addressInfo':
        return <KYBAddress register={register} errors={errors} fieldConfig={fieldConfig} />;

      case 'businessDocType':
        return <KYBBusinessDocType 
          register={register} 
          errors={errors}
          onNext={nextStep}
          onBack={prevStep}
          fieldConfig={fieldConfig}
        />;

      case 'businessDocCapture':
        return <KYBRecto 
          getRootProps={getBusinessDocProps} 
          getInputProps={getBusinessDocInputProps}
          onNext={nextStep}
          onBack={prevStep}
          title="Document de l'entreprise"
          fieldConfig={fieldConfig}
        />;
        
      case 'addressDocSelection':
        return <KYBSelectDocAddress 
          register={register} 
          errors={errors} 
          fieldConfig={fieldConfig}
          onNext={nextStep}
          onBack={prevStep}
        />;
        
      case 'addressDocCapture':
        return <KYBProofAddress 
          getRootProps={getAddressDocProps} 
          getInputProps={getAddressDocInputProps}
          onNext={nextStep}
          onBack={prevStep}
          fieldConfig={fieldConfig}
          addressDocType={addressDocType}
        />;

      case 'idDocSelection':
        return <KYBSelectDocType register={register} errors={errors} fieldConfig={fieldConfig} />;
        
      case 'idDocNumber':
        return (
          <KYBIDNumber 
            register={register} 
            control={control}
            errors={errors}
            documentType={documentType}
            onNext={nextStep}
            onBack={prevStep}
          />
        );

      case 'idDocRectoCapture':
        return <KYBRecto 
          getRootProps={getFrontProps} 
          getInputProps={getFrontInputProps}
          onNext={nextStep}
          onBack={prevStep}
          title="Document recto d'identité"
          fieldConfig={fieldConfig}
        />;
        
      case 'idDocVersoCapture':
        return <KYBVerso
          getRootProps={getBackProps} 
          getInputProps={getBackInputProps}
          onNext={nextStep}
          onBack={prevStep}
          fieldConfig={fieldConfig}
        />;

      case 'mobileOption':
        // Si on est sur mobile, cette étape ne devrait jamais s'afficher
        // car elle est filtrée dans useKYBFlow
        return <KYBMobile onContinueOnDevice={nextStep} />;

      case 'selfieCapture':
        return (
          <KYBSelfie
            isCameraActive={isCameraActive}
            handleCaptureSelfie={handleCaptureSelfie}
            setIsCameraActive={setIsCameraActive}
          />
        );
        
      case 'livenessDetection':
        return <KYBLiveness onComplete={handleLivenessComplete} />;

      default:
        return <div>Étape non configurée</div>;
    }
  };

  // Déterminer si les boutons de navigation doivent être affichés
  const showNavButtons = () => {
    const noButtonSteps = [
      'emailVerification', 
      'phoneVerification',
      'businessDocType',
      'businessDocCapture',
      'addressDocSelection',
      'addressDocCapture',
      'idDocNumber',
      'idDocRectoCapture',
      'idDocVersoCapture',
      'mobileOption',
      'livenessDetection'
    ];
    return !noButtonSteps.includes(currentStep?.id || '');
  };

  return (
    <KYBThemeWrapper>
      <FormProvider {...methods}>
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
                  {currentStepIndex + 1}/{totalSteps}
                </span>
              </div>
              <Progress 
                value={((currentStepIndex + 1) / totalSteps) * 100}
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
                    
                    {showNavButtons() && (
                      <div className="flex gap-2 pt-4">
                        {currentStepIndex > 0 && (
                          <Button
                            type="button"
                            variant="bordered"
                            onClick={prevStep}
                            startContent={<ChevronLeft size={20} />}
                            className="flex-1 text-white"
                          >
                            Retour
                          </Button>
                        )}
                        <Button
                          onClick={nextStep}
                          color="primary"
                          className={`flex-1 text-white ${currentStepIndex === 0 ? 'w-full' : ''}`}
                          endContent={<ChevronRight size={20} />}
                        >
                          Continuer
                        </Button>
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
      </FormProvider>
    </KYBThemeWrapper>
  );
}