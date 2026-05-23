import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { defaultWheelsData } from './data/defaultTasks';
// import { supabase } from './supabaseClient'; // Uncomment if using real Supabase fetching
import Wheel from './components/Wheel';
import ConfigMenu from './components/ConfigMenu';
import './App.css'; // Let's create a minimal App.css for layout specifics

// Helper to initialize local storage
const loadEnabledTasks = () => {
  const saved = localStorage.getItem('osrs-wheel-enabled-tasks');
  if (saved) {
    return JSON.parse(saved);
  }
  
  // Default: enable tasks that have defaultEnabled: true
  const initial = {};
  Object.keys(defaultWheelsData).forEach(wheelId => {
    initial[wheelId] = defaultWheelsData[wheelId].tasks
      .filter(t => t.defaultEnabled)
      .map(t => t.id);
  });
  return initial;
};

function App() {
  const [activeTab, setActiveTab] = useState('bossing');
  const [enabledTasks, setEnabledTasks] = useState(loadEnabledTasks);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  // If we were fetching from Supabase, we would have a useEffect here
  // For now, we use the local default data
  const wheelsData = defaultWheelsData;
  const currentWheel = wheelsData[activeTab];

  // Save to local storage whenever enabledTasks changes
  useEffect(() => {
    localStorage.setItem('osrs-wheel-enabled-tasks', JSON.stringify(enabledTasks));
  }, [enabledTasks]);

  const handleToggleTask = (taskId) => {
    setEnabledTasks(prev => {
      const currentWheelTasks = prev[activeTab] || [];
      const isEnabled = currentWheelTasks.includes(taskId);
      
      let newWheelTasks;
      if (isEnabled) {
        newWheelTasks = currentWheelTasks.filter(id => id !== taskId);
      } else {
        newWheelTasks = [...currentWheelTasks, taskId];
      }
      
      return { ...prev, [activeTab]: newWheelTasks };
    });
  };

  const handleToggleAll = (enableAll) => {
    setEnabledTasks(prev => {
      if (enableAll) {
        return { ...prev, [activeTab]: currentWheel.tasks.map(t => t.id) };
      } else {
        return { ...prev, [activeTab]: [] };
      }
    });
  };

  // Get the actual task objects that are currently enabled for the active wheel
  const activeTaskObjects = currentWheel.tasks.filter(t => 
    (enabledTasks[activeTab] || []).includes(t.id)
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>OSRS Task Spinner</h1>
        <p className="subtitle">Let fate decide your grind</p>
      </header>

      <div className="tabs glass-panel">
        {Object.keys(wheelsData).map(wheelId => (
          <button
            key={wheelId}
            className={`tab-btn ${activeTab === wheelId ? 'active' : ''}`}
            onClick={() => setActiveTab(wheelId)}
          >
            {wheelsData[wheelId].title}
          </button>
        ))}
      </div>

      <main className="main-content">
        <div className="wheel-section">
          <div className="wheel-header">
            <h2>{currentWheel.title}</h2>
            <button 
              className="secondary-btn icon-btn" 
              onClick={() => setIsConfigOpen(true)}
              title="Configure Tasks"
            >
              <Settings size={18} />
              <span>Configure</span>
            </button>
          </div>
          
          <Wheel tasks={activeTaskObjects} />
        </div>
      </main>

      <ConfigMenu 
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        title={currentWheel.title}
        tasks={currentWheel.tasks}
        enabledTaskIds={enabledTasks[activeTab] || []}
        onToggleTask={handleToggleTask}
        onToggleAll={handleToggleAll}
      />
    </div>
  );
}

export default App;
