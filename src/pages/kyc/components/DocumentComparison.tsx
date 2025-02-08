import React, { useState } from 'react';
import { Card, CardBody, Button, Switch } from "@nextui-org/react";
import { Shield, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useKYC } from '../KYCContext';
import { supabase } from '../../../lib/supabase';

const DocumentComparison = () => {
  const { theme } = useTheme();
  const { 
    uploadedFiles,
    selectedImageIndex,
    session,
    status,
    setStatus,
    photoStatus,
    setPhotoStatus
  } = useKYC();

  const [showProcessedIdDocument, setShowProcessedIdDocument] = useState(false);
  const [showProcessedCustomerPhoto, setShowProcessedCustomerPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyzeDocuments = async () => {
    if (!session?.id || !uploadedFiles[selectedImageIndex]) {
      alert('Please select a document and ensure session is active');
      return;
    }

    try {
      setIsLoading(true);

      // Get temp data
      const { data: tempData } = await supabase
        .from('kyc_temp_data')
        .select('form_data, document_urls')
        .eq('session_id', session.id)
        .single();

      if (!tempData) {
        throw new Error('No temporary data found');
      }

      // Call API endpoint for analysis
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: session.id,
          form_data: tempData.form_data,
          document_urls: tempData.document_urls
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      
      // Update status based on result
      setStatus(result.status);
      setPhotoStatus(result.photoStatus);

      // Update session status
      await supabase
        .from('kyc_sessions')
        .update({ 
          status: 'processing',
          verification_id: result.verificationId
        })
        .eq('id', session.id);

    } catch (error) {
      console.error('Error analyzing documents:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={`${
        theme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white border-gray-200'
      } border`}>
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Document Analysis</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Verify document authenticity and extract information
                </p>
              </div>
            </div>
            <Button
              color="primary"
              onClick={handleAnalyzeDocuments}
              isDisabled={!uploadedFiles.length || isLoading}
              isLoading={isLoading}
            >
              Analyze Documents
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Document Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Document Preview</h4>
                <Switch
                  checked={showProcessedIdDocument}
                  onChange={(e) => setShowProcessedIdDocument(e.target.checked)}
                  size="sm"
                />
              </div>
              {uploadedFiles[selectedImageIndex] && (
                <img
                  src={uploadedFiles[selectedImageIndex].dataUrl}
                  alt="Selected Document"
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Status Indicators */}
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  {status === 'OK' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : status === 'Not OK' ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <p className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Document Status</p>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {status || 'Pending Analysis'}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  {photoStatus === 'OK' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : photoStatus === 'Not OK' ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <p className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Photo Match</p>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {photoStatus || 'Pending Analysis'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DocumentComparison;