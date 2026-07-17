export interface Memento {
  date: string;
  note: string;
}

export interface CategoryHistoryEntry {
  date: string;
  category: string;
  action: 'added' | 'removed';
}

export interface JournalEntry {
  date: string;
  text: string;
}

export interface CustomCategory {
  key: string;
  label: string;
  color: string;
}

export interface AvatarStudioConfig {
  body: number;
  color: string;
  eyes: number;
  nose: number;
  mouth: number;
  hat: number;
  accessories?: number[];
  
  // Custom sliders
  eyeSize?: number;
  eyeSpacing?: number;
  eyeY?: number;
  eyeColor?: string;
  eyeAngle?: number;
  pupilSize?: number;
  eyebrows?: number;
  eyebrowY?: number;
  eyebrowAngle?: number;
  eyelashes?: number;
  mouthScale?: number;
  mouthY?: number;
  blushScale?: number;
}

export interface Pet {
  name: string;
  type: string;
  age?: string;
  breed?: string;
}

export interface ImportantDate {
  date: string;
  label: string;
}

export interface Gift {
  id: string;
  idea: string;
  status: 'idea' | 'given';
  date?: string;
}

export interface ContactTask {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

export interface Debt {
  id: string;
  amount: number;
  type: 'owe' | 'owed'; // 'owe' = we owe them, 'owed' = they owe us
  description: string;
  settled: boolean;
  date: string;
}

export interface ContactConnection {
  targetId: string;
  type: string;
}

export interface CustomWidgetField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean';
}

export interface CustomWidgetDef {
  id: string;
  name: string;
  fields: CustomWidgetField[];
}

export interface Contact {
  id: string;
  name: string;
  relations: string[];
  status: 'active' | 'warm' | 'dormant';
  lastContact: string;
  warmth: number;
  avatar: string;
  facts: string[];
  mood: string;
  mementos: Memento[];
  categoryHistory?: CategoryHistoryEntry[];
  email?: string;
  phone?: string;
  address?: string;
  personalJournal?: JournalEntry[];
  socials?: Record<string, string>;
  avatarConfig?: AvatarStudioConfig;
  pets?: Pet[];
  importantDates?: ImportantDate[];
  gifts?: Gift[];
  tasks?: ContactTask[];
  debts?: Debt[];
  connections?: ContactConnection[];
  customWidgetData?: Record<string, Record<string, string | number | boolean>>;
}

export interface PhysicsNode {
  id: string;
  name: string;
  avatar: string;
  status: string;
  warmth: number;
  relations: string[];
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  avatarConfig?: AvatarStudioConfig;
  connections?: ContactConnection[];
}

export interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatarConfig?: AvatarStudioConfig;
}

export interface NotificationSettings {
  activeThresholdDays: number;
  warmThresholdDays: number;
  enableTasksAlerts: boolean;
  enableDatesAlerts: boolean;
}

export interface CrmNotification {
  id: string;
  type: 'dormant' | 'date' | 'task';
  title: string;
  message: string;
  contactId?: string;
  dateString?: string;
}

