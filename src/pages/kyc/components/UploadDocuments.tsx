import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input } from "@nextui-org/react";
import { Upload, Image } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useKYC } from '../KYCContext'; 
import { supabase } from '../../../lib/supabase';

const UploadDocuments = () => {
  const { theme } = useTheme();
  const { 
    uploadedFiles, 
    setUploadedFiles, 
    selectedImageIndex, 
    setSelectedImageIndex,
    session
  } = useKYC();

  // List of default documents with paths to sample images
  const defaultDocuments = [
    { name: 'sample-id1.jpg', url: '/kycsampledocuments/sample-id1.jpg' },
    { name: 'sample-id2.jpg', url: '/kycsampledocuments/sample-id2.jpg' },
    { name: 'sample-id3.jpg', url: '/kycsampledocuments/sample-id3.jpg' },
    { name: 'sample-id4.jpg', url: '/kycsampledocuments/sample-id4.jpg' }
  ];

  // Load default documents when the component mounts
  useEffect(() => {
    const loadDefaultDocuments = async () => {
      const defaultFiles = await Promise.all(
        defaultDocuments.map(async (doc) => {
          const response = await fetch(doc.url);
          const blob = await response.blob();
          const fileReader = new FileReader();
          return new Promise((resolve) => {
            fileReader.onload = () => {
              resolve({ name: doc.name, dataUrl: fileReader.result });
            };
            fileReader.readAsDataURL(blob);
          });
        })
      );

      setUploadedFiles(defaultFiles as any[]);
    };

    loadDefaultDocuments();
  }, [setUploadedFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (filesArray: File[]) => {
    const filePromises = filesArray.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ name: file.name, dataUrl: reader.result });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises)
      .then((fileDataArray) => {
        setUploadedFiles((prevFiles) => [...prevFiles, ...fileDataArray as any[]]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please select files to upload.');
      return;
    }

    if (!session) {
      alert('No active session.');
      return;
    }

    try {
      // Upload files to Supabase storage
      const documentUrls = await Promise.all(
        uploadedFiles.map(async (fileData: any) => {
          const blob = dataURLToBlob(fileData.dataUrl);
          const fileExt = fileData.name.split('.').pop();
          const filePath = `${session.id}/${Date.now()}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from('kyc-documents')
            .upload(filePath, blob);

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('kyc-documents')
            .getPublicUrl(filePath);

          return publicUrl;
        })
      );

      // Update or create temp data record
      const { error: tempDataError } = await supabase
        .from('kyc_temp_data')
        .upsert({
          session_id: session.id,
          document_urls: documentUrls,
          form_data: {} // Will be populated by ViewEditCustomerData component
        });

      if (tempDataError) throw tempDataError;

      alert('Files uploaded successfully.');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('File upload failed.');
    }
  };
  const dataURLToBlob = (dataUrl: string) => {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  };

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-6 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>Upload ID Documents</h2>

      <Input 
        type="file" 
        multiple 
        onChange={handleFileChange}
        classNames={{
          input: `${theme === 'dark' ? 'text-white' : 'text-gray-900'}`,
          base: 'mb-4'
        }}
      />

      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <Button
            color="primary"
            onClick={handleUpload}
            startContent={<Upload className="w-4 h-4" />}
          >
            Upload Files
          </Button>

          <Card className={`${
            theme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-white border-gray-200'
          } border`}>
            <CardBody className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Document Preview</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {uploadedFiles.map((file: any, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedImageIndex === index
                        ? theme === 'dark'
                          ? 'bg-gray-700'
                          : 'bg-gray-100'
                        : ''
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>{file.name}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UploadDocuments;