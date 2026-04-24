export interface AccidentReport {
  id?: string;
  commune: string;
  quartier: string;
  description: string;
  opjId: string;
  opjName: string;
  photos: File[];
  audioRecordings: File[];
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null;
  timestamp: Date;
  status: 'draft' | 'submitted' | 'received' | 'in_progress' | 'completed';
}

export interface OPJ {
  id: string;
  name: string;
  commune: string;
  quartier: string;
  whatsappNumber: string;
  isAvailable: boolean;
  lastSeen?: Date;
}

export interface Commune {
  id: string;
  name: string;
  quartiers: string[];
}
