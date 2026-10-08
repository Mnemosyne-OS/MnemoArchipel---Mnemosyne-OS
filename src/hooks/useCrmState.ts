import { useState, useEffect } from 'react';
import { Contact, AvatarStudioConfig } from '../types';
import { MnemoCartridgeSDK } from '../sdk/mnemo-sdk';
import { getRandomAvatarConfig, generate50DemoContacts } from '../utils/helpers';
import { useCrmSettings } from './useCrmSettings';
import { calculateNotifications } from '../utils/notificationHelpers';
import { exportDatabase, importDatabase, importDetectFormat } from '../utils/databaseHelpers';
import {
  CONTACTS_KEY, RESTORED_FLAG, bootDecision, localIsBlank, readContactsRaw, restoreLocal,
  snapshotLocal, statusFromError, type MirrorSnapshot, type MirrorStatus,
} from '../utils/mirror';

const sdk = new MnemoCartridgeSDK('@mnemosyne-plugins/mnemo-archipel');

/** Coalesces a burst of edits (typing a fact) into one host write. */
const MIRROR_DEBOUNCE_MS = 1200;

/**
 * Main custom hook managing CRM core entities state (contacts, search, details).
 * Composition hook: integrates useCrmSettings hook for all configuration parameters.
 */
export function useCrmState() {
  const settings = useCrmSettings();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Navigation & Filtering
  const [viewMode, setViewMode] = useState<'archipelago' | 'archipelago3d' | 'list' | 'settings' | 'timeline' | 'avatar-builder' | 'contact-dashboard' | 'dashboard'>('dashboard');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Contacts read at boot: three states, never two (doc 124 §7).
  const [contactsLoad, setContactsLoad] = useState<'reading' | 'ok' | 'unreadable'>('reading');
  // The second copy held by the host (doc 73).
  const [mirrorStatus, setMirrorStatus] = useState<MirrorStatus>({ kind: 'pending' });
  const [mirrorReady, setMirrorReady] = useState(false);
  const [restoredAt, setRestoredAt] = useState<string | null>(() => {
    try {
      const at = localStorage.getItem(RESTORED_FLAG);
      if (at) localStorage.removeItem(RESTORED_FLAG);
      return at;
    } catch (err) {
      console.warn('[MIRROR] could not read the restore flag:', err);
      return null;
    }
  });

  // Modals Visibility
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFactModal, setShowFactModal] = useState(false);
  const [factTargetContact, setFactTargetContact] = useState<Contact | null>(null);
  
  // Context Menus & Links
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean; contact?: Contact }>({ x: 0, y: 0, visible: false });
  const [highlightedLink, setHighlightedLink] = useState<{ c1: Contact; c2: Contact } | null>(null);
  
  // Distillation & Search
  const [brainDump, setBrainDump] = useState('');
  const [extractionResult, setExtractionResult] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [ragAnswer, setRagAnswer] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  
  // Host status
  const [isHostOnline, setIsHostOnline] = useState(false);
  const [vaultId, setVaultId] = useState<string>('archipel');

  useEffect(() => {
    sdk.status().then(() => setIsHostOnline(true)).catch(() => {
      setIsHostOnline(false);
      setMirrorStatus({ kind: 'offline' });
    });
  }, []);

  // The lock was removed (doc 124 §3.2): it stored its password in clear and
  // protected nothing. Its leftovers are cleared so no secret stays behind.
  useEffect(() => {
    for (const key of ['crm_lock_enabled', 'crm_lock_type', 'crm_password', 'crm_2fa_secret']) {
      try { localStorage.removeItem(key); }
      catch (err) { console.warn(`[LOCK] could not clear ${key}:`, err); }
    }
  }, []);

  // Mirror, boot half. 🚨 Read the host copy BEFORE anything writes it:
  // a cartridge booting on a new, empty origin would otherwise overwrite a
  // full mirror with an empty list. Until this answers, nothing is mirrored.
  useEffect(() => {
    if (!isHostOnline) return;
    let alive = true;
    sdk.invoke<{ state: { snapshot?: MirrorSnapshot } | null }>('state.get')
      .then(res => {
        if (!alive) return;
        const snap = res?.state?.snapshot;
        if (bootDecision(localIsBlank(), snap) === 'restore' && snap && restoreLocal(snap).includes(CONTACTS_KEY)) {
          try { localStorage.setItem(RESTORED_FLAG, new Date().toISOString()); }
          catch (err) { console.warn('[MIRROR] could not set the restore flag:', err); }
          // Every hook reads its keys at mount: reload instead of patching
          // half the surfaces with stale state.
          window.location.reload();
          return;
        }
        setMirrorReady(true);
      })
      .catch(err => {
        // Unknown is not empty: without an answer, writing would risk
        // replacing a good mirror. The screen says the copy failed.
        console.error('[MIRROR] read failed:', err);
        if (alive) setMirrorStatus(statusFromError(err));
      });
    return () => { alive = false; };
  }, [isHostOnline]);

  useEffect(() => {
    if (isHostOnline) {
      sdk.invoke('vault.sandbox.ensure', {})
        .then((sb: any) => {
          if (sb && sb.vault) {
            setVaultId(sb.vault);
            console.log("Vault sandbox ensured:", sb.vault);
            sdk.invoke('vault.sandbox.describeTile', {
              icon: '🏝️',
              metrics: [
                { label: 'Contacts', spine: 'SOCIAL_CONTACT' },
                { label: 'Faits', spine: 'SOCIAL_NODE' },
              ]
            }).catch(tileErr => {
              console.error("Failed to describe vault tile:", tileErr);
            });
          }
        })
        .catch((err: any) => {
          console.error("Failed to ensure vault sandbox:", err);
        });
    }
  }, [isHostOnline]); 

  useEffect(() => {
    let raw: string | null = null;
    try { raw = localStorage.getItem(CONTACTS_KEY); }
    catch (err) { console.error('[CONTACTS] storage unreadable:', err); setContactsLoad('unreadable'); return; }
    const read = readContactsRaw(raw);
    if (read.kind === 'unreadable') {
      // Kept aside before anything can overwrite it: the next save would
      // replace the only copy of a list someone may still recover.
      // Once it is aside, the key is cleared so the host mirror, if it holds
      // a readable list, restores it on this same boot.
      try {
        localStorage.setItem(`${CONTACTS_KEY}_unreadable_${Date.now()}`, raw ?? '');
        localStorage.removeItem(CONTACTS_KEY);
        console.error('[CONTACTS] the stored list is not readable JSON; it was set aside');
      } catch (err) {
        console.error('[CONTACTS] could not set the unreadable list aside:', err);
      }
      setContactsLoad('unreadable');
      return;
    }
    setContacts(read.kind === 'list' ? JSON.parse(raw as string) : []);
    setContactsLoad('ok');
  }, []);

  // Close the context menu on an outside click, or when this cartridge
  // loses focus.
  //
  // 🪤 A press on the HOST plane never reaches this document at all: we run
  // in an iframe, so that event belongs to the host page, not to us. No event
  // type fixes that (pointerdown included) — the only signal that crosses the
  // boundary is this window losing focus, which is exactly what the host shell
  // already does for its own menus.
  useEffect(() => {
    const closeMenu = () => setContextMenu(prev => prev.visible ? { ...prev, visible: false } : prev);
    window.addEventListener('click', closeMenu);
    window.addEventListener('blur', closeMenu);
    return () => {
      window.removeEventListener('click', closeMenu);
      window.removeEventListener('blur', closeMenu);
    };
  }, []);

  const persistContacts = (updated: Contact[]) => {
    setContacts(updated);
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(updated));
  };

  // ── Mnemosyne anchoring — sync contacts into the app's sandbox vault ──────
  // Each contact becomes one SOCIAL_CONTACT chronicle (the vault tile counts
  // them). Idempotent: a profile-content hash per contact skips unchanged
  // ones, and the host dedups identical content by SHA-256 anyway.

  /** Stable, self-contained profile text (volatile fields excluded). */
  const contactChronicle = (c: Contact): string => {
    const parts = [`Contact: ${c.name}.`];
    if (c.relations?.length) parts.push(`Relations: ${c.relations.join(', ')}.`);
    if (c.email) parts.push(`Email: ${c.email}.`);
    if (c.phone) parts.push(`Phone: ${c.phone}.`);
    if (c.address) parts.push(`Address: ${c.address}.`);
    const socials = c.socials ? Object.entries(c.socials).filter(([, v]) => v) : [];
    if (socials.length) parts.push(`Socials: ${socials.map(([k, v]) => `${k}: ${v}`).join(', ')}.`);
    if (c.facts?.length) parts.push(`Facts: ${c.facts.join(' | ')}`);
    return parts.join(' ');
  };

  const hashString = (s: string): string => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  };

  const syncContactsToVault = async (list: Contact[], vault: string) => {
    // Keyed PER VAULT: renaming the pluginId creates a fresh sandbox, and a
    // global map would wrongly skip contacts already anchored elsewhere.
    const syncedKey = `archipel_synced_v1:${vault}`;
    let synced: Record<string, string> = {};
    try { synced = JSON.parse(localStorage.getItem(syncedKey) || '{}'); }
    catch { synced = {}; }

    let pushed = 0;
    for (const c of list) {
      const content = contactChronicle(c);
      const h = hashString(content);
      if (synced[c.id] === h) continue;
      try {
        await sdk.socialIngest(vault, content, 'SOCIAL_CONTACT');
        synced[c.id] = h;
        pushed++;
      } catch (err) {
        console.error(`[SYNC] Failed to anchor contact "${c.name}":`, err);
      }
    }
    if (pushed > 0) {
      localStorage.setItem(syncedKey, JSON.stringify(synced));
      console.log(`[SYNC] ${pushed} contact(s) anchored into ${vault}`);
    }
  };

  // Auto-anchor: runs once the sandbox vault is ensured, then on every
  // contact change (new/edited profiles only, thanks to the hash map).
  useEffect(() => {
    if (!isHostOnline || !vaultId.startsWith('APP-') || contacts.length === 0) return;
    void syncContactsToVault(contacts, vaultId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHostOnline, vaultId, contacts]);

  // Mirror, write half. Runs only once the boot half has read the host copy,
  // then after every change, debounced. The snapshot is read from
  // localStorage, which every setter writes synchronously before rendering.
  useEffect(() => {
    if (!mirrorReady) return;
    const timer = setTimeout(() => {
      sdk.invoke<{ updatedAt?: string }>('state.set', { state: { snapshot: snapshotLocal() } })
        .then(res => setMirrorStatus({ kind: 'saved', at: res?.updatedAt ?? new Date().toISOString() }))
        .catch(err => {
          console.error('[MIRROR] write failed:', err);
          setMirrorStatus(statusFromError(err));
        });
    }, MIRROR_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [
    mirrorReady,
    contacts,
    settings.userProfile,
    settings.notificationSettings,
    settings.customCategories,
    settings.customWidgetDefs,
    settings.theme,
    settings.globalAvatarStyle,
    settings.langPreference,
  ]);

  // CRUD handlers
  const handleAddContact = (
    name: string,
    relations: string[],
    avatar: string,
    fact: string,
    avatarConfig?: AvatarStudioConfig,
    email?: string,
    phone?: string,
    address?: string,
    socials?: Record<string, string>
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const newC: Contact = {
      id: Math.random().toString(36).substring(7),
      name,
      relations,
      status: 'active',
      lastContact: today,
      warmth: 100,
      avatar,
      avatarConfig,
      email,
      phone,
      address,
      socials,
      facts: fact ? [fact] : [],
      mood: 'neutral',
      mementos: [{ 
        date: today, 
        note: settings.activeLang === 'fr' 
          ? `Ancrage du profil de ${name} dans l'Archipel.` 
          : settings.activeLang === 'es'
            ? `Perfil de ${name} anclado en el Archipiélago.`
            : `Anchored the profile of ${name} in the Archipel.`
      }],
      categoryHistory: relations.map(cat => ({ date: today, category: cat, action: 'added' }))
    };
    const updated = [newC, ...contacts];
    persistContacts(updated);
    setSelectedContact(newC);
  };

  const handleDeleteContact = (contactId: string) => {
    const updated = contacts.filter(c => c.id !== contactId);
    persistContacts(updated);
    if (selectedContact?.id === contactId) {
      setSelectedContact(null);
    }
  };

  const handleSaveAvatar = (contactId: string, config: AvatarStudioConfig | undefined, emoji?: string) => {
    const updated = contacts.map(c => {
      if (c.id === contactId) {
        const newContact = { ...c, avatarConfig: config, avatar: config ? '🤖' : (emoji || c.avatar || '👤') };
        if (selectedContact?.id === contactId) {
          setSelectedContact(newContact);
        }
        return newContact;
      }
      return c;
    });
    persistContacts(updated);
  };

  const handleSimulateContact = (contactId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = contacts.map(c => {
      if (c.id === contactId) {
        const warmth = Math.min(100, c.warmth + 15);
        const status = warmth > 70 ? 'active' : warmth > 35 ? 'warm' : 'dormant';
        const mementos = [{ date: today, note: `Rencontre ou contact enregistré.` }, ...c.mementos];
        const newContact: Contact = { ...c, warmth, status, mementos, lastContact: today };
        if (selectedContact?.id === contactId) {
          setSelectedContact(newContact);
        }
        return newContact;
      }
      return c;
    });
    persistContacts(updated);
  };

  const handleAddFact = (fact: string) => {
    if (!factTargetContact || !fact.trim()) return;
    const updated = contacts.map(c => {
      if (c.id === factTargetContact.id) {
        const facts = [...c.facts];
        if (!facts.includes(fact)) facts.push(fact);
        const newContact = { ...c, facts };
        if (selectedContact?.id === c.id) {
          setSelectedContact(newContact);
        }
        return newContact;
      }
      return c;
    });
    persistContacts(updated);
  };

  // Category selection handlers in details sidebar
  const handleAddCategoryToContact = (contactId: string, category: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = contacts.map(c => {
      if (c.id === contactId) {
        const relations = [...c.relations];
        if (!relations.includes(category)) relations.push(category);
        const history = c.categoryHistory ? [...c.categoryHistory] : [];
        history.push({ date: today, category, action: 'added' });
        const newContact = { ...c, relations, categoryHistory: history };
        if (selectedContact?.id === contactId) {
          setSelectedContact(newContact);
        }
        return newContact;
      }
      return c;
    });
    persistContacts(updated);
  };

  const handleRemoveCategoryFromContact = (contactId: string, category: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = contacts.map(c => {
      if (c.id === contactId) {
        const relations = c.relations.filter(r => r !== category);
        const history = c.categoryHistory ? [...c.categoryHistory] : [];
        history.push({ date: today, category, action: 'removed' });
        const newContact = { ...c, relations, categoryHistory: history };
        if (selectedContact?.id === contactId) {
          setSelectedContact(newContact);
        }
        return newContact;
      }
      return c;
    });
    persistContacts(updated);
  };

  // Sidebar social updates
  const handleUpdateSocial = (contactId: string, key: string, value: string) => {
    const updated = contacts.map(c => {
      if (c.id === contactId) {
        const socials = { ...c.socials, [key]: value };
        const newContact = { ...c, socials };
        if (selectedContact?.id === contactId) {
          setSelectedContact(newContact);
        }
        return newContact;
      }
      return c;
    });
    persistContacts(updated);
  };

  const handleRemoveSocial = (contactId: string, key: string) => {
    const updated = contacts.map(c => {
      if (c.id === contactId) {
        const socials = { ...c.socials };
        delete socials[key];
        const newContact = { ...c, socials };
        if (selectedContact?.id === contactId) {
          setSelectedContact(newContact);
        }
        return newContact;
      }
      return c;
    });
    persistContacts(updated);
  };

  const handleAddSocialKey = (contactId: string, key: string) => {
    handleUpdateSocial(contactId, key, '');
  };

  // Brain Dump distillation
  const handleBrainDump = async () => {
    if (!brainDump.trim()) return;
    setIsExtracting(true);
    setExtractionResult(null);
    setErrorMsg('');

    const systemPrompt = `You are the cognitive memory assistant of Mnemosyne OS.
Analyze the following interaction memo. Identify the person and extract concrete facts.
Reply in STRICT JSON: { "name": "Firstname", "facts": ["fact 1", "fact 2"], "mood": "happy/inspired/tired/stressed/neutral" }`;

    try {
      let parsedResult: any = null;
      if (isHostOnline) {
        const response = await sdk.inferModel({ prompt: brainDump, systemPrompt, temperature: 0.3 });
        const cleanText = (response.text || response.response || '').trim();
        parsedResult = JSON.parse(cleanText.replace(/```json/g, '').replace(/```/g, ''));
      } else {
        await new Promise(resolve => setTimeout(resolve, 1200));
        const text = brainDump.toLowerCase();
        let name = text.includes("lea") ? "Lea Bernard" : text.includes("antoine") ? "Antoine Morel" : "New Contact";
        let facts = ["Discussed plans during a casual talk."];
        let mood = text.includes("tired") ? "tired" : text.includes("happy") ? "happy" : "neutral";
        parsedResult = { name, facts, mood };
      }

      if (parsedResult && parsedResult.name) {
        const existingIndex = contacts.findIndex(c => c.name.toLowerCase().includes(parsedResult.name.toLowerCase()));
        let updated = [...contacts];
        const today = new Date().toISOString().split('T')[0];

        if (existingIndex > -1) {
          const target = contacts[existingIndex];
          const newFacts = Array.from(new Set([...target.facts, ...parsedResult.facts]));
          const updatedContact: Contact = {
            ...target,
            facts: newFacts,
            mood: parsedResult.mood,
            lastContact: today,
            warmth: 100,
            status: 'active',
            mementos: [{ date: today, note: `Distilled from brain dump: ${brainDump}` }, ...target.mementos]
          };
          updated[existingIndex] = updatedContact;
          setSelectedContact(updatedContact);
        } else {
          const newC: Contact = {
            id: Math.random().toString(36).substring(7),
            name: parsedResult.name,
            relations: ['Friend'],
            status: 'active',
            lastContact: today,
            warmth: 100,
            avatar: '🤖',
            avatarConfig: getRandomAvatarConfig(),
            facts: parsedResult.facts,
            mood: parsedResult.mood,
            mementos: [{ date: today, note: `Profile created from dump: ${brainDump}` }]
          };
          updated = [newC, ...updated];
          setSelectedContact(newC);
        }
        persistContacts(updated);
        setBrainDump('');

        // Ingest into local LevelDB vault asynchronously
        if (isHostOnline && parsedResult.facts && parsedResult.facts.length > 0) {
          Promise.all(
            parsedResult.facts.map((fact: string) => 
              sdk.socialIngest(vaultId, `Contact: ${parsedResult.name}. Fact: ${fact}`)
            )
          ).catch(err => {
            console.error("Failed to ingest facts into social vault:", err);
          });
        }
      }
    } catch (err: any) {
      setErrorMsg(`Distillation error: ${err.message || 'Invalid format.'}`);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setRagAnswer(null);
    setErrorMsg('');

    try {
      if (isHostOnline) {
        const res = await sdk.query(searchQuery);
        setRagAnswer(res.text || res.response || JSON.stringify(res));
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        const query = searchQuery.toLowerCase();
        const matched = contacts.filter(c => 
          c.facts.some(f => f.toLowerCase().includes(query)) ||
          c.name.toLowerCase().includes(query)
        );

        if (matched.length > 0) {
          const list = matched.map(c => `- **${c.name}** : ${c.facts.find(f => f.toLowerCase().includes(query)) || c.facts[0]}`).join('\n');
          setRagAnswer(`🔍 **[RAG SIMULATION]** Match found:\n\n${list}`);
        } else {
          setRagAnswer(`🔍 **[RAG SIMULATION]** No matching relations for "${searchQuery}".`);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  // Demo management
  const handleLoadDemoData = () => {
    setConfirmDialog({
      visible: true,
      title: "Load Demo Data",
      message: "Are you sure you want to load 50 demo contacts? This will replace your current contacts list.",
      onConfirm: () => {
        const mockWithAvatars = generate50DemoContacts(settings.activeLang);
        persistContacts(mockWithAvatars);
        setSelectedContact(null);
        setConfirmDialog(null);
      }
    });
  };
  
  const handlePurgeAllData = () => {
    setConfirmDialog({
      visible: true,
      title: "Purge All Data",
      message: "Are you sure you want to purge all contacts? This action cannot be undone.",
      onConfirm: () => {
        persistContacts([]);
        setSelectedContact(null);
        setConfirmDialog(null);
        // 🚨 Written NOW, not after the debounce: a window closed within a
        // second of the purge would leave a full mirror behind, and the next
        // boot on a blank origin would bring every purged contact back.
        if (mirrorReady) {
          sdk.invoke<{ updatedAt?: string }>('state.set', { state: { snapshot: snapshotLocal() } })
            .then(res => setMirrorStatus({ kind: 'saved', at: res?.updatedAt ?? new Date().toISOString() }))
            .catch(err => {
              console.error('[MIRROR] purge write failed:', err);
              setMirrorStatus(statusFromError(err));
            });
        }
      }
    });
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    const updated = contacts.map(c => c.id === updatedContact.id ? updatedContact : c);
    persistContacts(updated);
    if (selectedContact?.id === updatedContact.id) {
      setSelectedContact(updatedContact);
    }
  };

  // Import / Export Systems
  const handleImportContacts = (fileContent: string, fileName: string): boolean => {
    const updated = importDetectFormat(contacts, fileContent, fileName);
    if (updated) {
      persistContacts(updated);
      return true;
    }
    return false;
  };

  const handleImportDatabase = (jsonDb: string): boolean => {
    const success = importDatabase(jsonDb, settings.handleUpdateUserProfile);
    if (success) {
      window.location.reload();
      return true;
    }
    return false;
  };

  const handleExportDatabase = () => {
    exportDatabase(
      contacts,
      settings.userProfile,
      settings.customCategories,
      settings.customWidgetDefs,
      settings.theme,
      settings.globalAvatarStyle
    );
  };

  // Dynamic alerts
  const notifications = calculateNotifications(contacts, settings.notificationSettings);

  return {
    ...settings,
    contacts,
    selectedContact,
    setSelectedContact,
    viewMode,
    setViewMode,
    activeFilter,
    setActiveFilter,
    contactsLoad,
    mirrorStatus,
    restoredAt,
    dismissRestored: () => setRestoredAt(null),
    showAddModal,
    setShowAddModal,
    showFactModal,
    setShowFactModal,
    factTargetContact,
    setFactTargetContact,
    contextMenu,
    setContextMenu,
    highlightedLink,
    setHighlightedLink,
    brainDump,
    setBrainDump,
    extractionResult,
    isExtracting,
    searchQuery,
    setSearchQuery,
    isSearching,
    ragAnswer,
    setRagAnswer,
    errorMsg,
    isHostOnline,
    handleAddContact,
    handleDeleteContact,
    handleSaveAvatar,
    handleSimulateContact,
    handleAddFact,
    handleAddCategoryToContact,
    handleRemoveCategoryFromContact,
    handleUpdateContact,
    handleUpdateSocial,
    handleRemoveSocial,
    handleAddSocialKey,
    handleBrainDump,
    handleSearch,
    handleLoadDemoData,
    handlePurgeAllData,
    confirmDialog,
    setConfirmDialog,
    handleImportContacts,
    handleImportDatabase,
    handleExportDatabase,
    notifications
  };
}
