import React, { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let points = [];
    const gap = 40;
    const mouse = { x: null, y: null, radius: 180 };

    let cols, rows;

    const initPoints = () => {
      points = [];
      cols = Math.ceil(canvas.width / gap) + 2;
      rows = Math.ceil(canvas.height / gap) + 2;

      for (let i = 0; i < rows; i++) {
        let rowPoints = [];
        for (let j = 0; j < cols; j++) {
          let x = j * gap - gap;
          let y = i * gap - gap;
          
          let waveX = Math.sin(y * 0.02) * 20;
          let waveY = Math.cos(x * 0.02) * 20 + Math.sin((x + y) * 0.01) * 15;
          
          let origX = x + waveX;
          let origY = y + waveY;
          
          rowPoints.push({ x: origX, y: origY, origX, origY });
        }
        points.push(rowPoints);
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.22)';
      ctx.lineWidth = 1.4;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          let p = points[i][j];
          
          if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
              const force = (mouse.radius - dist) / mouse.radius;
              const angle = Math.atan2(dy, dx);
              p.x -= Math.cos(angle) * force * 20;
              p.y -= Math.sin(angle) * force * 20;
            } else {
              p.x += (p.origX - p.x) * 0.06;
              p.y += (p.origY - p.y) * 0.06;
            }
          } else {
            p.x += (p.origX - p.x) * 0.06;
            p.y += (p.origY - p.y) * 0.06;
          }
        }
      }

      for (let i = 0; i < rows; i++) {
        ctx.beginPath();
        for (let j = 0; j < cols; j++) {
          let p = points[i][j];
          if (j === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            let prevP = points[i][j - 1];
            let cx = (prevP.x + p.x) / 2;
            let cy = (prevP.y + p.y) / 2;
            ctx.quadraticCurveTo(prevP.x, prevP.y, cx, cy);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
}