import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import { Maximize, Minimize, Camera, RotateCw, X } from "lucide-react";
import Webcam from "react-webcam";
import { useCameraContext } from '../contexts/CameraContext';

interface FullscreenCameraProps {
  onCapture: (imageSrc: string) => void;
  onClose?: () => void;
  webcamRef: React.RefObject<Webcam>;
  facingMode: "user" | "environment";
  onFlipCamera: () => void;
  showFrame?: boolean;
  frameText?: string;
  isCaptureReady: boolean;
}

const FullscreenCamera: React.FC<FullscreenCameraProps> = ({
  onCapture,
  onClose,
  webcamRef,
  facingMode,
  onFlipCamera,
  showFrame = true,
  frameText = "Alignez le sujet dans le cadre et assurez-vous qu'il est bien visible",
  isCaptureReady
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { setFullscreenActive } = useCameraContext();
  
  // Mise à jour du contexte global lorsque l'état du plein écran change
  useEffect(() => {
    setFullscreenActive(isFullscreen);
    
    // Nettoyage: remettre à false lorsque le composant est démonté
    return () => {
      setFullscreenActive(false);
    };
  }, [isFullscreen, setFullscreenActive]);
  
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
        if (isFullscreen) {
          setIsFullscreen(false);
        }
      }
    }
  };
  
  // Style pour le mode plein écran
  const fullscreenStyle: React.CSSProperties = isFullscreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  } : {};
  
  // Style pour le conteneur de la webcam (normal ou plein écran)
  const webcamContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: isFullscreen ? '100%' : '100%',
    height: isFullscreen ? '100%' : 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  
  // Style spécifique pour la webcam elle-même
  const webcamStyle: React.CSSProperties = {
    width: isFullscreen ? '100%' : '100%',
    height: isFullscreen ? '100%' : 'auto',
    objectFit: isFullscreen ? 'cover' : 'contain',
  };
  
  return (
    <div style={fullscreenStyle} className={isFullscreen ? "" : "relative rounded-xl overflow-hidden"}>
      <div style={webcamContainerStyle}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          style={webcamStyle}
          videoConstraints={{
            facingMode: facingMode,
            width: isFullscreen ? { ideal: 1920 } : { ideal: 1280 },
            height: isFullscreen ? { ideal: 1080 } : { ideal: 720 },
          }}
          onUserMedia={() => isCaptureReady !== undefined && webcamRef.current !== null}
        />
        
        {/* Boutons de contrôle */}
        <div className={`absolute ${isFullscreen ? 'top-4 right-4' : 'top-2 left-2'}`}>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            className="bg-background/50 backdrop-blur-sm"
            onClick={handleToggleFullscreen}
          >
            {isFullscreen ? 
              <Minimize className="w-4 h-4 text-white" /> : 
              <Maximize className="w-4 h-4 text-white" />
            }
          </Button>
        </div>
        
        {/* Bouton de flip caméra (toujours visible) */}
        <div className={`absolute ${isFullscreen ? 'top-4 left-4' : 'top-2 right-2'}`}>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            className="bg-background/50 backdrop-blur-sm"
            onClick={onFlipCamera}
          >
            <RotateCw className="w-4 h-4 text-white" />
          </Button>
        </div>
        
        {/* Cadre (si demandé) */}
        {showFrame && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
            <div className={`${isFullscreen ? 'w-4/5 h-3/5' : 'w-[90%] h-[60%]'} border-2 border-primary/70 rounded-md`}></div>
          </div>
        )}
        
        {/* Instructions */}
        <div className={`absolute ${isFullscreen ? 'bottom-28' : 'bottom-4'} left-0 right-0 mx-auto ${isFullscreen ? 'w-4/5' : 'w-[90%]'} bg-background/80 backdrop-blur-sm rounded-lg p-3`}>
          <p className="text-sm text-white text-center">
            {frameText}
          </p>
        </div>
        
        {/* Bouton de capture en plein écran */}
        {isFullscreen && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <Button
              isIconOnly
              size="lg"
              color="primary"
              className="w-16 h-16 rounded-full"
              onClick={handleCapture}
              disabled={!isCaptureReady}
            >
              <Camera className="w-8 h-8" />
            </Button>
          </div>
        )}
        
        {/* Bouton de fermeture en plein écran */}
        {isFullscreen && onClose && (
          <div className="absolute top-4 right-16">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="bg-background/50 backdrop-blur-sm"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-white" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullscreenCamera;