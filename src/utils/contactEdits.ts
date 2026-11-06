/**
 * contactEdits.ts — the edits a person's buttons make on one contact, shared
 * by those buttons and by the agent door (doc 149), so an agent's change is
 * the SAME change, never a second copy of the rule.
 *
 * Pure: each returns a new contact (or the same one when nothing changes).
 */
import type { Contact, ContactTask } from '../types';

/** « Add a fact »: appended once; a fact already there is not repeated. */
export function withFact(contact: Contact, fact: string): Contact {
  if (contact.facts.includes(fact)) return contact;
  return { ...contact, facts: [...contact.facts, fact] };
}

/** « Add » in the tasks widget: the task goes last. */
export function withTask(contact: Contact, task: ContactTask): Contact {
  return { ...contact, tasks: [...(contact.tasks || []), task] };
}

/** The task's checkbox: done ↔ not done. */
export function withTaskToggled(contact: Contact, taskId: string): Contact {
  const tasks = (contact.tasks || []).map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
  return { ...contact, tasks };
}
