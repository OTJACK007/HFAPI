import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Progress } from '@nextui-org/react';
import { XCircle, RefreshCcw, Smartphone, MessageSquare } from 'lucide-react';

export default function Failed() {
  const navigate = useNavigate();
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-red-500/20 via-background to-background" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full bg-background/40 border border-white/10">
          <CardHeader className="flex flex-col items-center pt-8 pb-0">
            <div className="relative">
              <div className="absolute inset-0 animate-glow rounded-full"></div>
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
          </CardHeader>
          <CardBody className="flex flex-col items-center text-center gap-6 py-8">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-red-500">
                Vérification échouée
              </h1>
              <p className="text-gray-400">
                Nous n'avons pas pu valider votre identité.
              </p>
            </div>

            <div className="w-full space-y-6">
              {/* Status Card */}
              <Card className="bg-background/40 border border-red-500/20">
                <CardBody className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-500/20 p-2 rounded-lg">
                      <XCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Raison</p>
                      <p className="text-xs text-gray-400">Document illisible ou invalide</p>
                    </div>
                    <Progress 
                      size="sm"
                      value={100}
                      color="danger"
                      className="w-24"
                    />
                  </div>
                </CardBody>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  color="primary"
                  variant="shadow"
                  startContent={<RefreshCcw className="w-4 h-4" />}
                  className="w-full"
                  onClick={() => navigate('/verify')}
                >
                  Reprendre la vérification
                </Button>
                <Button
                  variant="bordered"
                  startContent={<MessageSquare className="w-4 h-4" />}
                  className="w-full text-white"
                  onClick={() => navigate('/contact-team')}
                >
                  Contacter l'équipe
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