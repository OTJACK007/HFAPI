import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Bell } from 'lucide-react';

export default function NotifyStatus() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-500/20 via-background to-background" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full bg-background/40 border border-white/10">
          <CardHeader className="flex flex-col items-center pt-8 pb-0">
            <div className="relative">
              <div className="absolute inset-0 animate-glow rounded-full"></div>
              <Bell className="w-20 h-20 text-amber-500" />
            </div>
          </CardHeader>
          <CardBody className="flex flex-col items-center text-center gap-6 py-8">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-amber-500">
                C'est noté !
              </h1>
              <p className="text-gray-400">
                Restez branché, nous vous informerons dès que votre vérification sera terminée.
              </p>
            </div>

            <div className="w-full space-y-6">
              {/* Info Card */}
              <Card className="bg-background/40 border border-amber-500/20">
                <CardBody className="py-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Comment serez-vous informé ?</h3>
                    <ul className="space-y-3 text-sm text-gray-400 text-left">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        Email de notification dès validation
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        SMS de confirmation (optionnel)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        Notification dans l'application
                      </li>
                    </ul>
                  </div>
                </CardBody>
              </Card>

              {/* Contact Info */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-400">
                  Pour toute question, contactez-nous :
                </p>
                <p className="text-sm font-semibold text-amber-500">
                  support@humanface.xyz
                </p>
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