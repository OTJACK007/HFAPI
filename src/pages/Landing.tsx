import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { Smartphone, Shield, Camera, FileText, UserCheck, Clock, Lock, ScanFace, Video } from 'lucide-react';
import { useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-background to-background" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full bg-background/40 border border-secondary/10">
          <CardBody className="flex flex-col items-center text-center gap-6 py-8">
            <img
              src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//HFAnimatedLanding.gif"
              alt="HumanFace Landing Logo"
              className="w-24 h-24 mx-auto mb-4 animate-glow rounded-lg"
            />
            <h1 className="text-3xl font-bold text-secondary">
              Vérifiez votre identité avec HumanFace
            </h1>
            <p className="text-gray-400 flex items-center justify-center gap-1">
              Vérification rapide et sécurisée en moins de
              <span className="text-primary font-bold animate-pulse-text">5 minutes</span>
            </p>

            {/* Security Info */}
            <Card className="w-full bg-background/40 border border-secondary/20">
              <CardBody className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-secondary" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Sécurité maximale</h3>
                  <p className="text-xs text-gray-400">Vos données sont fortement cryptées et stockées de manière sécurisée</p>
                </div>
              </CardBody>
            </Card>

            {/* Steps Overview */}
            <div className="w-full space-y-4">
              <h3 className="text-lg font-semibold">Comment ça marche ?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/20 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white">Informations de base</p>
                    <p className="text-xs text-gray-400">Remplissez vos informations personnelles</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-secondary/20 p-2 rounded-lg">
                    <Camera className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white">Document d'identité</p>
                    <p className="text-xs text-gray-400">Prenez en photo votre document</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-secondary/20 p-2 rounded-lg">
                    <UserCheck className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white">Selfie</p>
                    <p className="text-xs text-gray-400">Prenez un selfie pour confirmer votre identité</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-secondary/20 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white">Validation rapide</p>
                    <p className="text-xs text-gray-400">Résultat en quelques minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Policy Link */}
            <p className="text-sm text-gray-400">
              En continuant, vous acceptez notre{' '}
              <a 
                href="https://humanface.xyz/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                politique de confidentialité
              </a>
            </p>

            {/* CTA Button */}
            <div className="w-full space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-gray-400">Choisissez une option</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-secondary hover:opacity-90 text-white font-semibold"
                endContent={<ScanFace className="w-5 h-5" />}
                onClick={() => navigate('/verify')}
              >
                Vérification Web
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-gray-400">ou</span>
                </div>
              </div>

              <Card className="bg-background/40 border border-secondary/20 cursor-pointer hover:bg-background/60 transition-all">
                <CardBody className="py-4" onClick={() => setIsAppModalOpen(true)}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="bg-secondary/20 p-2 rounded-lg">
                      <Smartphone className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Vérification via l'application</p>
                      <p className="text-xs text-gray-400">Plus rapide - En un seul swipe !</p>
                    </div>
                    <div className="flex gap-2">
                      <img
                        src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//AppleWhite.png"
                        alt="Download on App Store"
                        className="h-8 relative z-10"
                      />
                      <img
                        src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//logo-play-store-colored.png"
                        alt="Get it on Google Play"
                        className="h-8 relative z-10"
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Modal pour la vérification via l'application */}
      <Modal 
        isOpen={isAppModalOpen} 
        onClose={() => setIsAppModalOpen(false)}
        className="bg-background/95 border border-secondary/20 max-w-md"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-secondary">Vérification via l'application</h2>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <img
                  src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile/logo%20brands/Animation%20Loading%20Logo.gif"
                  alt="HumanFace Loading"
                  className="w-24 h-24"
                />
                <p className="text-center text-sm text-gray-400">
                  Nous attendons votre swipe !
                </p>
                <Button
                  variant="light"
                  color="primary"
                  size="sm"
                  startContent={<Video className="w-4 h-4" />}
                  onClick={() => setIsHowToModalOpen(true)}
                >
                  Comment faire ?
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <Smartphone className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Téléchargez l'application HumanFace</p>
                  <p className="text-xs text-gray-400">Disponible sur iOS et Android</p>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <a
                  href="#"
                  className="relative overflow-hidden bg-[#2A2A2A] rounded-xl p-2 shadow-lg hover:scale-105 transition-transform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//AppleWhite.png"
                    alt="Download on App Store"
                    className="h-8"
                  />
                </a>
                <a
                  href="#"
                  className="relative overflow-hidden bg-[#2A2A2A] rounded-xl p-2 shadow-lg hover:scale-105 transition-transform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//logo-play-store-colored.png"
                    alt="Get it on Google Play"
                    className="h-8"
                  />
                </a>
              </div>
              <div className="space-y-4 border-t border-white/10 pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center bg-[#E5FFF3] w-6 h-6 rounded-full">
                      <span className="text-xs font-bold text-[#2eff94]">1</span>
                    </div>
                    <p className="text-sm text-gray-400 text-left">Ouvrez l'application HumanFace et créez votre compte</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center bg-[#E5FFF3] w-6 h-6 rounded-full">
                      <span className="text-xs font-bold text-[#2eff94]">2</span>
                    </div>
                    <p className="text-sm text-gray-400 text-left">Configurez votre identité dans l'application</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center bg-[#E5FFF3] w-6 h-6 rounded-full">
                      <span className="text-xs font-bold text-[#2eff94]">3</span>
                    </div>
                    <p className="text-sm text-gray-400 text-left">Swipez pour vérifier votre identité en quelques secondes !</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#E5FFF3]/10 p-4 rounded-lg">
                <p className="text-xs text-gray-400">
                  <span className="text-[#2eff94] font-semibold">Note :</span> Vous devez d'abord configurer votre identité dans l'application avant de pouvoir utiliser la vérification rapide.
                </p>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal pour la démonstration du swipe */}
      <Modal 
        isOpen={isHowToModalOpen} 
        onClose={() => setIsHowToModalOpen(false)}
        className="bg-background/95 border border-secondary/20 max-w-md"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-secondary">Comment vérifier avec un swipe ?</h2>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <img
                  src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//MobileSDKAPP.gif"
                  alt="Démonstration du swipe"
                  className="w-full rounded-xl"
                />
                <p className="text-sm text-gray-400 text-center">
                  Suivez simplement les instructions dans l'application et swipez pour vérifier votre identité en quelques secondes !
                </p>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}