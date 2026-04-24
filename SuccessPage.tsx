import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, Home, Phone, Clock, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAccidentReport } from '../context/AccidentReportContext';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

export default function SuccessPage() {
  const navigate = useNavigate();
  const { report, resetReport } = useAccidentReport();

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handleNewReport = () => {
    resetReport();
    navigate('/');
  };

  if (!report.opjId) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <CheckCircle className="h-12 w-12 text-white" />
          </motion.div>
          
          <h1 className="text-2xl mb-2 text-gray-900">Signalement envoyé !</h1>
          <p className="text-gray-600">
            Votre signalement a été transmis avec succès
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* OPJ Info */}
          <Card className="p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h2 className="font-semibold mb-3">OPJ notifié via WhatsApp</h2>
            <div className="space-y-2">
              <p className="text-sm text-blue-100">
                <strong className="text-white">Nom :</strong> {report.opjName}
              </p>
              <p className="text-sm text-blue-100">
                <strong className="text-white">Zone :</strong> {report.commune} - {report.quartier}
              </p>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-5">
            <h2 className="font-semibold mb-4 text-gray-900">Prochaines étapes</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900">L'OPJ vous contactera</h3>
                  <p className="text-sm text-gray-600">
                    Gardez votre téléphone à portée de main. L'OPJ peut vous appeler pour des informations complémentaires.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900">Intervention rapide</h3>
                  <p className="text-sm text-gray-600">
                    L'OPJ arrivera sur les lieux dans les plus brefs délais avec toutes les informations nécessaires.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900">Restez sur place</h3>
                  <p className="text-sm text-gray-600">
                    Si possible, restez sur les lieux de l'accident jusqu'à l'arrivée de l'OPJ.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Reference Number */}
          <Card className="p-5 bg-gray-50">
            <p className="text-sm text-gray-600 mb-1">Numéro de référence</p>
            <p className="text-lg font-mono text-gray-900">
              #{Date.now().toString().slice(-8)}
            </p>
          </Card>

          {/* Emergency Notice */}
          <Card className="p-4 bg-red-50 border-red-200">
            <p className="text-sm text-red-900">
              <strong>⚠️ Urgence médicale :</strong> Si des personnes sont gravement blessées, contactez immédiatement les services d'urgence médicale.
            </p>
          </Card>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleNewReport}
              size="lg"
              className="w-full"
            >
              <Home className="mr-2 h-5 w-5" />
              Retour à l'accueil
            </Button>
          </div>

          {/* Thank You Message */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900 text-center">
              Merci d'avoir utilisé <strong>Alert Accident RDC</strong>. Votre contribution aide à améliorer la sécurité routière.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
