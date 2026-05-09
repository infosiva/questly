'use client';
import { useRef, useState } from 'react';

interface CardContainerProps { children: React.ReactNode; className?: string; containerClassName?: string; }

export function CardContainer({ children, className = '', containerClassName = '' }: CardContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setRotateX(((e.clientY - centerY) / (rect.height / 2)) * -10);
    setRotateY(((e.clientX - centerX) / (rect.width / 2)) * 10);
  };

  const handleMouseLeave = () => { setRotateX(0); setRotateY(0); };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={['flex items-center justify-center', containerClassName].join(' ')}
      style={{ perspective: '1000px' }}
    >
      <div
        className={['transition-transform duration-200 ease-linear', className].join(' ')}
        style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={['[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]', className].join(' ')}>
      {children}
    </div>
  );
}

export function CardItem({
  children,
  className = '',
  translateZ = 0,
}: {
  children: React.ReactNode;
  className?: string;
  translateZ?: number;
}) {
  return (
    <div className={className} style={{ transform: `translateZ(${translateZ}px)` }}>
      {children}
    </div>
  );
}
