import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { supabase } from './supabaseClient';
import { defaultWheelsData } from './data/defaultTasks';
import Wheel from './components/Wheel';
import ConfigMenu from './components/ConfigMenu';
import './App.css'; 

const loadEnabledTasks = (availableTasksByWheel) => {
  const saved = localStorage.getItem('osrs-wheel-enabled-tasks');
  if (saved) return JSON.parse(saved);
  
  const initial = {};
  Object.keys(availableTasksByWheel).forEach(wheelId => {
    initial[wheelId] = availableTasksByWheel[wheelId]
      .filter(t => t.defaultEnabled)
      .slice(0, 20) // Max 20 for cascade
      .map(t => t.id);
  });
  return initial;
};

function App() {
  const [activeTab, setActiveTab] = useState('bossing');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [wheelsData, setWheelsData] = useState({ bossing: [], skilling: [], other: [] });
  const [enabledTasks, setEnabledTasks] = useState({});
  const [winningTask, setWinningTask] = useState(null);

  useEffect(() => {
    async function loadTasks() {
      if (supabase) {
        try {
          const { data, error } = await supabase.from('tasks').select('*');
          if (error) throw error;
          if (data && data.length > 0) {
            const grouped = { bossing: [], skilling: [], other: [] };
            data.forEach(task => {
              if (grouped[task.wheel_type]) grouped[task.wheel_type].push(task);
            });
            setWheelsData(grouped);
            setEnabledTasks(loadEnabledTasks(grouped));
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error("Error fetching from Supabase:", err);
        }
      }
      
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

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('osrs-wheel-enabled-tasks', JSON.stringify(enabledTasks));
    }
  }, [enabledTasks, isLoading]);

  // Reset winner when switching tabs
  useEffect(() => {
    setWinningTask(null);
  }, [activeTab]);

  const handleConfigConfirm = (newSelectedIds) => {
    setEnabledTasks(prev => ({ ...prev, [activeTab]: newSelectedIds }));
    setWinningTask(null); // Reset winner when wheel changes
    setIsConfigOpen(false);
  };

  if (isLoading) {
    return <div className="app-container"><p>Loading tasks...</p></div>;
  }

  const currentWheelTasks = wheelsData[activeTab] || [];
  const activeTaskObjects = currentWheelTasks.filter(t => 
    (enabledTasks[activeTab] || []).includes(t.id)
  );

  const wheelTitles = { bossing: "Bossing", skilling: "Skilling", other: "Diversions" };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>OSRS Task Spinner</h1>
        <div className="tabs osrs-panel">
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
      </header>

      <main className="main-content">
        
        {/* LEFT COLUMN: The Wheel */}
        <div className="wheel-section osrs-panel">
          <div className="wheel-header">
            <h2>{wheelTitles[activeTab]}</h2>
            <button className="secondary-btn icon-btn" onClick={() => setIsConfigOpen(true)}>
              <Settings size={16} /> Configure
            </button>
          </div>
          
          <div className="wheel-wrapper osrs-window">
            <Wheel 
              tasks={activeTaskObjects} 
              onSpinStart={() => setWinningTask(null)}
              onSpinComplete={(winner) => setWinningTask(winner)} 
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Info Panel */}
        <div className="info-section osrs-panel">
          <h2>Task Information</h2>
          <div className="info-window osrs-window">
            {winningTask ? (
              <div className="winner-details">
                <h3 className="winner-title">{winningTask.name}</h3>
                <span className="category-tag">{winningTask.category}</span>
                
                <div className="image-container">
                  {winningTask.image_url ? (
                    <img src={winningTask.image_url} alt={winningTask.name} />
                  ) : (
                    <div className="no-image">No Image Found</div>
                  )}
                </div>
                
                <div className="drops-container">
                  <h4>Notable Drops / Info</h4>
                  <p>{winningTask.notable_drops || 'No notable drops documented.'}</p>
                </div>
              </div>
            ) : (
              <div className="placeholder-info">
                <p>Spin the wheel to receive your task.</p>
                <div className="pixel-spinner"></div>
              </div>
            )}
          </div>
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
