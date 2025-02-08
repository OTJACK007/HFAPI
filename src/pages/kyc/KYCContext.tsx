import React, { createContext, useContext, useState } from 'react';
import type { KYCSession } from '../../types/kyc';

interface KYCContextType {
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  session: KYCSession | null;
  setSession: (session: KYCSession | null) => void;
  extractedData: any;
  setExtractedData: (data: any) => void;
  logs: any[];
  setLogs: (logs: any[]) => void;
  status: string;
  setStatus: (status: string) => void;
  photoStatus: string;
  setPhotoStatus: (status: string) => void;
}

const KYCContext = createContext<KYCContextType | null>(null);

export const useKYC = () => {
  const context = useContext(KYCContext);
  if (!context) {
    throw new Error('useKYC must be used within a KYCProvider');
  }
  return context;
};

export const KYCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [session, setSession] = useState<KYCSession | null>(null);
  const [extractedData, setExtractedData] = useState({});
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('');
  const [photoStatus, setPhotoStatus] = useState('');

  return (
    <KYCContext.Provider value={{
      uploadedFiles,
      setUploadedFiles,
      selectedImageIndex,
      setSelectedImageIndex,
      session,
      setSession,
      extractedData,
      setExtractedData,
      logs,
      setLogs,
      status,
      setStatus,
      photoStatus,
      setPhotoStatus
    }}>
      {children}
    </KYCContext.Provider>
  );
};