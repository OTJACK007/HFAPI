import React from 'react';
import { Card, CardBody, Progress } from "@nextui-org/react";
import { Shield, Clock } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import type { KYCSession } from '../../../types/kyc';

interface SessionStatusProps {
  session: KYCSession;
}

const SessionStatus = ({ session }: SessionStatusProps) => {
  const { theme } = useTheme();

  const getStatusColor = () => {
    switch (session.status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'danger';
      case 'processing':
        return 'primary';
      default:
        return 'warning';
    }
  };

  const getStatusMessage = () => {
    switch (session.status) {
      case 'completed':
        return 'Verification completed successfully';
      case 'failed':
        return 'Verification failed';
      case 'processing':
        return 'Processing verification';
      default:
        return 'Waiting for verification';
    }
  };

  // Calculate time remaining
  const timeRemaining = new Date(session.expiresAt).getTime() - Date.now();
  const minutesRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60)));

  return (
    <Card className={`${
      theme === 'dark' 
        ? 'bg-gray-800/50 border-gray-700/50' 
        : 'bg-white border-gray-200'
    } border`}>
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Session Status</h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {getStatusMessage()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {minutesRemaining} minutes remaining
            </span>
          </div>
        </div>

        <Progress
          value={(minutesRemaining / 60) * 100}
          color={getStatusColor()}
          className="h-2"
        />
      </CardBody>
    </Card>
  );
};

export default SessionStatus;