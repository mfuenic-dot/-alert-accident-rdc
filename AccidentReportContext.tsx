import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AccidentReport } from '../types';

interface AccidentReportContextType {
  report: Partial<AccidentReport>;
  updateReport: (data: Partial<AccidentReport>) => void;
  resetReport: () => void;
}

const AccidentReportContext = createContext<AccidentReportContextType | undefined>(undefined);

export function AccidentReportProvider({ children }: { children: ReactNode }) {
  const [report, setReport] = useState<Partial<AccidentReport>>({
    photos: [],
    audioRecordings: [],
    location: null,
    status: 'draft'
  });

  const updateReport = (data: Partial<AccidentReport>) => {
    setReport(prev => ({ ...prev, ...data }));
  };

  const resetReport = () => {
    setReport({
      photos: [],
      audioRecordings: [],
      location: null,
      status: 'draft'
    });
  };

  return (
    <AccidentReportContext.Provider value={{ report, updateReport, resetReport }}>
      {children}
    </AccidentReportContext.Provider>
  );
}

export function useAccidentReport() {
  const context = useContext(AccidentReportContext);
  if (context === undefined) {
    throw new Error('useAccidentReport must be used within AccidentReportProvider');
  }
  return context;
}
