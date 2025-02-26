import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { MessageSquareHeart } from 'lucide-react';

export default function ContactTeam() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-background to-background" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full bg-background/40 border border-white/10">
          <CardHeader className="flex flex-col items-center pt-8 pb-0">
            <div className="relative">
              <div className="absolute inset-0 animate-glow rounded-full"></div>
              <MessageSquareHeart className="w-20 h-20 text-primary" />
            </div>
          </CardHeader>
          <CardBody className="flex flex-col items-center text-center gap-6 py-8">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Message reçu !
              </h1>
              <p className="text-gray-400">
                Notre équipe a été notifiée et reviendra vers vous dans les plus brefs délais.
              </p>
            </div>

            <div className="w-full space-y-6">
              {/* Info Card */}
              <Card className="bg-background/40 border border-primary/20">
                <CardBody className="py-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Que va-t-il se passer ?</h3>
                    <ul className="space-y-3 text-sm text-gray-400 text-left">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Un expert examinera votre cas sous 24h
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Vous recevrez un email avec les instructions
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Notre équipe vous guidera pas à pas
                      </li>
                    </ul>
                  </div>
                </CardBody>
              </Card>

              {/* Contact Info */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-400">
                  Pour toute urgence, contactez-nous :
                </p>
                <p className="text-sm font-semibold text-primary">
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