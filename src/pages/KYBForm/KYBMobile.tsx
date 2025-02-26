import { useState } from 'react';
import { Card, CardBody, Button, Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { Smartphone, Mail, MessageSquare, Copy, Monitor, ChevronLeft, CheckCircle2 } from "lucide-react";

interface Props {
  onContinueOnDevice: () => void;
}

export default function KYBMobile({ onContinueOnDevice }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'main' | 'email' | 'sms' | 'copy'>('main');

  const handleBack = () => {
    setCurrentStep('main');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'email':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary/20 p-4 rounded-full">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Lien envoyé par email !</h3>
                <p className="text-sm text-gray-400">
                  Vérifiez votre boîte de réception professionnelle pour continuer la vérification
                </p>
              </div>
            </div>
            <Button
              variant="bordered"
              className="w-full text-white"
              onClick={handleBack}
              startContent={<ChevronLeft className="w-4 h-4" />}
            >
              Retour
            </Button>
          </div>
        );

      case 'sms':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary/20 p-4 rounded-full">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Lien envoyé par SMS !</h3>
                <p className="text-sm text-gray-400">
                  Vérifiez vos messages professionnels pour continuer la vérification
                </p>
              </div>
            </div>
            <Button
              variant="bordered"
              className="w-full text-white"
              onClick={handleBack}
              startContent={<ChevronLeft className="w-4 h-4" />}
            >
              Retour
            </Button>
          </div>
        );

      case 'copy':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary/20 p-4 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Lien copié !</h3>
                <p className="text-sm text-gray-400">
                  Vous pouvez maintenant le coller où vous voulez
                </p>
              </div>
            </div>
            <Button
              variant="bordered"
              className="w-full text-white"
              onClick={handleBack}
              startContent={<ChevronLeft className="w-4 h-4" />}
            >
              Retour
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <Button
              variant="bordered"
              className="w-full justify-start text-white h-14"
              startContent={<Mail className="w-5 h-5 text-primary" />}
              onClick={() => setCurrentStep('email')}
            >
              M'envoyer le lien par email
            </Button>

            <Button
              variant="bordered"
              className="w-full justify-start text-white h-14"
              startContent={<MessageSquare className="w-5 h-5 text-primary" />}
              onClick={() => setCurrentStep('sms')}
            >
              M'envoyer le lien par SMS
            </Button>

            <Button
              variant="bordered"
              className="w-full justify-start text-white h-14"
              startContent={<Copy className="w-5 h-5 text-primary" />}
              onClick={() => setCurrentStep('copy')}
            >
              Copier le lien
            </Button>

            <Button
              variant="bordered"
              className="w-full justify-start text-white h-14"
              startContent={<Monitor className="w-5 h-5 text-primary" />}
              onClick={() => {
                setIsModalOpen(false);
                onContinueOnDevice();
              }}
            >
              Continuer sur cet appareil
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-6">
        <img
          src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile/logo%20brands/Animation%20Loading%20Logo.gif"
          alt="HumanFace Loading"
          className="w-24 h-24"
        />
        <h2 className="text-2xl font-bold text-center">Passez sur mobile</h2>
        <p className="text-sm text-gray-400 text-center">
          Pour une meilleure expérience, nous vous recommandons de continuer sur votre téléphone
        </p>
      </div>

      <Card className="bg-background/40 border border-primary/20">
        <CardBody className="py-8 flex flex-col items-center gap-6">
          <img
            src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//qr-code-sample-icon-vector-stock-illustration-isolated-white-background-147992599.jpg"
            alt="QR Code"
            className="w-48 h-48 rounded-xl"
          />
          <p className="text-sm text-gray-400">
            Scannez ce QR code pour continuer sur mobile
          </p>
        </CardBody>
      </Card>

      <Button
        variant="bordered"
        className="w-full text-white"
        onClick={() => setIsModalOpen(true)}
      >
        Autres options
      </Button>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        placement="bottom"
        className="bg-background border-t border-white/10"
        hideCloseButton
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut"
              }
            },
            exit: {
              y: 20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn"
              }
            }
          }
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">
              {currentStep === 'main' ? 'Autres options' : 'Confirmation'}
            </h3>
          </ModalHeader>
          <ModalBody className="space-y-4 pb-6">
            {renderStep()}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}