import { communes } from '../app/data/communes';
import { opjList } from '../app/data/opj';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5ba3ef6c`;

export async function initializeDatabase() {
  try {
    console.log('Initializing database with communes and OPJ data...');

    // Initialize communes
    const communesResponse = await fetch(`${API_BASE_URL}/communes/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ communes }),
    });

    if (!communesResponse.ok) {
      throw new Error(`Failed to initialize communes: ${await communesResponse.text()}`);
    }

    console.log('✓ Communes initialized successfully');

    // Initialize OPJ data
    const opjResponse = await fetch(`${API_BASE_URL}/opj/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ opjList }),
    });

    if (!opjResponse.ok) {
      throw new Error(`Failed to initialize OPJ data: ${await opjResponse.text()}`);
    }

    const opjResult = await opjResponse.json();
    console.log(`✓ ${opjResult.count} OPJ officers initialized successfully`);

    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error };
  }
}

// Check if data is already initialized
export async function checkDataInitialized() {
  try {
    const response = await fetch(`${API_BASE_URL}/communes`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}
