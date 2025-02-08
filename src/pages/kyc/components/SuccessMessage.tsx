import React from 'react';
import { Card, CardBody, Button } from "@nextui-org/react";
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface SuccessMessageProps {
  title: string;
  message: string;
  onNext?: () => void;
  nextButtonText?: string;
}

const SuccessMessage = ({ title, message, onNext, nextButtonText = 'Continue' }: SuccessMessageProps) => {
  const { theme } = useTheme();

  return (
    <Card className={`${
      theme === 'dark' 
        ? 'bg-green-500/10 border-green-500/30' 
        : 'bg-green-50 border-green-200'
    } border`}>
      <CardBody className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-full ${
            theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
          } mb-4`}>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-green-400' : 'text-green-700'
          }`}>{title}</h3>
          <p className={`mb-6 ${
            theme === 'dark' ? 'text-green-300' : 'text-green-600'
          }`}>{message}</p>
          {onNext && (
            <Button
              className={`${
                theme === 'dark'
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              } transition-colors`}
              endContent={<ArrowRight className="w-4 h-4" />}
              onClick={onNext}
            >
              {nextButtonText}
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default SuccessMessage;