import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Progress } from '@nextui-org/react';
import { CheckCircle2 } from 'lucide-react';

export default function Verifying() {
  const navigate = useNavigate();
  const [verificationStep, setVerificationStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const verificationSteps = [
    "Nous vérifions si votre document est valide...",
    "Nous vérifions si vous n'êtes pas une IA...",
    "Nous vérifions si vous n'êtes pas un fraudeur...",
    "Juste une dernière vérification..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setVerificationStep((current) => {
        if (current < verificationSteps.length - 1) {
          setCompletedSteps(prev => [...prev, current]);
          return current + 1;
        }
        clearInterval(interval);
        navigate('/success');
        return current;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-background to-background" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full bg-background/40 border border-white/10">
          <CardBody className="p-6">
            <div className="space-y-8">
              <div className="space-y-4 text-center">
                <img
                  src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile/logo%20brands/Animation%20Loading%20Logo.gif"
                  alt="HumanFace Loading"
                  className="w-24 h-24 mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold mb-6 text-center">Vérification en cours</h2>
                <div className="space-y-4 mb-6">
                  {verificationSteps.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 transition-opacity duration-500 ${
                        index <= verificationStep ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {completedSteps.includes(index) ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary animate-scaleIn" />
                      ) : index === verificationStep ? (
                        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-5 h-5" />
                      )}
                      <p className={`text-sm ${
                        completedSteps.includes(index) ? 'text-secondary' : 'text-gray-400'
                      }`}>
                        {message}
                      </p>
                    </div>
                  ))}
                </div>
                <Progress
                  size="md"
                  isIndeterminate
                  aria-label="Loading..."
                  className="max-w-md"
                  color="secondary"
                />
              </div>

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
  );
}