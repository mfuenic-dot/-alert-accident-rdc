import { OPJ } from '../types';

export const opjList: OPJ[] = [
  // Gombe
  { id: '1', name: 'Cdt. MBALA Jean-Pierre', commune: 'Gombe', quartier: 'Socimat', whatsappNumber: '+243812345001', isAvailable: true, lastSeen: new Date() },
  { id: '2', name: 'Insp. KABONGO Marie', commune: 'Gombe', quartier: 'Huileries', whatsappNumber: '+243812345002', isAvailable: false, lastSeen: new Date(Date.now() - 3600000) },
  { id: '3', name: 'Lt. TSHIMANGA Paul', commune: 'Gombe', quartier: 'Kintambo', whatsappNumber: '+243812345003', isAvailable: true, lastSeen: new Date() },
  
  // Kalamu
  { id: '4', name: 'Cdt. MUKENDI Joseph', commune: 'Kalamu', quartier: 'Matonge', whatsappNumber: '+243812345004', isAvailable: true, lastSeen: new Date() },
  { id: '5', name: 'Insp. NDALA Grace', commune: 'Kalamu', quartier: 'Victoire', whatsappNumber: '+243812345005', isAvailable: true, lastSeen: new Date() },
  { id: '6', name: 'Lt. ILUNGA André', commune: 'Kalamu', quartier: 'Salongo', whatsappNumber: '+243812345006', isAvailable: false, lastSeen: new Date(Date.now() - 7200000) },
  
  // Kasa-Vubu
  { id: '7', name: 'Cdt. KASONGO Marcel', commune: 'Kasa-Vubu', quartier: 'Makelele', whatsappNumber: '+243812345007', isAvailable: true, lastSeen: new Date() },
  { id: '8', name: 'Insp. MULAMBA Christine', commune: 'Kasa-Vubu', quartier: 'Révolution', whatsappNumber: '+243812345008', isAvailable: false, lastSeen: new Date(Date.now() - 1800000) },
  
  // Lemba
  { id: '9', name: 'Lt. KALALA François', commune: 'Lemba', quartier: 'Binza Pigeon', whatsappNumber: '+243812345009', isAvailable: true, lastSeen: new Date() },
  { id: '10', name: 'Cdt. MPIANA David', commune: 'Lemba', quartier: 'Binza UPN', whatsappNumber: '+243812345010', isAvailable: true, lastSeen: new Date() },
  
  // Limete
  { id: '11', name: 'Insp. LONGO Pauline', commune: 'Limete', quartier: 'Kingabwa', whatsappNumber: '+243812345011', isAvailable: false, lastSeen: new Date(Date.now() - 5400000) },
  { id: '12', name: 'Lt. NZUZI Thomas', commune: 'Limete', quartier: 'Ndanu', whatsappNumber: '+243812345012', isAvailable: true, lastSeen: new Date() },
  
  // Lingwala
  { id: '13', name: 'Cdt. MBUYI Clémentine', commune: 'Lingwala', quartier: 'Lumumba', whatsappNumber: '+243812345013', isAvailable: true, lastSeen: new Date() },
  { id: '14', name: 'Insp. KABILA Michel', commune: 'Lingwala', quartier: 'Victoire', whatsappNumber: '+243812345014', isAvailable: false, lastSeen: new Date(Date.now() - 2700000) },
  
  // Matete
  { id: '15', name: 'Lt. NGOMA Patrick', commune: 'Matete', quartier: 'Mokali', whatsappNumber: '+243812345015', isAvailable: true, lastSeen: new Date() },
  { id: '16', name: 'Cdt. TSHALA Agnès', commune: 'Matete', quartier: 'Mpasa', whatsappNumber: '+243812345016', isAvailable: true, lastSeen: new Date() },
  
  // Ngaliema
  { id: '17', name: 'Insp. MAKENGO Henriette', commune: 'Ngaliema', quartier: 'Mont-Ngafula', whatsappNumber: '+243812345017', isAvailable: false, lastSeen: new Date(Date.now() - 4500000) },
  { id: '18', name: 'Lt. NSIMBA Albert', commune: 'Ngaliema', quartier: 'Kinshasa', whatsappNumber: '+243812345018', isAvailable: true, lastSeen: new Date() },
  
  // Kintambo
  { id: '19', name: 'Cdt. KANDA Roger', commune: 'Kintambo', quartier: 'Kintambo Magasin', whatsappNumber: '+243812345019', isAvailable: true, lastSeen: new Date() },
  { id: '20', name: 'Insp. MASIKA Joséphine', commune: 'Kintambo', quartier: 'Kintambo Gare', whatsappNumber: '+243812345020', isAvailable: true, lastSeen: new Date() },
  
  // Bandalungwa
  { id: '21', name: 'Lt. MUTOMBO Daniel', commune: 'Bandalungwa', quartier: 'Pêcheurs', whatsappNumber: '+243812345021', isAvailable: false, lastSeen: new Date(Date.now() - 6300000) },
  { id: '22', name: 'Cdt. NKULU Bernadette', commune: 'Bandalungwa', quartier: 'Victoire', whatsappNumber: '+243812345022', isAvailable: true, lastSeen: new Date() },
  
  // Bumbu
  { id: '23', name: 'Insp. LUBAKI Simon', commune: 'Bumbu', quartier: 'Selembao', whatsappNumber: '+243812345023', isAvailable: true, lastSeen: new Date() },
  { id: '24', name: 'Lt. BANZA Thérèse', commune: 'Bumbu', quartier: 'Bumbu', whatsappNumber: '+243812345024', isAvailable: false, lastSeen: new Date(Date.now() - 1200000) },
  
  // Makala
  { id: '25', name: 'Cdt. MWAMBA Eugène', commune: 'Makala', quartier: 'Makala Prison', whatsappNumber: '+243812345025', isAvailable: true, lastSeen: new Date() },
  { id: '26', name: 'Insp. KAMANDA Rose', commune: 'Makala', quartier: 'Camp Luka', whatsappNumber: '+243812345026', isAvailable: true, lastSeen: new Date() },
  
  // Ngiri-Ngiri
  { id: '27', name: 'Lt. BAKALA Gilbert', commune: 'Ngiri-Ngiri', quartier: 'Camp Kokolo', whatsappNumber: '+243812345027', isAvailable: true, lastSeen: new Date() },
  { id: '28', name: 'Cdt. MONGA Sylvie', commune: 'Ngiri-Ngiri', quartier: 'Révolution', whatsappNumber: '+243812345028', isAvailable: false, lastSeen: new Date(Date.now() - 3900000) },
  
  // Selembao
  { id: '29', name: 'Insp. KABASELE Robert', commune: 'Selembao', quartier: 'Selembao I', whatsappNumber: '+243812345029', isAvailable: true, lastSeen: new Date() },
  { id: '30', name: 'Lt. MUNDELE Jacqueline', commune: 'Selembao', quartier: 'Selembao II', whatsappNumber: '+243812345030', isAvailable: true, lastSeen: new Date() },
  
  // Kinsenso
  { id: '31', name: 'Cdt. KALOMBO Émile', commune: 'Kinsenso', quartier: 'Kinsenso', whatsappNumber: '+243812345031', isAvailable: false, lastSeen: new Date(Date.now() - 8100000) },
  
  // Barumbu
  { id: '32', name: 'Insp. NSIMBA Charlotte', commune: 'Barumbu', quartier: 'Saint-Jean', whatsappNumber: '+243812345032', isAvailable: true, lastSeen: new Date() },
  { id: '33', name: 'Lt. KENGE Oscar', commune: 'Barumbu', quartier: 'Mombele', whatsappNumber: '+243812345033', isAvailable: true, lastSeen: new Date() },
  
  // Kimbanseke
  { id: '34', name: 'Cdt. KISANGANI Julien', commune: 'Kimbanseke', quartier: 'Kimbanseke I', whatsappNumber: '+243812345034', isAvailable: true, lastSeen: new Date() },
  { id: '35', name: 'Insp. LUKA Monique', commune: 'Kimbanseke', quartier: 'Kimbanseke II', whatsappNumber: '+243812345035', isAvailable: false, lastSeen: new Date(Date.now() - 2100000) },
  
  // Masina
  { id: '36', name: 'Lt. MAZEMBE Norbert', commune: 'Masina', quartier: 'Masina I', whatsappNumber: '+243812345036', isAvailable: true, lastSeen: new Date() },
  { id: '37', name: 'Cdt. NTUMBA Françoise', commune: 'Masina', quartier: 'Masina II', whatsappNumber: '+243812345037', isAvailable: true, lastSeen: new Date() },
  
  // Ndjili
  { id: '38', name: 'Insp. MUMBERE Philippe', commune: 'Ndjili', quartier: 'Ndjili Aéroport', whatsappNumber: '+243812345038', isAvailable: true, lastSeen: new Date() },
  { id: '39', name: 'Lt. KIKUNI Esther', commune: 'Ndjili', quartier: 'Ndjili Brasserie', whatsappNumber: '+243812345039', isAvailable: false, lastSeen: new Date(Date.now() - 4800000) },
  
  // Mont-Ngafula
  { id: '40', name: 'Cdt. MALU Didier', commune: 'Mont-Ngafula', quartier: 'Mont-Ngafula I', whatsappNumber: '+243812345040', isAvailable: true, lastSeen: new Date() },
  { id: '41', name: 'Insp. YUMA Germaine', commune: 'Mont-Ngafula', quartier: 'Mont-Ngafula II', whatsappNumber: '+243812345041', isAvailable: true, lastSeen: new Date() },
  
  // Ngaba
  { id: '42', name: 'Lt. BOFEKO Victor', commune: 'Ngaba', quartier: 'Ngaba', whatsappNumber: '+243812345042', isAvailable: false, lastSeen: new Date(Date.now() - 5700000) },
];
