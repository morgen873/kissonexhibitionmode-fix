import React from 'react';
import QRCodeDownloader from '@/components/ui/QRCodeDownloader';

const QRCodePage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <QRCodeDownloader />
    </div>
  );
};

export default QRCodePage;