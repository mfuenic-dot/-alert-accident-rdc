import { useNavigate } from 'react-router';
import { AlertTriangle, MapPin, Phone, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { motion } from 'motion/react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl mb-2 text-gray-900">Alert Accident RDC</h1>
          <p className="text-gray-600">Système de signalement rapide d'accidents</p>
        </motion.div>

        {/* Main Alert Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 mb-6 bg-white shadow-xl">
            <div className="text-center mb-6">
              <h2 className="text-xl mb-2 text-gray-900">Signaler un accident</h2>
              <p className="text-sm text-gray-600">
                Notre assistant IA vous guidera à travers chaque étape du processus
              </p>
            </div>

            <Button
              onClick={() => navigate('/commune')}
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white h-14 text-lg"
            >
              <AlertTriangle className="mr-2 h-5 w-5" />
              Nouveau Signalement
            </Button>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <Card className="p-4 flex items-start gap-4 bg-white/80">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-gray-900">Géolocalisation automatique</h3>
              <p className="text-sm text-gray-600">
                Votre position GPS est partagée automatiquement avec l'OPJ
              </p>
            </div>
          </Card>

          <Card className="p-4 flex items-start gap-4 bg-white/80">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-gray-900">Notification via WhatsApp</h3>
              <p className="text-sm text-gray-600">
                L'OPJ reçoit instantanément toutes les informations sur WhatsApp
              </p>
            </div>
          </Card>

          <Card className="p-4 flex items-start gap-4 bg-white/80">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-gray-900">OPJ disponibles 24/7</h3>
              <p className="text-sm text-gray-600">
                Choisissez parmi les officiers en ligne dans votre commune
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Emergency Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <p className="text-sm text-amber-800">
            <strong>Urgence médicale ?</strong> En cas de blessés graves, contactez également les services d'urgence médicale.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
