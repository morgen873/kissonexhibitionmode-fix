import React, { useRef } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { Button } from './button';
import { Download } from 'lucide-react';

interface QRCodeDownloaderProps {
  url?: string;
  size?: number;
  filename?: string;
}

const QRCodeDownloader: React.FC<QRCodeDownloaderProps> = ({ 
  url = "https://kissonexhibitionmode2025.lovable.app/",
  size = 400,
  filename = "kiss-on-exhibition-qr-code"
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with some padding
    const padding = 40;
    canvas.width = size + padding * 2;
    canvas.height = size + padding * 2;

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert SVG to image
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Draw the QR code centered with padding
      ctx.drawImage(img, padding, padding, size, size);
      
      // Convert canvas to PNG and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
      
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Exhibition App QR Code</h2>
        <p className="text-muted-foreground">
          Download as PNG for printing
        </p>
      </div>
      
      <div ref={qrRef} className="p-6 bg-white rounded-lg shadow-lg">
        <QRCode 
          value={url}
          size={size}
          level="H"
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground font-mono break-all max-w-md">
          {url}
        </p>
        <Button 
          onClick={downloadQRCode}
          className="gap-2"
          size="lg"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </Button>
      </div>
    </div>
  );
};

export default QRCodeDownloader;