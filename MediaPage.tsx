import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Camera, Mic, MapPin, X, Upload, StopCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAccidentReport } from '../context/AccidentReportContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function MediaPage() {
  const navigate = useNavigate();
  const { report, updateReport } = useAccidentReport();
  const [photos, setPhotos] = useState<File[]>(report.photos || []);
  const [audioFiles, setAudioFiles] = useState<File[]>(report.audioRecordings || []);
  const [isRecording, setIsRecording] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!report.opjId) {
      toast.error('Veuillez d\'abord sélectionner un OPJ');
      navigate('/opj');
      return;
    }

    // Get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          updateReport({
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            }
          });
          toast.success('Localisation capturée avec succès');
        },
        (error) => {
          setLocationError(error.message);
          toast.error('Impossible de capturer la localisation');
        }
      );
    } else {
      setLocationError('Géolocalisation non supportée');
    }
  }, []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photos.length > 10) {
      toast.error('Maximum 10 photos autorisées');
      return;
    }
    setPhotos(prev => [...prev, ...files]);
    toast.success(`${files.length} photo(s) ajoutée(s)`);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    toast.info('Photo supprimée');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `audio-${Date.now()}.webm`, { type: 'audio/webm' });
        setAudioFiles(prev => [...prev, audioFile]);
        toast.success('Enregistrement audio sauvegardé');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Enregistrement en cours...');
    } catch (error) {
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeAudio = (index: number) => {
    setAudioFiles(prev => prev.filter((_, i) => i !== index));
    toast.info('Enregistrement audio supprimé');
  };

  const handleContinue = () => {
    if (photos.length === 0) {
      toast.error('Veuillez ajouter au moins une photo');
      return;
    }

    updateReport({
      photos,
      audioRecordings: audioFiles
    });

    toast.success('Médias enregistrés');
    navigate('/confirmation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/opj')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl flex-1 text-center mr-10 text-gray-900">Documentation</h1>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-blue-600">Étape 3/4</span>
            <span className="text-gray-600">Photos & Audio</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: '75%' }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Location Card */}
          <Card className={`p-4 ${location ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-3">
              <MapPin className={`h-5 w-5 mt-0.5 ${location ? 'text-green-600' : 'text-amber-600'}`} />
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${location ? 'text-green-900' : 'text-amber-900'}`}>
                  {location ? 'Localisation capturée' : 'Capture de localisation...'}
                </h3>
                {location ? (
                  <p className="text-sm text-green-700">
                    Lat: {location.coords.latitude.toFixed(6)}, Long: {location.coords.longitude.toFixed(6)}
                  </p>
                ) : (
                  <p className="text-sm text-amber-700">
                    {locationError || 'Veuillez autoriser l\'accès à votre position'}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Photos Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-gray-900">Photos de l'accident *</h2>
              <Badge variant="secondary">{photos.length}/10</Badge>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              accept="image/*"
              multiple
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full mb-4"
              disabled={photos.length >= 10}
            >
              <Camera className="mr-2 h-4 w-4" />
              {photos.length === 0 ? 'Ajouter des photos' : 'Ajouter plus de photos'}
            </Button>

            {/* Photo Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Audio Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-gray-900">Enregistrement audio</h2>
              <Badge variant="secondary">{audioFiles.length}</Badge>
            </div>

            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? 'destructive' : 'outline'}
              className="w-full mb-4"
            >
              {isRecording ? (
                <>
                  <StopCircle className="mr-2 h-4 w-4" />
                  Arrêter l'enregistrement
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Enregistrer un message audio
                </>
              )}
            </Button>

            {/* Audio List */}
            {audioFiles.length > 0 && (
              <div className="space-y-2">
                {audioFiles.map((audio, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      <Mic className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Enregistrement {index + 1}</span>
                      <audio src={URL.createObjectURL(audio)} controls className="h-8 text-xs" />
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => removeAudio(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Info Card */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>💡 Conseil :</strong> Prenez des photos claires des véhicules, des dégâts, et de la position des véhicules sur la route.
            </p>
          </Card>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full"
            disabled={photos.length === 0}
          >
            Continuer
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
