import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Shield, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { useAccidentReport } from '../context/AccidentReportContext';
import { fetchOPJByLocation } from '../../services/api';
import { OPJ } from '../types';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function OPJPage() {
  const navigate = useNavigate();
  const { report, updateReport } = useAccidentReport();
  const [selectedOPJ, setSelectedOPJ] = useState(report.opjId || '');
  const [availableOPJs, setAvailableOPJs] = useState<OPJ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOPJs() {
      if (!report.commune || !report.quartier) {
        toast.error('Veuillez d\'abord sélectionner une commune et un quartier');
        navigate('/commune');
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchOPJByLocation(report.commune, report.quartier);

        // Parse lastSeen dates
        const parsedData = data.map((opj: any) => ({
          ...opj,
          lastSeen: opj.lastSeen ? new Date(opj.lastSeen) : undefined,
        }));

        setAvailableOPJs(parsedData);

        if (parsedData.length === 0) {
          toast.info('Aucun OPJ trouvé dans ce quartier');
        }
      } catch (error) {
        console.error('Error loading OPJs:', error);
        toast.error('Erreur lors du chargement des OPJ');
      } finally {
        setIsLoading(false);
      }
    }

    loadOPJs();
  }, [report.commune, report.quartier, navigate]);

  const handleContinue = () => {
    if (!selectedOPJ) {
      toast.error('Veuillez sélectionner un OPJ');
      return;
    }

    const opj = availableOPJs.find(o => o.id === selectedOPJ);
    if (!opj) return;

    updateReport({
      opjId: opj.id,
      opjName: opj.name
    });

    toast.success(`OPJ ${opj.name} sélectionné`);
    navigate('/media');
  };

  const getTimeAgo = (date: Date | undefined): string => {
    if (!date) return 'Jamais vu';
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'En ligne';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    return `Il y a ${Math.floor(seconds / 3600)} h`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/commune')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl flex-1 text-center mr-10 text-gray-900">Choix de l'OPJ</h1>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-blue-600">Étape 2/4</span>
            <span className="text-gray-600">Sélection OPJ</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              initial={{ width: '25%' }}
              animate={{ width: '50%' }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>

        {/* Location Info */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Zone d'intervention</span>
          </div>
          <p className="text-sm text-blue-100">
            {report.commune} - {report.quartier}
          </p>
        </Card>

        {/* OPJ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg mb-4 text-gray-900">
            OPJ disponibles ({availableOPJs.filter(o => o.isAvailable).length}/{availableOPJs.length})
          </h2>

          {availableOPJs.length === 0 ? (
            <Card className="p-8 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">
                Aucun OPJ trouvé dans cette zone. Veuillez réessayer ou contacter les autorités locales.
              </p>
            </Card>
          ) : (
            <RadioGroup value={selectedOPJ} onValueChange={setSelectedOPJ} className="space-y-3">
              {/* Available OPJs first */}
              {availableOPJs
                .filter(opj => opj.isAvailable)
                .map((opj) => (
                  <motion.div
                    key={opj.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        selectedOPJ === opj.id
                          ? 'ring-2 ring-blue-600 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedOPJ(opj.id)}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={opj.id} id={opj.id} className="mt-1" />
                        <Label htmlFor={opj.id} className="flex-1 cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{opj.name}</h3>
                              <p className="text-sm text-gray-600">{opj.quartier}</p>
                            </div>
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Disponible
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{getTimeAgo(opj.lastSeen)}</span>
                          </div>
                        </Label>
                      </div>
                    </Card>
                  </motion.div>
                ))}

              {/* Unavailable OPJs */}
              {availableOPJs
                .filter(opj => !opj.isAvailable)
                .map((opj) => (
                  <motion.div
                    key={opj.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="p-4 opacity-60 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={opj.id} id={opj.id} disabled className="mt-1" />
                        <Label htmlFor={opj.id} className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-700">{opj.name}</h3>
                              <p className="text-sm text-gray-500">{opj.quartier}</p>
                            </div>
                            <Badge variant="secondary" className="bg-gray-300">
                              Indisponible
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{getTimeAgo(opj.lastSeen)}</span>
                          </div>
                        </Label>
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </RadioGroup>
          )}

          {/* Info Card */}
          <Card className="p-4 mt-6 bg-amber-50 border-amber-200">
            <p className="text-sm text-amber-900">
              <strong>💡 Conseil :</strong> Choisissez un OPJ disponible (en ligne) pour une intervention plus rapide.
            </p>
          </Card>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full mt-6"
            disabled={!selectedOPJ}
          >
            Continuer
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
