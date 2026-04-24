import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { AccidentReport, OPJ, Commune } from '../app/types';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5ba3ef6c`;

// ==================== COMMUNES API ====================

export async function fetchCommunes(): Promise<Commune[]> {
  const response = await fetch(`${API_BASE_URL}/communes`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch communes: ${response.statusText}`);
  }

  return response.json();
}

// ==================== OPJ API ====================

export async function fetchAllOPJ(): Promise<OPJ[]> {
  const response = await fetch(`${API_BASE_URL}/opj`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch OPJ list: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchOPJByLocation(commune: string, quartier: string): Promise<OPJ[]> {
  const response = await fetch(`${API_BASE_URL}/opj/${encodeURIComponent(commune)}/${encodeURIComponent(quartier)}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch OPJ by location: ${response.statusText}`);
  }

  return response.json();
}

export async function updateOPJAvailability(opjId: string, isAvailable: boolean): Promise<OPJ> {
  const response = await fetch(`${API_BASE_URL}/opj/${opjId}/availability`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ isAvailable }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update OPJ availability: ${response.statusText}`);
  }

  return response.json();
}

// ==================== ACCIDENT REPORTS API ====================

interface CreateReportPayload {
  commune: string;
  quartier: string;
  description: string;
  opjId: string;
  opjName: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null;
}

export async function createAccidentReport(payload: CreateReportPayload): Promise<{ reportId: string; report: any }> {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to create accident report: ${errorText}`);
    throw new Error(`Failed to create accident report: ${response.statusText}`);
  }

  const report = await response.json();
  return { reportId: report.id, report };
}

export async function fetchAllReports(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch reports: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchReportById(reportId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch report: ${response.statusText}`);
  }

  return response.json();
}

export async function updateReportStatus(reportId: string, status: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update report status: ${response.statusText}`);
  }

  return response.json();
}

// ==================== MEDIA UPLOAD API ====================

export async function uploadMediaFile(file: File, reportId: string, fileType: 'photo' | 'audio'): Promise<{ signedUrl: string; path: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('reportId', reportId);
  formData.append('fileType', fileType);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Media upload error: ${errorText}`);
    throw new Error(`Failed to upload media: ${response.statusText}`);
  }

  const result = await response.json();
  return { signedUrl: result.signedUrl, path: result.path };
}

export async function getMediaSignedUrl(reportId: string, fileName: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/media/${reportId}/${fileName}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get media URL: ${response.statusText}`);
  }

  const result = await response.json();
  return result.signedUrl;
}

// ==================== WHATSAPP NOTIFICATION API ====================

interface NotifyOPJPayload {
  opjWhatsappNumber: string;
  reportId: string;
  message: string;
  commune: string;
  quartier: string;
}

export async function notifyOPJ(payload: NotifyOPJPayload): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/notify-opj`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`WhatsApp notification error: ${errorText}`);
    throw new Error(`Failed to send WhatsApp notification: ${response.statusText}`);
  }

  return response.json();
}
