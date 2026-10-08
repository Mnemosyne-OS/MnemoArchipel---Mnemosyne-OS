import React, { useRef, useState } from 'react';
import { Contact, ContactTask } from '../../types';
import { playReward } from '../../utils/audio';
import { styles } from '../../styles';
import { MnemoCartridgeSDK } from '../../sdk/mnemo-sdk';
import { DueAtPicker } from './DueAtPicker';
import { AGENDA_DENIED, agendaErrorKey, followUpEvent } from '../../utils/agendaDoor';
import { isPast } from '../../utils/dueAtPicker';

const sdk = new MnemoCartridgeSDK('@mnemosyne-plugins/mnemo-archipel');

/** `YYYY-MM-DDTHH:mm` as this machine reads it; `—` when unreadable. */
function formatDueAt(dueAt: string): string {
  const d = new Date(dueAt);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
}

interface TasksWidgetProps {
  selectedContact: Contact;
  handleUpdateContact: (c: Contact) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
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
  const [newDueAt, setNewDueAt] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  // Per task: a filing in flight, or the reason the last one failed.
  const [filing, setFiling] = useState<Record<string, 'busy' | { key: string; detail?: string }>>({});

  const tasksList = selectedContact.tasks || [];
  // The contact as it is NOW. A filing writes after an await, and writing the
  // copy captured at the press would erase any edit made meanwhile.
  const latestContact = useRef(selectedContact);
  latestContact.current = selectedContact;

  // A reminder in the past never rings: refused here and SAID, instead of
  // filing an appointment that will stay silent.
  const dueIsPast = !!newDueAt && isPast(newDueAt, new Date());

  const addTask = () => {
    if (!newTask.trim() || dueIsPast) return;
    const newEntry: ContactTask = {
      id: Math.random().toString(36).substr(2, 9),
      text: newTask,
      completed: false,
      ...(newDueAt ? { dueAt: newDueAt } : {}),
    };
    const tasks = [...tasksList, newEntry];
    handleUpdateContact({ ...selectedContact, tasks });
    setNewTask('');
    setNewDueAt('');
    setPickerOpen(false);
    // Choosing a date and pressing Ajouter IS the gesture: the reminder goes
    // to the Agenda now, not after a second button nobody knew to look for.
    if (newEntry.dueAt) void fileInAgenda(newEntry);
  };

  // One press, one appointment. Never automatic: the calendar is the human's.
  const fileInAgenda = async (task: ContactTask) => {
    const event = followUpEvent(latestContact.current.name, task);
    if (!event) return;
    setFiling(prev => ({ ...prev, [task.id]: 'busy' }));
    try {
      // 🪤 The host reads a cartridge's permissions at boot: on the first
      // launch after this manifest gained `agenda:write`, the action would be
      // refused. Refresh first, and name a refusal instead of guessing.
      const refreshed = await sdk.invoke<{ granted?: Record<string, boolean> }>(
        'permissions.refresh', { permissions: ['agenda:write'] });
      if (refreshed?.granted?.['agenda:write'] !== true) throw new Error(AGENDA_DENIED);
      await sdk.invoke('agenda.add', { events: [event] });
      const filedAt = new Date().toISOString();
      const current = latestContact.current;
      const tasks = (current.tasks || []).map(x => x.id === task.id ? { ...x, agendaFiledAt: filedAt } : x);
      handleUpdateContact({ ...current, tasks });
      setFiling(prev => { const next = { ...prev }; delete next[task.id]; return next; });
    } catch (err) {
      console.error('[AGENDA] filing failed:', err);
      setFiling(prev => ({ ...prev, [task.id]: agendaErrorKey(err) }));
    }
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-primary)', textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>
                    {task.text}
                  </span>
                  {task.dueAt && (() => {
                    const state = filing[task.id];
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span>⏰ {formatDueAt(task.dueAt)}</span>
                        {task.agendaFiledAt ? (
                          <span title={t('agenda_filed_hint')}>📅 {t('agenda_filed')}</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void fileInAgenda(task)}
                            disabled={state === 'busy'}
                            style={{ background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: state === 'busy' ? 'wait' : 'pointer', fontSize: '11px', padding: '2px 6px' }}
                          >
                            📅 {state === 'busy' ? t('agenda_filing') : t('agenda_file_btn')}
                          </button>
                        )}
                        {state && state !== 'busy' && (
                          <span role="alert" style={{ color: 'var(--accent-rose)' }}>
                            {t(state.key, { error: state.detail ?? '' })}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
              <button onClick={() => removeTask(task.id)} style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.6)', cursor: 'pointer', fontSize: '11px', outline: 'none' }} title="Delete">✕</button>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.emptyText}>{t('sidebar_empty_tasks')}</p>
      )}
      {/* Text on its own row: the sidebar is too narrow for text, date and button side by side. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <input 
          type="text" 
          placeholder={t('task_placeholder')} 
          value={newTask} 
          onChange={e => setNewTask(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && addTask()}
          style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setPickerOpen(o => !o)}
            aria-expanded={pickerOpen}
            style={{ flex: 1, textAlign: 'left', background: 'var(--bg-deep)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: newDueAt ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', padding: '8px 10px' }}
          >
            ⏰ {newDueAt ? formatDueAt(newDueAt) : t('task_due_label')}
          </button>
          <button type="button" onClick={addTask} disabled={dueIsPast} style={{ ...btnStyle, width: 'auto', opacity: dueIsPast ? 0.5 : 1, cursor: dueIsPast ? 'not-allowed' : 'pointer' }}>{t('btn_add_task_short')}</button>
        </div>
        {dueIsPast && (
          <span role="alert" style={{ fontSize: '11px', color: 'var(--accent-amber)' }}>{t('due_past')}</span>
        )}
        {pickerOpen && (
          <DueAtPicker value={newDueAt} onChange={setNewDueAt} onClose={() => setPickerOpen(false)} t={t} />
        )}
      </div>
    </div>
  );
};
