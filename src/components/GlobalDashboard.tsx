import { useState } from 'react';
import { Contact, ContactTask, CustomCategory } from '../types';
import { renderContactAvatar } from './AvatarStudioComponent';
import { styles } from '../styles';
import { playReward } from '../utils/audio';
import { DashboardQuiz } from './DashboardQuiz';

interface GlobalDashboardProps {
  contacts: Contact[];
  customCategories: CustomCategory[];
  onSelectContact: (c: Contact) => void;
  setViewMode: (mode: any) => void;
  globalAvatarStyle: 'human' | 'magical';
  t: (key: string) => string;
  handleUpdateContact: (c: Contact) => void;
  handleLoadDemoData: () => void;
  onImportContacts: (fileContent: string, fileName: string) => boolean;
  onImportDatabase: (json: string) => boolean;
  setShowAddModal: (val: boolean) => void;
}

/**
 * Consolidated global analytics, KPIs, debt trackers, upcoming reminders,
 * and memory quiz training game for the dashboard landing tab.
 */
export function GlobalDashboard({
  contacts,
  customCategories,
  onSelectContact,
  setViewMode,
  globalAvatarStyle,
  t,
  handleUpdateContact,
  handleLoadDemoData,
  onImportContacts,
  onImportDatabase,
  setShowAddModal
}: GlobalDashboardProps) {

  const [dashboardImportStatus, setDashboardImportStatus] = useState<'success' | 'error' | null>(null);

  // 1. Days until calculations for recurring important dates
  const getDaysUntil = (dateStr: string) => {
    if (!dateStr) return -1;
    const today = new Date();
    const parts = dateStr.split('-');
    if (parts.length < 2) return -1;
    const targetMonth = parseInt(parts[1]) - 1;
    const targetDay = parseInt(parts[2]);
    
    const targetDate = new Date(today.getFullYear(), targetMonth, targetDay);
    if (targetDate.getTime() < today.getTime() - 86400000) {
      targetDate.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // 2. Aggregate dates within next 30 days
  const upcomingDates = contacts.flatMap(c => 
    (c.importantDates || []).map(d => ({
      ...d,
      daysLeft: getDaysUntil(d.date),
      contact: c
    }))
  ).filter(d => d.daysLeft >= 0 && d.daysLeft <= 30)
   .sort((a, b) => a.daysLeft - b.daysLeft);

  // 3. Aggregate uncompleted tasks
  const pendingTasks = contacts.flatMap(c => 
    (c.tasks || []).map(task => ({
      ...task,
      contact: c
    }))
  ).filter(task => !task.completed);

  // 4. Financial ledger logic
  const totalOwe = contacts.reduce((sum, c) => 
    sum + (c.debts || []).filter(d => d.type === 'owe' && !d.settled).reduce((acc, d) => acc + d.amount, 0)
  , 0);

  const totalOwed = contacts.reduce((sum, c) => 
    sum + (c.debts || []).filter(d => d.type === 'owed' && !d.settled).reduce((acc, d) => acc + d.amount, 0)
  , 0);

  const netBalance = totalOwed - totalOwe;

  const debtSummaryList = contacts.map(c => {
    const owe = (c.debts || []).filter(d => d.type === 'owe' && !d.settled).reduce((acc, d) => acc + d.amount, 0);
    const owed = (c.debts || []).filter(d => d.type === 'owed' && !d.settled).reduce((acc, d) => acc + d.amount, 0);
    return {
      contact: c,
      owe,
      owed,
      net: owed - owe
    };
  }).filter(s => s.owe > 0 || s.owed > 0)
    .sort((a, b) => b.net - a.net);

  // 5. Aggregate gift ideas
  const giftIdeas = contacts.flatMap(c => 
    (c.gifts || []).filter(g => g.status === 'idea').map(g => ({
      ...g,
      contact: c
    }))
  );

  const handleGoToContact = (contact: Contact) => {
    onSelectContact(contact);
    setViewMode('contact-dashboard');
  };

  const toggleTaskState = (contact: Contact, task: ContactTask) => {
    if (!contact.tasks) return;
    const isNowCompleted = !task.completed;
    if (isNowCompleted) {
      playReward();
    }
    const updatedTasks = contact.tasks.map(t => t.id === task.id ? { ...t, completed: isNowCompleted } : t);
    handleUpdateContact({
      ...contact,
      tasks: updatedTasks
    });
  };

  // Calculations for charts
  const defaultCats = [
    { key: 'Friend', label: t('filter_friends') || 'Amis', color: '#10b981' },
    { key: 'Colleague', label: t('filter_colleagues') || 'Collègues', color: '#3b82f6' },
    { key: 'Family', label: t('filter_family') || 'Famille', color: '#ec4899' },
    { key: 'Mentor', label: t('filter_mentors') || 'Mentors', color: '#a855f7' }
  ];
  
  const allCats = [
    ...defaultCats,
    ...customCategories.map(c => ({ key: c.key, label: c.label, color: c.color }))
  ];

  const catDistribution = allCats.map(cat => {
    const count = contacts.filter(c => c.relations.includes(cat.key)).length;
    return { ...cat, count };
  }).filter(c => c.count > 0);

  const totalAssignments = catDistribution.reduce((acc, c) => acc + c.count, 0);

  const circumference = 226.195;
  let currentOffset = 0;
  const segments = catDistribution.map(cat => {
    const ratio = cat.count / (totalAssignments || 1);
    const dashArray = ratio * circumference;
    const strokeOffset = circumference - dashArray + currentOffset;
    currentOffset -= dashArray;
    const pct = Math.round(ratio * 100);
    return {
      ...cat,
      dashArray,
      strokeOffset,
      pct
    };
  });

  const catWarmthAverages = allCats.map(cat => {
    const catContacts = contacts.filter(c => c.relations.includes(cat.key));
    const avgWarmth = catContacts.length > 0 
      ? Math.round(catContacts.reduce((acc, c) => acc + (c.warmth || 0), 0) / catContacts.length)
      : 0;
    return { ...cat, count: catContacts.length, avgWarmth };
  }).filter(c => c.count > 0);

  const totalContactsCount = contacts.length;
  const getActualHistory = () => {
    const now = new Date();
    const historyPoints = [];
    
    for (let i = 5; i >= 0; i--) {
      // Last day of the target month
      const checkpointDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      
      let count = 0;
      contacts.forEach(c => {
        let creationDate = now;
        if (c.mementos && c.mementos.length > 0) {
          const mementoDates = c.mementos
            .map(m => new Date(m.date))
            .filter(d => !isNaN(d.getTime()));
          if (mementoDates.length > 0) {
            creationDate = new Date(Math.min(...mementoDates.map(d => d.getTime())));
          }
        }
        if (creationDate <= checkpointDate) {
          count++;
        }
      });
      historyPoints.push(count);
    }
    return historyPoints;
  };

  const dataPoints = getActualHistory();
  
  const getSvgPoints = () => {
    const maxVal = Math.max(1, totalContactsCount);
    return dataPoints.map((val, idx) => {
      const x = (idx / 5) * 160;
      const y = 60 - (val / maxVal) * 50;
      return `${x},${y}`;
    });
  };
  const points = getSvgPoints();
  const pathData = `M 0,60 L ${points.join(' L ')} L 160,60 Z`;
  const lineData = `M ${points.join(' L ')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '30px' }}>
      
      {/* Page Header */}
      <div>
        <h2 style={{ ...styles.sidebarTitle, fontSize: '24px', textAlign: 'left', margin: '0 0 4px 0' }}>
          🖥️ {t('nav_global_dashboard') || 'Tableau de Bord Global'}
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
          {t('global_dashboard_desc') || 'Vue consolidée de l\'ensemble de vos engagements et relations.'}
        </p>
      </div>

      {/* Empty State / Quick Load Banner */}
      {contacts.length === 0 && (
        <div style={{
          backgroundColor: 'var(--bg-surface-glass)',
          border: '1px solid var(--accent-teal)',
          borderRadius: '12px',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          textAlign: 'center',
          marginTop: '10px'
        }} className="glass">
          <div style={{ fontSize: '36px' }}>🏝️</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {t('empty_dashboard_title') || 'Your Social Archipelago is Empty'}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: '1.5' }}>
              {t('empty_dashboard_desc') || 'Populate your local database to visualize your network in 2D and 3D, take quizzes, and optimize your outreach.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
            {/* Action 1: Load Demo */}
            <button 
              onClick={handleLoadDemoData}
              style={{
                backgroundColor: 'var(--accent-teal)',
                color: 'var(--bg-deep)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontWeight: 600,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(20, 184, 166, 0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(20, 184, 166, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.2)';
              }}
            >
              🔄 {t('db_load_demo')}
            </button>

            {/* Action 2: Add Contact */}
            <button 
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: 'var(--bg-deep)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 18px',
                fontWeight: 600,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s, border-color 0.2s, background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.borderColor = 'var(--accent-teal)';
                e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.backgroundColor = 'var(--bg-deep)';
              }}
            >
              {t('btn_new_contact')}
            </button>

            {/* Action 3: Import File */}
            <label 
              style={{
                backgroundColor: 'var(--bg-deep)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 18px',
                fontWeight: 600,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s, border-color 0.2s, background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.borderColor = 'var(--accent-teal)';
                e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.backgroundColor = 'var(--bg-deep)';
              }}
            >
              📥 {t('db_import_label')}
              <input 
                type="file" 
                accept=".json,.vcf,.csv" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (evt) => {
                    const content = evt.target?.result as string;
                    if (content) {
                      const isDatabaseBackup = file.name.toLowerCase().endsWith('.json') && content.includes('"userProfile"');
                      if (isDatabaseBackup) {
                        const success = onImportDatabase(content);
                        setDashboardImportStatus(success ? 'success' : 'error');
                        if (success) window.location.reload();
                      } else {
                        const success = onImportContacts(content, file.name);
                        setDashboardImportStatus(success ? 'success' : 'error');
                      }
                    }
                  };
                  reader.readAsText(file);
                }}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {dashboardImportStatus === 'success' && (
            <div style={{ color: 'var(--accent-emerald)', fontSize: '12px', fontWeight: 500, marginTop: '4px' }}>
              ✅ {t('db_import_success')}
            </div>
          )}
          {dashboardImportStatus === 'error' && (
            <div style={{ color: 'var(--accent-rose)', fontSize: '12px', fontWeight: 500, marginTop: '4px' }}>
              ❌ {t('db_import_error')}
            </div>
          )}
        </div>
      )}

      {/* Top Level consolidated KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg-surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }} className="glass">
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>👤 {t('total_contacts') || 'Contacts'}</span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{contacts.length}</span>
        </div>
        <div style={{ backgroundColor: 'var(--bg-surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }} className="glass">
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>📅 {t('upcoming_reminders') || 'Rappels (30j)'}</span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-teal)' }}>{upcomingDates.length}</span>
        </div>
        <div style={{ backgroundColor: 'var(--bg-surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }} className="glass">
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>📋 {t('pending_tasks') || 'Tâches en attente'}</span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-amber)' }}>{pendingTasks.length}</span>
        </div>
        <div style={{ backgroundColor: 'var(--bg-surface-glass)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }} className="glass">
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>💰 {t('net_balance') || 'Solde Net'}</span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: netBalance >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
            {netBalance > 0 ? '+' : ''}{netBalance} €
          </span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="glass">
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
          📊 {t('relation_analytics_title') || 'Analyses Relat-Cognitives'}
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Chart 1: Donut breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('chart_breakdown') || 'Breakdown by Category'}</span>
            {totalAssignments > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                <svg width="90" height="90" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
                  <circle cx="50" cy="50" r="36" fill="transparent" stroke="var(--border-subtle)" strokeWidth="12" />
                  {segments.map(seg => (
                    <circle 
                      key={seg.key}
                      cx="50" 
                      cy="50" 
                      r="36" 
                      fill="transparent" 
                      stroke={seg.color} 
                      strokeWidth="12" 
                      strokeDasharray={`${seg.dashArray} ${circumference}`} 
                      strokeDashoffset={seg.strokeOffset}
                      transform="rotate(-90 50 50)"
                    />
                  ))}
                  <text x="50" y="54" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="bold">
                    {contacts.length}
                  </text>
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, maxHeight: '90px', overflowY: 'auto' }}>
                  {segments.map(seg => (
                    <div key={seg.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: seg.color, flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '65px' }} title={seg.label}>{seg.label}</span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>{seg.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '20px 0' }}>{t('no_data') || 'No data'}</span>
            )}
          </div>

          {/* Chart 2: Resonance gauge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('chart_resonance') || 'Average Resonance'}</span>
            {catWarmthAverages.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '90px', overflowY: 'auto', paddingRight: '4px' }}>
                {catWarmthAverages.map(cat => (
                  <div key={cat.key} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cat.label}</span>
                      <span style={{ color: cat.color, fontWeight: 'bold' }}>{cat.avgWarmth}%</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--bg-deep)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${cat.avgWarmth}%`, backgroundColor: cat.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '20px 0' }}>{t('no_data') || 'No data'}</span>
            )}
          </div>

          {/* Chart 3: Growth Area curve */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{t('chart_network') || 'Network'}</span>
            {totalContactsCount > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <svg width="100%" height="55" viewBox="0 0 160 60" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-teal)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--accent-teal)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d={pathData} fill="url(#growthGrad)" />
                  <path d={lineData} fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" />
                  {points.map((pt, idx) => {
                    const [x, y] = pt.split(',');
                    return (
                      <circle 
                        key={idx} 
                        cx={x} 
                        cy={y} 
                        r="3.5" 
                        fill="var(--bg-surface)" 
                        stroke="var(--accent-teal)" 
                        strokeWidth="1.5" 
                      >
                        <title>{`Point ${idx + 1}: ${dataPoints[idx]} contacts`}</title>
                      </circle>
                    );
                  })}
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>{t('chart_months_ago') || '6 months ago'}</span>
                  <span>{t('time_filter_day') || 'Today'}</span>
                </div>
              </div>
            ) : (
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '20px 0' }}>{t('no_data') || 'No data'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Grid Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* MODULE 1: Reminders */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="glass">
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            📅 {t('upcoming_dates_title') || 'Prochaines Dates Importantes (30j)'}
          </h3>
          {upcomingDates.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
              {upcomingDates.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-deep)', padding: '10px 14px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden' }}>
                      {renderContactAvatar(item.contact, 28, globalAvatarStyle)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span onClick={() => handleGoToContact(item.contact)} style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', textDecoration: 'underline' }}>
                        {item.contact.name}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.label} ({item.date})</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: item.daysLeft <= 7 ? 'var(--accent-rose)' : 'var(--accent-teal)' }}>
                    J-{item.daysLeft}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', padding: '10px 0' }}>
              {t('no_upcoming_dates') || 'Aucune date importante à venir.'}
            </p>
          )}
        </div>

        {/* MODULE 2: Tasks Checklist */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="glass">
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            📋 {t('global_tasks_title') || 'Checklist des Actions'}
          </h3>
          {pendingTasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
              {pendingTasks.map((task) => (
                <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-deep)', padding: '10px 14px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleTaskState(task.contact, task)}
                      style={{ cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>{task.text}</span>
                      <span onClick={() => handleGoToContact(task.contact)} style={{ fontSize: '10.5px', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>
                        {task.contact.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', padding: '10px 0' }}>
              {t('no_pending_tasks') || 'Félicitations, aucune action en attente !'}
            </p>
          )}
        </div>

        {/* MODULE 3: Finance Ledger */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="glass">
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            💸 {t('financial_summary_title') || 'Registre de Dettes Global'}
          </h3>
          {debtSummaryList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
              {debtSummaryList.map((item) => {
                const color = item.net === 0 ? 'var(--text-secondary)' : item.net > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)';
                const sign = item.net > 0 ? '+' : '';
                return (
                  <div key={item.contact.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-deep)', padding: '10px 14px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden' }}>
                        {renderContactAvatar(item.contact, 28, globalAvatarStyle)}
                      </div>
                      <span onClick={() => handleGoToContact(item.contact)} style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', textDecoration: 'underline' }}>
                        {item.contact.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color }}>{sign}{item.net} €</span>
                      <span style={{ fontSize: '9.5px', color: 'var(--text-secondary)' }}>
                        ({t('debt_owe_label')}: {item.owe}€ • {t('debt_owed_label')}: {item.owed}€)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', padding: '10px 0' }}>
              {t('no_debts') || 'Aucune dette enregistrée.'}
            </p>
          )}
        </div>

        {/* MODULE 4: Gift Ideas */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="glass">
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            🎁 {t('gift_registry_title') || 'Idées Cadeaux'}
          </h3>
          {giftIdeas.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
              {giftIdeas.map((gift) => (
                <div key={gift.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-deep)', padding: '10px 14px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden' }}>
                      {renderContactAvatar(gift.contact, 28, globalAvatarStyle)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>🎁 {gift.idea}</span>
                      <span onClick={() => handleGoToContact(gift.contact)} style={{ fontSize: '10.5px', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>
                        {gift.contact.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', padding: '10px 0' }}>
              {t('no_gift_ideas') || 'Aucune idée cadeau enregistrée.'}
            </p>
          )}
        </div>

      </div>

      {/* Social Memory Quiz Section */}
      <DashboardQuiz 
        contacts={contacts}
        customCategories={customCategories}
        t={t}
      />

    </div>
  );
}
