import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send, MapPin, FileText, Camera, Mic, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useAccidentReport } from '../context/AccidentReportContext';
import { createAccidentReport, uploadMediaFile, notifyOPJ, fetchAllOPJ } from '../../services/api';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { report, updateReport, resetReport } = useAccidentReport();
  const [isSending, setIsSending] = useState(false);
  const [whatsappConfigured, setWhatsappConfigured] = useState<boolean | null>(null);

  const handleSubmit = async () => {
    if (!report.commune || !report.quartier || !report.opjId || !report.opjName) {
      toast.error('Informations manquantes');
      return;
    }

    setIsSending(true);
    let whatsappSent = false;

    try {
      // Step 1: Create accident report in database
      const { reportId, report: createdReport } = await createAccidentReport({
        commune: report.commune,
        quartier: report.quartier,
        description: report.description || '',
        opjId: report.opjId,
        opjName: report.opjName,
        location: report.location,
      });

      console.log('✓ Report created:', reportId);

      // Step 2: Upload photos and audio files
      const uploadPromises = [];

      if (report.photos && report.photos.length > 0) {
        for (const photo of report.photos) {
          uploadPromises.push(uploadMediaFile(photo, reportId, 'photo'));
        }
      }

      if (report.audioRecordings && report.audioRecordings.length > 0) {
        for (const audio of report.audioRecordings) {
          uploadPromises.push(uploadMediaFile(audio, reportId, 'audio'));
        }
      }

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
        console.log('✓ All media files uploaded successfully');
      }

      // Step 3: Get OPJ WhatsApp number
      const allOPJ = await fetchAllOPJ();
      const selectedOPJ = allOPJ.find((opj: any) => opj.id === report.opjId);

      if (!selectedOPJ) {
        throw new Error('OPJ non trouvé');
      }

      // Step 4: Try to send WhatsApp notification
      try {
        const whatsappMessage = `🚨 NOUVEAU SIGNALEMENT D'ACCIDENT

📍 Localisation:
Commune: ${report.commune}
Quartier: ${report.quartier}

📝 Description:
${report.description}

${report.location ? `🗺️ Coordonnées GPS:
Latitude: ${report.location.latitude.toFixed(6)}
Longitude: ${report.location.longitude.toFixed(6)}` : ''}

📸 Médias: ${report.photos?.length || 0} photo(s), ${report.audioRecordings?.length || 0} audio(s)

ID du signalement: ${reportId}`;

        const whatsappResult = await notifyOPJ({
          opjWhatsappNumber: selectedOPJ.whatsappNumber,
          reportId,
          message: whatsappMessage,
          commune: report.commune,
          quartier: report.quartier,
        });

        // Check if WhatsApp was actually sent (not just logged)
        if (whatsappResult.success && !whatsappResult.message.includes('pending')) {
          whatsappSent = true;
          console.log('✓ WhatsApp notification sent');
        } else {
          console.log('⚠ WhatsApp API not configured - notification logged only');
        }
      } catch (whatsappError) {
        console.log('⚠ WhatsApp notification failed:', whatsappError);
        // Continue anyway - report is saved
      }

      // Update report status
      updateReport({
        id: reportId,
        status: 'submitted',
        timestamp: new Date()
      });

      // Show appropriate success message
      if (whatsappSent) {
        toast.success('Signalement envoyé avec succès ! L\'OPJ a été notifié sur WhatsApp.');
      } else {
        toast.success('Signalement enregistré avec succès ! Notre équipe contactera l\'OPJ.');
      }

      navigate('/success');

      // Reset report after successful submission
      setTimeout(() => resetReport(), 3000);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Erreur lors de l\'envoi du signalement. Veuillez réessayer.');
    } finally {
      setIsSending(false);
    }
  };

  if (!report.opjId || !report.commune) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/media')}
            disabled={isSending}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl flex-1 text-center mr-10 text-gray-900">Confirmation</h1>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-blue-600">Étape 4/4</span>
            <span className="text-gray-600">Vérification finale</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              initial={{ width: '75%' }}
              animate={{ width: '100%' }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Alert Warning */}
          <Card className="p-4 bg-amber-50 border-amber-300">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Vérifiez vos informations</h3>
                <p className="text-sm text-amber-800">
                  Assurez-vous que toutes les informations sont correctes avant d'envoyer.
                </p>
              </div>
            </div>
          </Card>

          {/* OPJ Information */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">OPJ assigné</p>
                <p className="font-semibold text-gray-900">{report.opjName}</p>
              </div>
            </div>
            <Badge className="bg-blue-500 hover:bg-blue-600">OPJ Assigné</Badge>
          </Card>

          {/* Location */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-gray-900">Localisation</h3>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Commune :</strong> {report.commune}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Quartier :</strong> {report.quartier}
                </p>
                {report.location && (
                  <p className="text-xs text-gray-600 mt-2">
                    GPS: {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-gray-900">Description</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>
            </div>
          </Card>

          {/* Media Summary */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-gray-900">Médias joints</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Photos</span>
                </div>
                <Badge variant="secondary">{report.photos?.length || 0}</Badge>
              </div>
              
              {report.photos && report.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {report.photos.slice(0, 4).map((photo, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-full aspect-square object-cover rounded"
                    />
                  ))}
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Enregistrements audio</span>
                </div>
                <Badge variant="secondary">{report.audioRecordings?.length || 0}</Badge>
              </div>
            </div>
          </Card>

          {/* Info Box */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>✅ Prêt à envoyer :</strong> Votre signalement sera enregistré dans notre système. L'OPJ {report.opjName} sera informé et pourra intervenir rapidement.
            </p>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            size="lg"
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mr-2"
                >
                  <Send className="h-5 w-5" />
                </motion.div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Envoyer le signalement
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            En envoyant ce signalement, vous confirmez que les informations fournies sont exactes.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
