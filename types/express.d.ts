// Extend Express Request interface
declare namespace Express {
  export interface Request {
    apiKey?: {
      id: string;
      enterprise_id: string;
      key_type: 'test' | 'live';
    };
    enterpriseId?: string;
  }
}

// Export empty object to make this a module
export {};