import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Button, Progress } from "@nextui-org/react";
import { Radio, Shield, Camera, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useKYC } from '../KYCContext';
import { supabase } from '../../../lib/supabase';

interface LivenessCheckProps {
  onComplete: () => void;
}

const LivenessCheck = ({ onComplete }: LivenessCheckProps) => {
  const { theme } = useTheme();
  const { session } = useKYC();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'complete'>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setStatus('recording');
      startRecording();
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Failed to access camera. Please ensure camera permissions are granted.');
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setProgress(0);
    
    // Simulate progress over 5 seconds
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeRecording();
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const completeRecording = async () => {
    if (!session) return;

    setIsRecording(false);
    setStatus('processing');

    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      // Get video frame as base64
      const canvas = document.createElement('canvas');
      if (videoRef.current) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoRef.current, 0, 0);
      }
      const base64Image = canvas.toDataURL('image/jpeg');

      // Upload liveness check image
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('kyc-liveness')
        .upload(`${session.id}/liveness.jpg`, base64Image);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('kyc-liveness')
        .getPublicUrl(uploadData.path);

      // Update temp data with liveness check URL
      const { error: updateError } = await supabase
        .from('kyc_temp_data')
        .update({
          form_data: {
             ```
            ...formData,
            livenessUrl: publicUrl
          }
        })
        .eq('session_id', session.id);

      if (updateError) throw updateError;

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus('complete');
      onComplete();
    } catch (error) {
      console.error('Error completing liveness check:', error);
      alert('Failed to complete liveness check. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <Card className={`${
      theme === 'dark' 
        ? 'bg-gray-800/50 border-gray-700/50' 
        : 'bg-white border-gray-200'
    } border`}>
      <CardBody className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Radio className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Liveness Check</h3>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Verify your identity with a quick video
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {status === 'idle' && (
            <div className="text-center">
              <div className="mb-6">
                <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  We need to verify that you're a real person
                </p>
              </div>
              <Button
                color="primary"
                size="lg"
                startContent={<Camera className="w-5 h-5" />}
                onClick={startCamera}
              >
                Start Verification
              </Button>
            </div>
          )}

          {(status === 'recording' || status === 'processing') && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {status === 'processing' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-white">Processing...</p>
                    </div>
                  </div>
                )}
              </div>

              {status === 'recording' && (
                <div className="space-y-2">
                  <Progress
                    value={progress}
                    color="success"
                    className="h-2"
                  />
                  <p className={`text-sm text-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Please look at the camera and follow the instructions
                  </p>
                </div>
              )}
            </div>
          )}

          {status === 'complete' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h4 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Verification Complete</h4>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Your identity has been successfully verified
              </p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default LivenessCheck;