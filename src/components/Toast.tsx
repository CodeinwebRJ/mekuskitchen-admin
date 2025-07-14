import React from 'react';
import { Toaster } from 'react-hot-toast';

const Toast: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          padding: '12px 16px',
          color: '#fff',
          fontSize: '14px',
          borderRadius: '8px',
        },
        success: {
          style: {
            background: '#22c55e',
          },
        },
        error: {
          style: {
            background: '#ef4444',
          },
        },
      }}
    />
  );
};

export default Toast;
