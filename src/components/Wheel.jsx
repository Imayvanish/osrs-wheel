import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './Wheel.css';

// Pre-defined premium colors for the wheel segments
const segmentColors = [
  '#f7a00d', '#d47a00', '#1f2833', '#45a29e', '#c5c6c7', '#2a313c'
];

export default function Wheel({ tasks }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const wheelRef = useRef(null);

  // Reset selected task if the wheel's tasks change
  useEffect(() => {
    setSelectedTask(null);
  }, [tasks]);

  const spin = () => {
    if (isSpinning || tasks.length === 0) return;
    
    setIsSpinning(true);
    setSelectedTask(null);
    
    // Play a tick sound (if you had an audio file, you'd trigger it here)
    // For now, we'll rely on the visual spinning
    
    const minSpins = 5;
    const maxSpins = 10;
    const extraSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
    
    // Randomize the exact angle it stops at
    const randomAngle = Math.random() * 360;
    const newRotation = rotation + (extraSpins * 360) + randomAngle;
    
    setRotation(newRotation);

    // Calculate which task won
    // The pointer is at the top (0 degrees). 
    // In CSS, conic gradients start at top and go clockwise. 
    // Rotation goes clockwise. So the segment at the top is (360 - (newRotation % 360)).
    setTimeout(() => {
      setIsSpinning(false);
      
      const degreesPerSegment = 360 / tasks.length;
      // Normalize rotation between 0 and 360
      const normalizedRot = newRotation % 360;
      // Because the wheel rotates clockwise, the top element moves counter-clockwise relative to the pointer
      const pointerAngle = (360 - normalizedRot) % 360;
      
      const winningIndex = Math.floor(pointerAngle / degreesPerSegment);
      const winner = tasks[winningIndex];
      
      setSelectedTask(winner);
      
      // Fire confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f7a00d', '#ffffff', '#45a29e']
      });
      
    }, 4000); // 4s matches our CSS transition time
  };

  if (tasks.length === 0) {
    return (
      <div className="wheel-empty glass-panel">
        <p>No tasks selected. Open configuration to add tasks!</p>
      </div>
    );
  }

  // Build conic-gradient string
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
      <div className="wheel-pointer">▼</div>
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
          const rotationAngle = (i * degreesPerSegment) + (degreesPerSegment / 2);
          return (
            <div 
              key={task.id} 
              className="wheel-label-container"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              <div className="wheel-label">
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
        {isSpinning ? 'Spinning...' : 'SPIN'}
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
