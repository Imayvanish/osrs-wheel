import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './Wheel.css';

// Barrows themed segment colors
const segmentColors = [
  '#2a3324', '#3d4a34', '#1f261c', '#4d5c41', '#22291e', '#36422d'
];

export default function Wheel({ tasks }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const wheelRef = useRef(null);

  useEffect(() => {
    setSelectedTask(null);
  }, [tasks]);

  const spin = () => {
    if (isSpinning || tasks.length === 0) return;
    
    setIsSpinning(true);
    setSelectedTask(null);
    
    const minSpins = 5;
    const maxSpins = 10;
    const extraSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
    
    const randomAngle = Math.random() * 360;
    const newRotation = rotation + (extraSpins * 360) + randomAngle;
    
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      
      const degreesPerSegment = 360 / tasks.length;
      const normalizedRot = newRotation % 360;
      // Pointer is at the right side (90 degrees clockwise from top) to make reading radial text easier
      // Let's keep pointer at top (0 degrees) for now, but radial text reading is usually easier on the right.
      // We will place pointer on the right side in the CSS. Right is 90 deg relative to top.
      const pointerAngle = (360 - normalizedRot + 90) % 360;
      
      const winningIndex = Math.floor(pointerAngle / degreesPerSegment);
      const winner = tasks[winningIndex];
      
      setSelectedTask(winner);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7ab859', '#e6ede1', '#4d7a36'] // Barrows confetti
      });
      
    }, 4000);
  };

  if (tasks.length === 0) {
    return (
      <div className="wheel-empty glass-panel">
        <p>No tasks configured. Click Configure to add tasks (Max 10).</p>
      </div>
    );
  }

  const degreesPerSegment = 360 / tasks.length;
  let gradientStops = [];
  
  for (let i = 0; i < tasks.length; i++) {
    const color = segmentColors[i % segmentColors.length];
    const startAngle = i * degreesPerSegment;
    const endAngle = (i + 1) * degreesPerSegment;
    gradientStops.push(`${color} ${startAngle}deg ${endAngle}deg`);
  }

  const conicGradient = `conic-gradient(${gradientStops.join(', ')})`;

  return (
    <div className="wheel-container">
      {/* We move the pointer to the right side so radial text is readable horizontally when it wins */}
      <div className="wheel-pointer">◀</div>
      
      <div 
        className="wheel" 
        ref={wheelRef}
        style={{ 
          background: conicGradient,
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 4s cubic-bezier(0.1, 0.8, 0.2, 1)' : 'none'
        }}
      >
        {tasks.map((task, i) => {
          // The center of the segment
          const rotationAngle = (i * degreesPerSegment) + (degreesPerSegment / 2);
          
          return (
            <div 
              key={task.id} 
              className="wheel-label-spoke"
              style={{ transform: `rotate(${rotationAngle - 90}deg)` }}
            >
              <div className="wheel-label-text">
                {task.name}
              </div>
            </div>
          );
        })}
      </div>
      
      <button 
        className="primary-btn spin-btn" 
        onClick={spin}
        disabled={isSpinning}
      >
        {isSpinning ? 'SPINNING...' : 'SPIN'}
      </button>

      {selectedTask && !isSpinning && (
        <div className="result-announcement glass-panel">
          <h3>Your Task:</h3>
          <h2>{selectedTask.name}</h2>
          {selectedTask.category && <span className="category-badge">{selectedTask.category}</span>}
        </div>
      )}
    </div>
  );
}
