import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select, SelectItem, Card, CardBody, Progress } from '@nextui-org/react';
import { useDropzone } from 'react-dropzone';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FormData, formSchema } from './KYCForm/types';
import { KYCStepConfig, defaultKYCConfig } from '../config/kycSteps';
import { KYCFieldConfig, defaultKYCFieldConfig } from '../config/kycFields';
import { KYCThemeConfig, defaultKYCTheme } from '../config/KYCTheme';
import { useKYCFlow } from '../hooks/useKYCFlow';
import { KYCThemeWrapper } from '../components/ThemeWrapper';

import KYCBasicInfo from './KYCForm/KYCBasicInfo';
import KYCEmailOTP from './KYCForm/KYCEmailOTP';
import KYCPhoneOTP from './KYCForm/KYCPhoneOTP';
import KYCAddress from './KYCForm/KYCAddress';
import KYCSelectDocType from './KYCForm/KYCSelectDocType';
import KYCIDNumber from './KYCForm/KYCIDNumber';
import KYCRecto from './KYCForm/KYCRecto';
import KYCVerso from './KYCForm/KYCVerso';
import KYCMobile from './KYCForm/KYCMobile';
import KYCSelfie from './KYCForm/KYCSelfie';
import KYCLiveness from './KYCForm/KYCLiveness';

// Vous pouvez importer ou définir dynamiquement votre configuration depuis votre API/base de données
// Par exemple: const kycConfig = await fetchKYCConfigFromDatabase(); 

interface KYCFormProps {
  stepConfig?: KYCStepConfig;
  fieldConfig?: KYCFieldConfig;
  themeConfig?: KYCThemeConfig;
}

export default function KYCForm({ 
  stepConfig = defaultKYCConfig,
  fieldConfig = defaultKYCFieldConfig,
  themeConfig = defaultKYCTheme
}: KYCFormProps) {
  const navigate = useNavigate();
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: 'id'
    }
  });
  
  const { register, control, formState: { errors }, watch } = methods;
  const documentType = useWatch({
    control,
    name: 'documentType',
    defaultValue: 'id'
  });
  
  const email = watch('email', '');
  const phone = watch('phone', '');

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
    nextStep();
  };

  const { 
    currentStep, 
    currentStepIndex, 
    totalSteps, 
    nextStep, 
    prevStep,
    activeSteps 
  } = useKYCFlow(stepConfig);

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
      case 'basicInfo':
        return <KYCBasicInfo register={register} errors={errors} fieldConfig={fieldConfig} />;
        
      case 'emailVerification':
        return (
          <KYCEmailOTP 
            register={register} 
            errors={errors} 
            email={email}
            onVerified={nextStep}
            onBack={prevStep}
          />
        );
        
      case 'phoneVerification':
        return (
          <KYCPhoneOTP 
            register={register} 
            errors={errors} 
            phone={phone}
            onVerified={nextStep}
            onBack={prevStep}
          />
        );

      case 'addressInfo':
        return <KYCAddress register={register} errors={errors} fieldConfig={fieldConfig} />;

      case 'documentSelection':
        return <KYCSelectDocType register={register} errors={errors} fieldConfig={fieldConfig} />;
        
      case 'documentIdNumber':
        return (
          <KYCIDNumber 
            register={register} 
            control={control}
            errors={errors}
            documentType={documentType}
            onNext={nextStep}
            onBack={prevStep}
          />
        );

      case 'documentRectoCapture':
        return <KYCRecto 
          getRootProps={getFrontProps} 
          getInputProps={getFrontInputProps}
          fieldConfig={fieldConfig}
        />;

      case 'documentVersoCapture':
        return <KYCVerso 
          getRootProps={getBackProps} 
          getInputProps={getBackInputProps}
          fieldConfig={fieldConfig}
        />;

      case 'mobileOption':
        return <KYCMobile onContinueOnDevice={() => nextStep()} />;

      case 'selfieCapture':
        return (
          <KYCSelfie
            isCameraActive={isCameraActive}
            handleCaptureSelfie={handleCaptureSelfie}
            setIsCameraActive={setIsCameraActive}
          />
        );
        
      case 'livenessDetection':
        return <KYCLiveness onComplete={handleLivenessComplete} />;

      default:
        return <div>Étape non configurée</div>;
    }
  };

  // Déterminer si les boutons de navigation doivent être affichés
  const showNavButtons = () => {
    const noButtonSteps = ['emailVerification', 'phoneVerification', 'documentIdNumber', 'mobileOption', 'livenessDetection'];
    return !noButtonSteps.includes(currentStep?.id || '');
  };

  return (
    <KYCThemeWrapper>
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
                <h1 className="text-lg font-semibold">Vérification d'identité</h1>
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
    </KYCThemeWrapper>
  );
}