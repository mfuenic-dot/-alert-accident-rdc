import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useAccidentReport } from '../context/AccidentReportContext';
import { fetchCommunes } from '../../services/api';
import { checkDataInitialized, initializeDatabase } from '../../utils/initializeDatabase';
import { Commune } from '../types';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function CommunePage() {
  const navigate = useNavigate();
  const { report, updateReport } = useAccidentReport();
  const [selectedCommune, setSelectedCommune] = useState(report.commune || '');
  const [selectedQuartier, setSelectedQuartier] = useState(report.quartier || '');
  const [description, setDescription] = useState(report.description || '');
  const [quartiers, setQuartiers] = useState<string[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCommunes() {
      try {
        setIsLoading(true);
        const isInitialized = await checkDataInitialized();

        if (!isInitialized) {
          console.log('Initializing database...');
          const result = await initializeDatabase();
          if (!result.success) {
            toast.error('Erreur lors de l\'initialisation de la base de données');
            return;
          }
        }

        const data = await fetchCommunes();
        setCommunes(data);
      } catch (error) {
        console.error('Error loading communes:', error);
        toast.error('Erreur lors du chargement des communes');
      } finally {
        setIsLoading(false);
      }
    }

    loadCommunes();
  }, []);

  useEffect(() => {
    if (selectedCommune) {
      const commune = communes.find(c => c.name === selectedCommune);
      setQuartiers(commune?.quartiers || []);
    } else {
      setQuartiers([]);
      setSelectedQuartier('');
    }
  }, [selectedCommune, communes]);

  const handleContinue = () => {
    if (!selectedCommune) {
      toast.error('Veuillez sélectionner une commune');
      return;
    }
    if (!selectedQuartier) {
      toast.error('Veuillez sélectionner un quartier');
      return;
    }
    if (!description.trim()) {
      toast.error('Veuillez décrire l\'accident');
      return;
    }

    updateReport({
      commune: selectedCommune,
      quartier: selectedQuartier,
      description: description.trim()
    });

    toast.success('Informations enregistrées');
    navigate('/opj');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl flex-1 text-center mr-10 text-gray-900">Localisation de l'accident</h1>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-blue-600">Étape 1/4</span>
            <span className="text-gray-600">Commune & Description</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '25%' }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 mb-6">
            <div className="space-y-6">
              {/* Commune Selection */}
              <div>
                <Label htmlFor="commune" className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Commune *
                </Label>
                <Select value={selectedCommune} onValueChange={setSelectedCommune} disabled={isLoading}>
                  <SelectTrigger id="commune">
                    <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionnez votre commune"} />
                  </SelectTrigger>
                  <SelectContent>
                    {communes.map((commune) => (
                      <SelectItem key={commune.id} value={commune.name}>
                        {commune.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quartier Selection */}
              <div>
                <Label htmlFor="quartier" className="mb-2 block">
                  Quartier *
                </Label>
                <Select
                  value={selectedQuartier}
                  onValueChange={setSelectedQuartier}
                  disabled={!selectedCommune}
                >
                  <SelectTrigger id="quartier">
                    <SelectValue placeholder={selectedCommune ? "Sélectionnez votre quartier" : "Sélectionnez d'abord une commune"} />
                  </SelectTrigger>
                  <SelectContent>
                    {quartiers.map((quartier) => (
                      <SelectItem key={quartier} value={quartier}>
                        {quartier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="mb-2 block">
                  Description détaillée de l'accident *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez l'accident : type de véhicules, nombre de victimes, état de la route, conditions météo, etc."
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length} caractères
                </p>
              </div>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>💡 Conseil :</strong> Plus votre description est détaillée, mieux l'OPJ pourra préparer son intervention.
            </p>
          </Card>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full"
          >
            Continuer
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
