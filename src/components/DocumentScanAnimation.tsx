import React, { useState, useEffect } from 'react';
import { Card, Button, Progress } from '@nextui-org/react';
import { Check, X, RotateCcw, ChevronRight, Scan, FileCheck, FileSearch } from 'lucide-react';

interface DocumentScanAnimationProps {
  imageSrc: string | null;
  onRetry: () => void;
  onContinue: () => void;
}

export const DocumentScanAnimation: React.FC<DocumentScanAnimationProps> = ({
  imageSrc,
  onRetry,
  onContinue
}) => {
  const [currentStep, setCurrentStep] = useState<'scanning' | 'quality' | 'details' | 'complete' | 'failed'>('scanning');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Analyse en cours...');
  const [isSuccess, setIsSuccess] = useState(true);

  // Simulation du processus de scan
  useEffect(() => {
    if (currentStep === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 2;
          
          // Transition to next step based on progress
          if (newProgress >= 100) {
            setCurrentStep('quality');
            setMessage('Vérification de la qualité de l\'image...');
            return 0;
          }
          
          return newProgress;
        });
      }, 20);
      
      return () => clearInterval(interval);
    } 
    else if (currentStep === 'quality') {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 3;
          
          if (newProgress >= 100) {
            setCurrentStep('details');
            setMessage('Vérification des détails du document...');
            return 0;
          }
          
          return newProgress;
        });
      }, 20);
      
      return () => clearInterval(interval);
    } 
    else if (currentStep === 'details') {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 2;
          
          if (newProgress >= 100) {
            // Random success (90% success rate for demo purposes)
            const success = Math.random() > 0.1;
            setIsSuccess(success);
            setCurrentStep(success ? 'complete' : 'failed');
            setMessage(success ? 'Document validé avec succès!' : 'Problème détecté avec le document.');
            return 100;
          }
          
          return newProgress;
        });
      }, 20);
      
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background/90 border border-white/20">
        <div className="p-6 space-y-6">
          {/* Captured Image Preview */}
          <div className="relative rounded-lg overflow-hidden border-2 border-primary/50">
            {imageSrc && (
              <img src={imageSrc} alt="Document capturé" className="w-full object-contain max-h-64" />
            )}
            
            {currentStep === 'scanning' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse bg-primary/30 w-full h-1 absolute top-1/2 transform -translate-y-1/2"></div>
                <Scan className="w-16 h-16 text-primary animate-pulse" />
              </div>
            )}
            
            {currentStep === 'quality' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-primary/40 animate-[pulse_1.5s_ease-in-out_infinite] rounded-lg"></div>
                <FileCheck className="w-16 h-16 text-primary animate-pulse" />
              </div>
            )}
            
            {currentStep === 'details' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full p-2">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="bg-primary/20 animate-[pulse_1s_ease-in-out_infinite] rounded-sm" 
                        style={{ animationDelay: `${i * 0.05}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
                <FileSearch className="w-16 h-16 text-primary animate-pulse" />
              </div>
            )}
            
            {currentStep === 'complete' && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                <Check className="w-24 h-24 text-green-500" />
              </div>
            )}
            
            {currentStep === 'failed' && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                <X className="w-24 h-24 text-red-500" />
              </div>
            )}
          </div>
          
          {/* Status and Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-white/90 font-semibold">{message}</p>
              {(currentStep === 'complete' || currentStep === 'failed') && (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${isSuccess ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {isSuccess ? 'Succès' : 'Échec'}
                </span>
              )}
            </div>
            
            {(currentStep !== 'complete' && currentStep !== 'failed') && (
              <Progress 
                value={progress} 
                color={currentStep === 'scanning' ? "primary" : currentStep === 'quality' ? "secondary" : "warning"}
                className="h-2"
                isIndeterminate={false}
                showValueLabel={false}
              />
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {(currentStep === 'complete' || currentStep === 'failed') && (
              <>
                <Button
                  variant="flat"
                  color={isSuccess ? "default" : "danger"}
                  className="flex-1"
                  startContent={<RotateCcw className="w-4 h-4" />}
                  onClick={onRetry}
                >
                  {isSuccess ? "Reprendre" : "Réessayer"}
                </Button>
                
                <Button
                  color={isSuccess ? "success" : "primary"}
                  className="flex-1"
                  endContent={<ChevronRight className="w-4 h-4" />}
                  onClick={onContinue}
                >
                  {isSuccess ? "Continuer" : "Ignorer"}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};