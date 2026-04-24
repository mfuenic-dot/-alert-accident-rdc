import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotAssistantProps {
  currentStep: string;
  onStepGuidance?: (guidance: string) => void;
}

export function ChatbotAssistant({ currentStep, onStepGuidance }: ChatbotAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stepGuidance: Record<string, string> = {
    home: "Bienvenue sur Alert Accident RDC ! Je suis votre assistant IA. Je vais vous guider pour signaler un accident rapidement et efficacement. Cliquez sur 'Signaler un accident' pour commencer.",
    commune: "Sélectionnez votre commune et votre quartier dans les listes déroulantes. Ensuite, décrivez l'accident en détail : type de véhicules impliqués, nombre de victimes, état de la route, etc.",
    opj: "Je vais maintenant vous montrer les Officiers de Police Judiciaire disponibles dans votre zone. Choisissez un OPJ qui est en ligne (disponible) pour traiter votre dossier rapidement.",
    media: "Documentez l'accident en prenant des photos de la scène. Vous pouvez aussi enregistrer un message audio pour donner plus de détails. La géolocalisation sera automatiquement capturée.",
    confirmation: "Vérifiez tous les détails avant d'envoyer. Une fois confirmé, l'OPJ sélectionné recevra immédiatement une notification via WhatsApp avec toutes les informations.",
    success: "Votre signalement a été envoyé avec succès ! L'OPJ a été notifié et interviendra bientôt. Gardez votre téléphone à portée de main au cas où l'OPJ vous contacte."
  };

  useEffect(() => {
    if (stepGuidance[currentStep]) {
      const botMessage: Message = {
        id: Date.now().toString(),
        text: stepGuidance[currentStep],
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      if (onStepGuidance) {
        onStepGuidance(stepGuidance[currentStep]);
      }
    }
  }, [currentStep]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue, currentStep);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  const generateBotResponse = (userInput: string, step: string): string => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('comment') || lowerInput.includes('aide') || lowerInput.includes('help')) {
      return stepGuidance[step] || "Je suis là pour vous aider. Posez-moi vos questions !";
    }

    if (lowerInput.includes('urgence') || lowerInput.includes('grave')) {
      return "Pour les urgences graves avec blessés, n'oubliez pas de contacter aussi les services d'urgence médicale après avoir envoyé votre signalement.";
    }

    if (lowerInput.includes('photo') || lowerInput.includes('image')) {
      return "Prenez des photos claires de la scène : véhicules impliqués, dégâts, position des véhicules, plaques d'immatriculation si possible.";
    }

    if (lowerInput.includes('opj') || lowerInput.includes('police')) {
      return "Les OPJ en ligne (disponibles) répondent généralement en quelques minutes. Choisissez un OPJ disponible pour une intervention rapide.";
    }

    if (lowerInput.includes('whatsapp')) {
      return "L'OPJ recevra automatiquement votre signalement via WhatsApp avec toutes les photos, audios et votre localisation GPS.";
    }

    return "Je comprends votre question. Suivez les étapes affichées et je vous guiderai. Besoin d'aide spécifique ?";
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full w-16 h-16 shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-lg shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Assistant IA</h3>
                <p className="text-xs text-blue-100">Toujours disponible pour vous aider</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <Bot className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Comment puis-je vous aider aujourd'hui ?</p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Posez votre question..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
