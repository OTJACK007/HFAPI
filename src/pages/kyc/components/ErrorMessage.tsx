import React from 'react';
import { Card, CardBody, Button } from "@nextui-org/react";
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ title, message, onRetry }: ErrorMessageProps) => {
  const { theme } = useTheme();

  return (
    <Card className={`${
      theme === 'dark' 
        ? 'bg-red-500/10 border-red-500/30' 
        : 'bg-red-50 border-red-200'
    } border`}>
      <CardBody className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'
          }`}>
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-red-400' : 'text-red-700'
            }`}>{title}</h3>
            <p className={`${
              theme === 'dark' ? 'text-red-300' : 'text-red-600'
            }`}>{message}</p>
          </div>
        </div>
        {onRetry && (
          <Button
            className={`${
              theme === 'dark'
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            } transition-colors`}
            startContent={<RefreshCw className="w-4 h-4" />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

export default ErrorMessage;