import React, { useState, useEffect } from 'react';
import { X, Search, Trash2, CheckCircle } from 'lucide-react';
import './ConfigMenu.css';

export default function ConfigMenu({ 
  isOpen, 
  onClose, 
  title, 
  tasks, 
  enabledTaskIds, 
  onConfirm
}) {
  // Local state for the "draft" selections before confirming
  const [draftIds, setDraftIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset draft to actual enabled tasks whenever the menu opens
  useEffect(() => {
    if (isOpen) {
      setDraftIds([...enabledTaskIds]);
      setSearchQuery('');
    }
  }, [isOpen, enabledTaskIds]);

  if (!isOpen) return null;

  const handleToggle = (taskId) => {
    if (draftIds.includes(taskId)) {
      setDraftIds(draftIds.filter(id => id !== taskId));
    } else {
      // Enforce max 10 limit
      if (draftIds.length >= 10) return;
      setDraftIds([...draftIds, taskId]);
    }
  };

  const handleClear = () => {
    setDraftIds([]);
  };

  const handleConfirm = () => {
    if (draftIds.length === 0) return; // Must select at least 1
    onConfirm(draftIds);
  };

  // Filter tasks based on search
  const filteredTasks = tasks.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group filtered tasks by category
  const categories = filteredTasks.reduce((acc, task) => {
    const cat = task.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(task);
    return acc;
  }, {});

  const atMaxLimit = draftIds.length >= 10;
  const atMinLimit = draftIds.length === 0;

  return (
    <div className="config-overlay" onClick={onClose}>
      <div className="config-modal glass-panel" onClick={e => e.stopPropagation()}>
        <div className="config-header">
          <div>
            <h2>{title} Configuration</h2>
            <p className="limit-text">Selected: {draftIds.length} / 10 (Max 10)</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="config-search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search tasks or categories..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="config-actions">
          <button className="secondary-btn flex-btn" onClick={handleClear}>
            <Trash2 size={16} />
            Clear All
          </button>
          
          <button 
            className="primary-btn flex-btn confirm-btn" 
            onClick={handleConfirm}
            disabled={atMinLimit}
          >
            <CheckCircle size={18} />
            Confirm ({draftIds.length})
          </button>
        </div>

        {atMaxLimit && (
          <div className="limit-warning">
            Maximum of 10 tasks reached. Uncheck some to add more.
          </div>
        )}

        <div className="config-body">
          {Object.entries(categories).map(([category, catTasks]) => (
            <div key={category} className="config-category">
              <h3>{category}</h3>
              <div className="task-list">
                {catTasks.map(task => {
                  const isChecked = draftIds.includes(task.id);
                  const isDisabled = !isChecked && atMaxLimit;
                  
                  return (
                    <label 
                      key={task.id} 
                      className={`custom-checkbox ${isDisabled ? 'disabled' : ''}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => handleToggle(task.id)}
                        disabled={isDisabled}
                      />
                      <span>{task.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <p className="no-results">No tasks found matching "{searchQuery}"</p>
          )}
        </div>
      </div>
    </div>
  );
}
