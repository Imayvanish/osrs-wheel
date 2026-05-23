import React from 'react';
import { X, CheckSquare, Square } from 'lucide-react';
import './ConfigMenu.css';

export default function ConfigMenu({ 
  isOpen, 
  onClose, 
  title, 
  tasks, 
  enabledTaskIds, 
  onToggleTask,
  onToggleAll
}) {
  if (!isOpen) return null;

  // Group tasks by category
  const categories = tasks.reduce((acc, task) => {
    const cat = task.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(task);
    return acc;
  }, {});

  const allEnabled = tasks.every(t => enabledTaskIds.includes(t.id));

  return (
    <div className="config-overlay" onClick={onClose}>
      <div className="config-modal glass-panel" onClick={e => e.stopPropagation()}>
        <div className="config-header">
          <h2>{title} Configuration</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="config-actions">
          <button 
            className="secondary-btn flex-btn" 
            onClick={() => onToggleAll(!allEnabled)}
          >
            {allEnabled ? <Square size={16} /> : <CheckSquare size={16} />}
            {allEnabled ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="config-body">
          {Object.entries(categories).map(([category, catTasks]) => (
            <div key={category} className="config-category">
              <h3>{category}</h3>
              <div className="task-list">
                {catTasks.map(task => {
                  const isChecked = enabledTaskIds.includes(task.id);
                  return (
                    <label key={task.id} className="custom-checkbox">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => onToggleTask(task.id)}
                      />
                      <span>{task.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="config-footer">
          <p className="helper-text">Changes are automatically saved to your browser.</p>
        </div>
      </div>
    </div>
  );
}
