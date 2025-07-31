import React from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';

interface AppQRCodeProps {
  size?: number;
  className?: string;
}

const AppQRCode: React.FC<AppQRCodeProps> = ({ size = 200, className = "" }) => {
  const appUrl = "https://kissonexhibitionmode2025.lovable.app/";
  
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <h3 className="text-lg font-semibold">Exhibition App QR Code</h3>
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <QRCode 
          value={appUrl} 
          size={size}
          level="M"
          includeMargin={true}
        />
      </div>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Scan to access the KISS ON Exhibition Mode 2025 app
      </p>
    </div>
  );
};

export default AppQRCode;