import { Contact, NotificationSettings, CrmNotification } from '../types';

/**
 * Calculates all pending notifications based on contact statuses, tasks, and calendar events.
 */
export function calculateNotifications(
  contacts: Contact[],
  settings: NotificationSettings
): CrmNotification[] {
  const notifications: CrmNotification[] = [];
  const today = new Date();

  contacts.forEach(contact => {
    // 1. Check Dormancy
    if (contact.lastContact) {
      const lastContactDate = new Date(contact.lastContact);
      const timeDiff = Math.abs(today.getTime() - lastContactDate.getTime());
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      let threshold = settings.warmThresholdDays;
      if (contact.status === 'active') {
        threshold = settings.activeThresholdDays;
      }

      if (daysDiff >= threshold) {
        notifications.push({
          id: `dormant-${contact.id}`,
          type: 'dormant',
          title: `Contact dormant : ${contact.name}`,
          message: `Dernier contact il y a ${daysDiff} jours (seuil : ${threshold} jours).`,
          contactId: contact.id
        });
      }
    }

    // 2. Check Upcoming Dates
    if (settings.enableDatesAlerts && contact.importantDates) {
      contact.importantDates.forEach((impDate, idx) => {
        if (!impDate.date) return;
        const dateObj = new Date(impDate.date);
        
        // Match month and day to see if it occurs in the next 30 days
        const eventThisYear = new Date(today.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        let diffTime = eventThisYear.getTime() - today.getTime();
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If event already passed this year, check next year
        if (diffDays < 0 && diffDays > -330) {
          const eventNextYear = new Date(today.getFullYear() + 1, dateObj.getMonth(), dateObj.getDate());
          diffTime = eventNextYear.getTime() - today.getTime();
          diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        if (diffDays >= 0 && diffDays <= 30) {
          notifications.push({
            id: `date-${contact.id}-${idx}`,
            type: 'date',
            title: `Événement : ${contact.name}`,
            message: `"${impDate.label}" arrive dans ${diffDays} jours (${impDate.date}).`,
            contactId: contact.id,
            dateString: impDate.date
          });
        }
      });
    }

    // 3. Check Pending Tasks
    if (settings.enableTasksAlerts && contact.tasks) {
      const pendingTasks = contact.tasks.filter(t => !t.completed);
      if (pendingTasks.length > 0) {
        notifications.push({
          id: `task-${contact.id}`,
          type: 'task',
          title: `Tâches en attente : ${contact.name}`,
          message: `Vous avez ${pendingTasks.length} tâche(s) non complétée(s) pour ce contact.`,
          contactId: contact.id
        });
      }
    }
  });

  return notifications;
}

/**
 * Generates an outreach draft assistant recommendation text.
 */
export function generateAiOutreachSuggestion(contact: Contact, lang: 'en' | 'fr' | 'es' = 'en'): string {
  const name = contact.name;
  const mood = contact.mood || 'neutral';
  const facts = contact.facts || [];
  const sampleFact = facts.length > 0 ? facts[0] : '';
  const firstName = name.split(' ')[0];
  
  if (lang === 'fr') {
    const moodPrompts: Record<string, string> = {
      happy: "a l'air en pleine forme et de bonne humeur ces temps-ci. Profites-en pour lui proposer un moment sympa.",
      tired: "semble un peu fatigué(e) récemment. Sois chaleureux et propose de l'aide ou un échange léger sans pression.",
      stressed: "vit une période stressante. Envoie un message de soutien court et encourageant.",
      inspired: "déborde d'idées et d'inspiration. C'est le moment parfait pour brainstormer ou parler de projets créatifs.",
      neutral: "est dans une période calme. Prends des nouvelles simples."
    };
    const selectedPrompt = moodPrompts[mood] || moodPrompts.neutral;
    let factIntegration = '';
    if (sampleFact) {
      factIntegration = ` Rappelle-toi qu'il/elle est intéressé(e) par : "${sampleFact}". Tu peux t'en servir pour lancer la discussion.`;
    }
    const generatedTemplate = `Hey ${firstName}, comment ça va ? J'espère que tu passes une bonne semaine. ${sampleFact ? `Je repensais à ce que tu m'avais dit sur "${sampleFact.toLowerCase().replace(/\.$/, '')}"...` : ''} On se fait un café ou un appel rapide à l'occasion ?`;
    return `**Conseil d'approche IA** : ${name} ${selectedPrompt}${factIntegration}\n\n**Exemple de message proposé :**\n*"${generatedTemplate}"*`;
  } else if (lang === 'es') {
    const moodPrompts: Record<string, string> = {
      happy: "parece estar en gran forma y de buen humor últimamente. Aprovecha para sugerir un buen momento juntos.",
      tired: "parece un poco cansado/a últimamente. Sé cálido y ofrece ayuda o una charla ligera sin presiones.",
      stressed: "está pasando por un período estresante. Envía un mensaje de apoyo corto y alentador.",
      inspired: "está lleno/a de ideas e inspiración. Es el momento perfecto para intercambiar ideas o hablar de proyectos creativos.",
      neutral: "está en un período tranquilo. Escríbele para saber cómo está."
    };
    const selectedPrompt = moodPrompts[mood] || moodPrompts.neutral;
    let factIntegration = '';
    if (sampleFact) {
      factIntegration = ` Recuerda que le interesa: "${sampleFact}". Puedes usar esto para iniciar la conversación.`;
    }
    const generatedTemplate = `Hola ${firstName}, ¿cómo vas? Espero que estés teniendo una buena semana. ${sampleFact ? `Estaba pensando en lo que mencionaste sobre "${sampleFact.toLowerCase().replace(/\.$/, '')}"...` : ''} ¿Nos tomamos un café o hacemos una llamada rápida cuando puedas?`;
    return `**Consejo de enfoque IA** : ${name} ${selectedPrompt}${factIntegration}\n\n**Ejemplo de mensaje propuesto :**\n*"${generatedTemplate}"*`;
  } else {
    const moodPrompts: Record<string, string> = {
      happy: "seems to be in great shape and good spirits lately. Take the opportunity to suggest hanging out.",
      tired: "seems a bit tired lately. Be warm and offer help or a low-pressure catch up.",
      stressed: "is going through a stressful period. Send a short, supportive, and encouraging message.",
      inspired: "is full of ideas and inspiration. Perfect time to brainstorm or talk about creative projects.",
      neutral: "is in a quiet period. Reach out for a simple check-in."
    };
    const selectedPrompt = moodPrompts[mood] || moodPrompts.neutral;
    let factIntegration = '';
    if (sampleFact) {
      factIntegration = ` Remember they are interested in: "${sampleFact}". You can use this to kickstart the conversation.`;
    }
    const generatedTemplate = `Hey ${firstName}, how's it going? Hope you're having a good week. ${sampleFact ? `I was thinking about what you mentioned regarding "${sampleFact.toLowerCase().replace(/\.$/, '')}"...` : ''} Let's grab coffee or jump on a quick call sometime?`;
    return `**AI Outreach Advice** : ${name} ${selectedPrompt}${factIntegration}\n\n**Proposed message template:**\n*"${generatedTemplate}"*`;
  }
}
