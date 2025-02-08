import React from 'react';
import { Card, CardBody, Progress } from "@nextui-org/react";
import { Shield, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface VerificationStatusProps {
  status: 'pending' | 'processing' | 'verified' | 'failed';
  message?: string;
  progress?: number;
}

const VerificationStatus = ({ status, message, progress }: VerificationStatusProps) => {
  const { theme } = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-6 h-6 text-yellow-500" />,
          title: 'Pending Verification',
          color: theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50',
          textColor: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
        };
      case 'processing':
        return {
          icon: <Shield className="w-6 h-6 text-blue-500" />,
          title: 'Processing',
          color: theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50',
          textColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
        };
      case 'verified':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
          title: 'Verification Complete',
          color: theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50',
          textColor: theme === 'dark' ? 'text-green-400' : 'text-green-700'
        };
      case 'failed':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
          title: 'Verification Failed',
          color: theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50',
          textColor: theme === 'dark' ? 'text-red-400' : 'text-red-700'
        };
      default:
        return {
          icon: <Shield className="w-6 h-6 text-gray-500" />,
          title: 'Unknown Status',
          color: theme === 'dark' ? 'bg-gray-500/10' : 'bg-gray-50',
          textColor: theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className={`${config.color} border-none`}>
      <CardBody className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-black/20' : 'bg-white/50'
          }`}>
            {config.icon}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${config.textColor}`}>
              {config.title}
            </h3>
            {message && (
              <p className={`${config.textColor} opacity-80`}>
                {message}
              </p>
            )}
          </div>
        </div>
        {typeof progress === 'number' && (
          <Progress 
            value={progress} 
            color={
              status === 'verified' ? 'success' :
              status === 'failed' ? 'danger' :
              status === 'processing' ? 'primary' :
              'warning'
            }
            className="h-2"
          />
        )}
      </CardBody>
    </Card>
  );
};

export default VerificationStatus;