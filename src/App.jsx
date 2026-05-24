import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { supabase } from './supabaseClient';
import { defaultWheelsData } from './data/defaultTasks';
import Wheel from './components/Wheel';
import ConfigMenu from './components/ConfigMenu';
import './App.css'; 

// Helper to initialize local storage
const loadEnabledTasks = (availableTasksByWheel) => {
  const saved = localStorage.getItem('osrs-wheel-enabled-tasks');
  if (saved) {
    return JSON.parse(saved);
  }
  
  // Default: enable tasks that have defaultEnabled: true (up to max 10)
  const initial = {};
  Object.keys(availableTasksByWheel).forEach(wheelId => {
    initial[wheelId] = availableTasksByWheel[wheelId]
      .filter(t => t.defaultEnabled)
      .slice(0, 10) // Enforce max 10 even on defaults
      .map(t => t.id);
  });
  return initial;
};

function App() {
  const [activeTab, setActiveTab] = useState('bossing');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Master list of tasks separated by wheel type
  const [wheelsData, setWheelsData] = useState({
    bossing: [], skilling: [], other: []
  });
  
  // Dictionary of wheelId -> array of enabled task IDs
  const [enabledTasks, setEnabledTasks] = useState({});

  useEffect(() => {
    async function loadTasks() {
      if (supabase) {
        try {
          const { data, error } = await supabase.from('tasks').select('*');
          if (error) throw error;
          
          if (data && data.length > 0) {
            // Group by wheel_type
            const grouped = { bossing: [], skilling: [], other: [] };
            data.forEach(task => {
              if (grouped[task.wheel_type]) {
                grouped[task.wheel_type].push(task);
              }
            });
            setWheelsData(grouped);
            setEnabledTasks(loadEnabledTasks(grouped));
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error("Error fetching from Supabase:", err);
          // Fallback below
        }
      }
      
      // Fallback to local default data if Supabase isn't setup or errors
      const grouped = {
        bossing: defaultWheelsData.bossing.tasks.map(t => ({...t, wheel_type: 'bossing'})),
        skilling: defaultWheelsData.skilling.tasks.map(t => ({...t, wheel_type: 'skilling'})),
        other: defaultWheelsData.other.tasks.map(t => ({...t, wheel_type: 'other'}))
      };
      setWheelsData(grouped);
      setEnabledTasks(loadEnabledTasks(grouped));
      setIsLoading(false);
    }
    
    loadTasks();
  }, []);

  // Save to local storage whenever enabledTasks changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('osrs-wheel-enabled-tasks', JSON.stringify(enabledTasks));
    }
  }, [enabledTasks, isLoading]);

  const handleConfigConfirm = (newSelectedIds) => {
    setEnabledTasks(prev => ({
      ...prev,
      [activeTab]: newSelectedIds
    }));
    setIsConfigOpen(false);
  };

  if (isLoading) {
    return <div className="app-container"><p>Loading tasks...</p></div>;
  }

  const currentWheelTasks = wheelsData[activeTab] || [];
  const activeTaskObjects = currentWheelTasks.filter(t => 
    (enabledTasks[activeTab] || []).includes(t.id)
  );

  const wheelTitles = {
    bossing: "Bossing",
    skilling: "Skilling",
    other: "Diversions & Other"
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>OSRS Task Spinner</h1>
        <p className="subtitle">Let fate decide your grind</p>
      </header>

      <div className="tabs glass-panel">
        {Object.keys(wheelTitles).map(wheelId => (
          <button
            key={wheelId}
            className={`tab-btn ${activeTab === wheelId ? 'active' : ''}`}
            onClick={() => setActiveTab(wheelId)}
          >
            {wheelTitles[wheelId]}
          </button>
        ))}
      </div>

      <main className="main-content">
        <div className="wheel-section">
          <div className="wheel-header">
            <h2>{wheelTitles[activeTab]}</h2>
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
        title={wheelTitles[activeTab]}
        tasks={currentWheelTasks}
        enabledTaskIds={enabledTasks[activeTab] || []}
        onConfirm={handleConfigConfirm}
      />
    </div>
  );
}

export default App;
