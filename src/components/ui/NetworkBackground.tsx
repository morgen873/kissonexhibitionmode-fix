
import React, { useEffect, useRef } from 'react';

interface NetworkBackgroundProps {
  className?: string;
}

const NetworkBackground: React.FC<NetworkBackgroundProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Network nodes inspired by the ingredient map
    const nodes = [
      { x: 0.2, y: 0.3, size: 8, color: '#10b981', pulsate: true },
      { x: 0.5, y: 0.5, size: 12, color: '#059669', pulsate: true },
      { x: 0.8, y: 0.2, size: 6, color: '#34d399', pulsate: false },
      { x: 0.3, y: 0.7, size: 10, color: '#6ee7b7', pulsate: true },
      { x: 0.7, y: 0.8, size: 7, color: '#10b981', pulsate: false },
      { x: 0.1, y: 0.6, size: 9, color: '#059669', pulsate: true },
      { x: 0.9, y: 0.4, size: 5, color: '#34d399', pulsate: false },
      { x: 0.6, y: 0.1, size: 8, color: '#6ee7b7', pulsate: true },
    ];

    // Connections between nodes
    const connections = [
      [0, 1], [1, 2], [1, 3], [3, 4], [0, 5], [2, 6], [1, 7], [4, 3]
    ];

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.lineWidth = 1;
      connections.forEach(([i, j]) => {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        
        ctx.beginPath();
        ctx.moveTo(nodeA.x * canvas.width, nodeA.y * canvas.height);
        ctx.lineTo(nodeB.x * canvas.width, nodeB.y * canvas.height);
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((node, index) => {
        const x = node.x * canvas.width;
        const y = node.y * canvas.height;
        const pulseMultiplier = node.pulsate ? 1 + Math.sin(time + index * 0.5) * 0.3 : 1;
        const size = node.size * pulseMultiplier;

        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, node.color + '40');
        gradient.addColorStop(1, node.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner node
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ opacity: 0.3 }}
    />
  );
};

export default NetworkBackground;
