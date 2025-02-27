import { useState, useRef, useEffect } from "react";
import { Button, Card, Progress } from "@nextui-org/react";
import { Camera, AlertCircle, CheckCircle, ArrowRight, RotateCw } from "lucide-react";
import Webcam from "react-webcam";
import FullscreenCamera from "../../components/FullscreenCamera";

interface Props {
  onComplete: () => void;
}

export default function KYBLiveness({ onComplete }: Props) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<'center' | 'left' | 'right' | 'done'>('center');
  const [progress, setProgress] = useState(0);
  const webcamRef = useRef<Webcam>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isCaptureReady, setIsCaptureReady] = useState(false);
  
  const instructions = {
    center: "Placez le visage du représentant au centre",
    left: "Tournez légèrement la tête vers la gauche",
    right: "Tournez légèrement la tête vers la droite",
    done: "Liveness détecté avec succès !"
  };
  
  const flipCamera = () => {
    setFacingMode(prevMode => (prevMode === "user" ? "environment" : "user"));
  };
  
  // Cette fonction ne sera pas utilisée pour la capture d'image réelle
  // mais est nécessaire pour le composant FullscreenCamera
  const handleCapture = (imageSrc: string) => {
    // Rien à faire ici, la capture est gérée par le processus de liveness
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isCameraActive && currentStep !== 'done') {
      // Simulate liveness detection progress
      timer = setTimeout(() => {
        if (currentStep === 'center') {
          setCountdown(3);
          const countInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev === 1) {
                clearInterval(countInterval);
                setCurrentStep('left');
                setProgress(33);
                return null;
              }
              return prev ? prev - 1 : null;
            });
          }, 1000);
        } else if (currentStep === 'left') {
          setCountdown(3);
          const countInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev === 1) {
                clearInterval(countInterval);
                setCurrentStep('right');
                setProgress(66);
                return null;
              }
              return prev ? prev - 1 : null;
            });
          }, 1000);
        } else if (currentStep === 'right') {
          setCountdown(3);
          const countInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev === 1) {
                clearInterval(countInterval);
                setCurrentStep('done');
                setProgress(100);
                return null;
              }
              return prev ? prev - 1 : null;
            });
          }, 1000);
        }
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isCameraActive, currentStep]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Vérification de 
présence réelle</h2>
      
      {isCameraActive ? (
        <div className="space-y-4">
          <div className="relative mx-auto rounded-xl overflow-hidden">
            <FullscreenCamera
              webcamRef={webcamRef}
              facingMode={facingMode}
              onFlipCamera={flipCamera}
              onCapture={handleCapture}
              isCaptureReady={isCaptureReady}
              frameText={instructions[currentStep]}
              showFrame={false} // Pas de cadre rectangulaire, nous avons notre propre élément oval
            />
            
            {/* Face guide overlay */}
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              <div className={`
                w-48 h-64 border-2 rounded-full 
                ${currentStep === 'done' ? 'border-green-500' : 'border-primary'} 
                ${currentStep === 'center' ? 'animate-pulse' : ''}
                ${currentStep === 'left' ? 'translate-x-4' : ''}
                ${currentStep === 'right' ? '-translate-x-4' : ''}
                transition-all duration-500
              `}></div>
            </div>
            
            {/* Step indicator */}
            <div className={`
              absolute bottom-4 left-0 right-0 mx-auto w-4/5 bg-background/80 
              backdrop-blur-sm rounded-lg p-3 text-center transition-all
            `}>
              <div className="flex items-center justify-center gap-2">
                {currentStep === 'done' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-primary" />
                )}
                <p className="text-sm font-medium text-white">
                  {instructions[currentStep]}
                </p>
                {countdown && (
                  <span className="ml-2 w-6 h-6 flex items-center justify-center bg-primary/20 rounded-full text-xs font-bold text-white">
                    {countdown}
                  </span>
                )}
              </div>
              <Progress 
                value={progress} 
                color={currentStep === 'done' ? "success" : "primary"}
                className="mt-2 h-1"
              />
            </div>
          </div>

          {currentStep === 'done' && (
            <Button
              color="success"
              variant="shadow"
              size="lg"
              onClick={onComplete}
              className="w-full mt-4"
              endContent={<ArrowRight className="w-4 h-4" />}
            >
              Continuer
            </Button>
          )}
        </div>
      ) : (
        <Card className="p-4 bg-background/40 border border-primary/50">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3">
              <div className="bg-primary/20 p-4 rounded-full">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-center">Détection de vie réelle</h3>
              <p className="text-sm text-gray-400 text-center">
                Cette étape nous permet de vérifier que le représentant légal est bien une personne réelle
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Instructions:</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <span className="text-xs">1</span>
                  </div>
                  <span>Placez le visage du représentant au centre du cadre</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <span className="text-xs">2</span>
                  </div>
                  <span>Suivez les instructions à l'écran</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <span className="text-xs">3</span>
                  </div>
                  <span>Restez dans un environnement bien éclairé</span>
                </li>
              </ul>
            </div>
            
            <Button
              color="primary"
              variant="shadow"
              size="lg"
              onClick={() => setIsCameraActive(true)}
              className="w-full"
              startContent={<Camera className="w-5 h-5" />}
            >
              Démarrer la vérification
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}