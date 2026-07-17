import React, { useState } from 'react';
import { Contact, ContactTask } from '../../types';
import { playReward } from '../../utils/audio';
import { styles } from '../../styles';

interface TasksWidgetProps {
  selectedContact: Contact;
  handleUpdateContact: (c: Contact) => void;
  t: (key: string) => string;
  inputStyle: any;
  btnStyle: any;
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({
  selectedContact,
  handleUpdateContact,
  t,
  inputStyle,
  btnStyle
}) => {
  const [newTask, setNewTask] = useState('');

  const tasksList = selectedContact.tasks || [];

  const addTask = () => {
    if (!newTask.trim()) return;
    const newEntry: ContactTask = {
      id: Math.random().toString(36).substr(2, 9),
      text: newTask,
      completed: false
    };
    const tasks = [...tasksList, newEntry];
    handleUpdateContact({ ...selectedContact, tasks });
    setNewTask('');
  };

  const toggleTask = (taskId: string) => {
    const target = tasksList.find(t => t.id === taskId);
    if (target && !target.completed) {
      playReward();
    }
    const tasks = tasksList.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    handleUpdateContact({ ...selectedContact, tasks });
  };

  const removeTask = (taskId: string) => {
    const tasks = tasksList.filter(t => t.id !== taskId);
    handleUpdateContact({ ...selectedContact, tasks });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {tasksList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tasksList.map((task) => (
            <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-deep)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => toggleTask(task.id)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', color: 'var(--text-primary)', textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>
                  {task.text}
                </span>
              </div>
              <button onClick={() => removeTask(task.id)} style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.6)', cursor: 'pointer', fontSize: '11px', outline: 'none' }} title="Delete">✕</button>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.emptyText}>{t('sidebar_empty_tasks')}</p>
      )}
      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
        <input 
          type="text" 
          placeholder={t('task_placeholder')} 
          value={newTask} 
          onChange={e => setNewTask(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && addTask()}
          style={{ ...inputStyle, flex: 1 }}
        />
        <button type="button" onClick={addTask} style={{ ...btnStyle, width: 'auto' }}>{t('btn_add_task_short')}</button>
      </div>
    </div>
  );
};
