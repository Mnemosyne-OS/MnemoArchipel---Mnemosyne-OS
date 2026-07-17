import { Contact, UserProfile, CustomCategory, CustomWidgetDef } from '../types';

/**
 * Handles database export by compiling JSON payload and initiating browser download.
 */
export function exportDatabase(
  contacts: Contact[],
  userProfile: UserProfile,
  customCategories: CustomCategory[],
  customWidgetDefs: CustomWidgetDef[],
  theme: 'light' | 'dark',
  globalAvatarStyle: 'human' | 'magical'
) {
  const payload = {
    contacts,
    userProfile,
    customCategories,
    customWidgetDefs,
    theme,
    globalAvatarStyle
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `larchipel_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Parses and merges imported contacts list.
 */
export function importContacts(contacts: Contact[], jsonData: string): Contact[] | null {
  try {
    const imported = JSON.parse(jsonData);
    if (Array.isArray(imported)) {
      const updated = [...contacts];
      imported.forEach((newC: any) => {
        if (newC && newC.id && newC.name) {
          const idx = updated.findIndex(c => c.id === newC.id);
          if (idx !== -1) {
            updated[idx] = { ...updated[idx], ...newC };
          } else {
            updated.push(newC);
          }
        }
      });
      return updated;
    }
  } catch (err) {
    console.error("Failed to parse contacts JSON:", err);
  }
  return null;
}

/**
 * Parses full database file content and updates local storage.
 */
export function importDatabase(
  jsonDb: string,
  updateUserProfile: (profile: UserProfile) => void
): boolean {
  try {
    const payload = JSON.parse(jsonDb);
    if (payload.contacts && Array.isArray(payload.contacts)) {
      localStorage.setItem('archipel_contacts', JSON.stringify(payload.contacts));
    }
    if (payload.userProfile) {
      updateUserProfile(payload.userProfile);
    }
    if (payload.customCategories && Array.isArray(payload.customCategories)) {
      localStorage.setItem('crm_custom_categories', JSON.stringify(payload.customCategories));
    }
    if (payload.customWidgetDefs && Array.isArray(payload.customWidgetDefs)) {
      localStorage.setItem('crm_custom_widget_defs', JSON.stringify(payload.customWidgetDefs));
    }
    if (payload.theme) {
      localStorage.setItem('crm_theme', payload.theme);
    }
    if (payload.globalAvatarStyle) {
      localStorage.setItem('crm_avatar_style', payload.globalAvatarStyle);
    }
    return true;
  } catch (err) {
    console.error("Failed to parse database backup:", err);
  }
  return false;
}

/**
 * Parses Apple/Android vCard VCF contacts.
 */
export function parseVcard(vcardText: string): Contact[] {
  const contacts: Contact[] = [];
  const cards = vcardText.split(/BEGIN:VCARD/i);
  
  cards.forEach(card => {
    if (!card.trim() || !card.includes('END:VCARD')) return;
    
    let name = 'Contact Importé';
    let email = '';
    let phone = '';
    let address = '';
    const facts: string[] = [];
    const importantDates: Array<{ date: string; label: string }> = [];
    
    const lines = card.split(/\r?\n/);
    lines.forEach(line => {
      const match = line.match(/^([^:;]+)(?:;[^:]*)?:(.*)$/);
      if (!match) return;
      const key = match[1].trim().toUpperCase();
      const val = match[2].trim();
      
      if (key === 'FN') {
        name = val;
      } else if (key === 'EMAIL') {
        email = val;
      } else if (key === 'TEL') {
        phone = val;
      } else if (key === 'ADR') {
        address = val.replace(/;/g, ' ').replace(/\s+/g, ' ').trim();
      } else if (key === 'NOTE') {
        facts.push(val);
      } else if (key === 'BDAY') {
        importantDates.push({ date: val, label: 'Anniversaire' });
      }
    });

    const id = 'import_vc_' + Math.random().toString(36).substr(2, 9);
    
    contacts.push({
      id,
      name,
      avatar: '👤',
      relations: ['Friend'],
      status: 'warm',
      warmth: 80,
      lastContact: new Date().toISOString().split('T')[0],
      facts,
      email: email || undefined,
      phone: phone || undefined,
      address: address || undefined,
      importantDates,
      tasks: [],
      mood: 'neutral',
      mementos: []
    });
  });
  
  return contacts;
}

/**
 * Parses generic Google/Outlook CSV contacts files.
 */
export function parseCsvContacts(csvText: string): Contact[] {
  const contacts: Contact[] = [];
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];
  
  const separator = csvText.includes(';') ? ';' : csvText.includes('\t') ? '\t' : ',';
  const header = lines[0].split(separator).map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
  
  const nameIdx = header.findIndex(h => h.includes('name') || h === 'nom' || h === 'fn' || h.includes('display'));
  const emailIdx = header.findIndex(h => h.includes('email') || h.includes('e-mail') || h === 'mail' || h.includes('valeur'));
  const phoneIdx = header.findIndex(h => h.includes('phone') || h.includes('téléphone') || h === 'tel');
  const addressIdx = header.findIndex(h => h.includes('address') || h === 'adresse' || h === 'adr');
  const notesIdx = header.findIndex(h => h.includes('notes') || h.includes('note') || h === 'bio' || h.includes('fact'));
  const bdayIdx = header.findIndex(h => h.includes('birthday') || h.includes('anniversaire') || h === 'bday');

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values: string[] = [];
    let insideQuote = false;
    let currentVal = '';
    
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === separator && !insideQuote) {
        values.push(currentVal.trim().replace(/^["']|["']$/g, ''));
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim().replace(/^["']|["']$/g, ''));

    if (values.length === 0 || (nameIdx !== -1 && !values[nameIdx])) continue;
    
    const name = nameIdx !== -1 && values[nameIdx] ? values[nameIdx] : 'Contact CSV';
    const email = emailIdx !== -1 && values[emailIdx] ? values[emailIdx] : '';
    const phone = phoneIdx !== -1 && values[phoneIdx] ? values[phoneIdx] : '';
    const address = addressIdx !== -1 && values[addressIdx] ? values[addressIdx] : '';
    const note = notesIdx !== -1 && values[notesIdx] ? values[notesIdx] : '';
    const bday = bdayIdx !== -1 && values[bdayIdx] ? values[bdayIdx] : '';
    
    const id = 'import_csv_' + Math.random().toString(36).substr(2, 9);
    const facts = note ? [note] : [];
    const importantDates = bday ? [{ date: bday, label: 'Anniversaire' }] : [];
    
    contacts.push({
      id,
      name,
      avatar: '👤',
      relations: ['Friend'],
      status: 'warm',
      warmth: 80,
      lastContact: new Date().toISOString().split('T')[0],
      facts,
      email: email || undefined,
      phone: phone || undefined,
      address: address || undefined,
      importantDates,
      tasks: [],
      mood: 'neutral',
      mementos: []
    });
  }
  
  return contacts;
}

/**
 * Automates file format detection and merges external contacts arrays.
 */
export function importDetectFormat(contacts: Contact[], fileContent: string, fileName: string): Contact[] | null {
  const nameLower = fileName.toLowerCase();
  
  if (nameLower.endsWith('.vcf') || fileContent.includes('BEGIN:VCARD')) {
    const parsed = parseVcard(fileContent);
    if (parsed.length > 0) {
      const updated = [...contacts];
      parsed.forEach(c => updated.push(c));
      return updated;
    }
  }

  if (nameLower.endsWith('.csv') || (!fileContent.startsWith('{') && fileContent.includes('\n') && (fileContent.includes(',') || fileContent.includes(';')))) {
    const parsed = parseCsvContacts(fileContent);
    if (parsed.length > 0) {
      const updated = [...contacts];
      parsed.forEach(c => updated.push(c));
      return updated;
    }
  }

  try {
    const parsed = JSON.parse(fileContent);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.contacts) {
      const updated = [...contacts];
      parsed.contacts.forEach((newC: any) => {
        if (newC && newC.id && newC.name) {
          const idx = updated.findIndex(c => c.id === newC.id);
          if (idx !== -1) {
            updated[idx] = { ...updated[idx], ...newC };
          } else {
            updated.push(newC);
          }
        }
      });
      return updated;
    }
    if (Array.isArray(parsed)) {
      const updated = [...contacts];
      parsed.forEach((newC: any) => {
        if (newC && newC.id && newC.name) {
          const idx = updated.findIndex(c => c.id === newC.id);
          if (idx !== -1) {
            updated[idx] = { ...updated[idx], ...newC };
          } else {
            updated.push(newC);
          }
        }
      });
      return updated;
    }
  } catch (err) {
    // Ignore JSON error
  }
  
  return null;
}
