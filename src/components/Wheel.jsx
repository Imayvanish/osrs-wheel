import React, { useState, useEffect, useRef } from 'react';
import './Wheel.css';

// Synthesize a retro "tick" sound
const playTick = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Ignore if audio context fails (e.g. strict autoplay policy)
  }
};

export default function Wheel({ tasks, onSpinStart, onSpinComplete }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const [stripTasks, setStripTasks] = useState([]);
  
  const ITEM_HEIGHT = 60; // Pixels per item

  useEffect(() => {
    // Initialize the strip with a few copies so it fills the screen
    if (tasks.length > 0) {
      setStripTasks([...tasks, ...tasks, ...tasks]);
      setOffsetY(0);
    } else {
      setStripTasks([]);
    }
  }, [tasks]);

  const spin = () => {
    if (isSpinning || tasks.length === 0) return;
    
    setIsSpinning(true);
    if (onSpinStart) onSpinStart();
    
    // Pick a winner
    const winningIndex = Math.floor(Math.random() * tasks.length);
    const winner = tasks[winningIndex];
    
    // Create a long strip to scroll through
    // We will scroll down (negative translateY).
    // Let's make the strip 10 copies of the array long, and stop on the winner in the 9th copy.
    const copies = 10;
    const targetCopy = 8;
    
    let newStrip = [];
    for (let i = 0; i < copies; i++) {
      newStrip = [...newStrip, ...tasks];
    }
    
    setStripTasks(newStrip);
    
    // The index of the winning item in the giant strip
    const targetAbsoluteIndex = (targetCopy * tasks.length) + winningIndex;
    
    // We want the winning item to land in the center of the viewport.
    // The viewport is 300px tall. The center is at 150px.
    // The top of the winning item needs to be at 150 - (ITEM_HEIGHT / 2) = 120px.
    const centerOffset = 120;
    
    const finalOffset = -(targetAbsoluteIndex * ITEM_HEIGHT) + centerOffset;
    
    // Reset to top instantly before animating
    setOffsetY(0);
    
    // Small delay to allow React to render the long strip before animating
    setTimeout(() => {
      setOffsetY(finalOffset);
      
      // Simulate ticking sound during the spin
      let ticks = 0;
      const totalTime = 4000;
      const tickInterval = setInterval(() => {
        playTick();
        ticks++;
        // Play fewer ticks near the end to simulate slowing down
        if (ticks > 25) clearInterval(tickInterval);
      }, totalTime / 30);
      
      setTimeout(() => {
        clearInterval(tickInterval);
        setIsSpinning(false);
        if (onSpinComplete) onSpinComplete(winner);
      }, totalTime);
      
    }, 50);
  };

  if (tasks.length === 0) {
    return (
      <div className="wheel-empty">
        <p>No tasks configured.</p>
        <p>Click Configure to add up to 20 tasks.</p>
      </div>
    );
  }

  return (
    <div className="cascade-container">
      <div className="cascade-pointer-left">▶</div>
      <div className="cascade-pointer-right">◀</div>
      
      <div className="cascade-window">
        <div 
          className="cascade-strip"
          style={{ 
            transform: `translateY(${offsetY}px)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.25, 1)' : 'none'
          }}
        >
          {stripTasks.map((task, idx) => (
            <div key={`${task.id}-${idx}`} className="cascade-item">
              {task.name}
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="primary-btn spin-btn" 
        onClick={spin}
        disabled={isSpinning}
      >
        {isSpinning ? 'SPINNING...' : 'PULL LEVER'}
      </button>
    </div>
  );
}
