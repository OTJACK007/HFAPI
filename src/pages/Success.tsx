import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Progress } from '@nextui-org/react';
import { CheckCircle, Share2, Smartphone } from 'lucide-react';

export default function Success() {
  const navigate = useNavigate();
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-secondary/20 via-background to-background" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full bg-background/40 border border-white/10">
          <CardHeader className="flex flex-col items-center pt-8 pb-0">
            <div className="relative">
              <div className="absolute inset-0 animate-glow rounded-full"></div>
              <CheckCircle className="w-20 h-20 text-secondary" />
            </div>
          </CardHeader>
          <CardBody className="flex flex-col items-center text-center gap-6 py-8">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Vérification réussie !
              </h1>
              <p className="text-gray-400">
                Votre identité a été vérifiée avec succès.
              </p>
            </div>

            <div className="w-full space-y-6">
              {/* Status Card */}
              <Card className="bg-background/40 border border-secondary/20">
                <CardBody className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-secondary/20 p-2 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Statut</p>
                      <p className="text-xs text-gray-400">Vérifié</p>
                    </div>
                    <Progress 
                      size="sm"
                      value={100}
                      color="success"
                      className="w-24"
                    />
                  </div>
                </CardBody>
              </Card>

              {/* Next Steps */}
              <div className="space-y-3 text-left">
                <h3 className="text-lg font-semibold">Prochaines étapes</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    Vous recevrez un email de confirmation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    Votre compte sera activé sous 24h
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    Vous pourrez accéder à tous nos services
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="mb-8">
                <Button
                  color="primary"
                  variant="shadow"
                  startContent={<Share2 className="w-4 h-4" />}
                  className="w-full"
                >
                  Partager mon statut vérifié
                </Button>
              </div>

              {/* App Download Section */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold">Téléchargez l'application</h3>
                </div>
                <p className="text-sm text-gray-400">
                  La prochaine fois, vérifiez votre identité en un swipe avec l'application HumanFace !
                </p>
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <a
                    href="#"
                    className="relative overflow-hidden bg-[#2A2A2A] rounded-xl p-2 shadow-lg -translate-y-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
                    <img
                      src={isDarkMode 
                        ? "https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//AppleWhite.png"
                        : "https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//Appleblack.png"
                      }
                      alt="Download on App Store"
                      className="h-10 relative z-10"
                    />
                  </a>
                  <a
                    href="#"
                    className="relative overflow-hidden bg-[#2A2A2A] rounded-xl p-2 shadow-lg -translate-y-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
                    <img
                      src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile//logo-play-store-colored.png"
                      alt="Get it on Google Play"
                      className="h-10 relative z-10"
                    />
                  </a>
                </div>
              </div>
            </div>
          </CardBody>
          <div className="flex flex-col items-center gap-2 pb-6">
            <img
              src="https://rfpjrfuuupsnlehsmhfo.supabase.co/storage/v1/object/public/myfile/logo%20brands/LogoHumanfaceCarre.png"
              alt="HumanFace Logo"
              className="w-8 h-8"
            />
            <p className="text-xs text-gray-500">
              powered by <a href="https://humanface.xyz" className="hover:text-primary transition-colors">humanface.xyz</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}