import { AvatarStudioConfig, Contact } from '../types';

export const arraysEqual = (a: any[], b: any[]): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const getRandomAvatarConfig = (): AvatarStudioConfig => {
  const skinTones = ['#fcd34d', '#fdba74', '#b45309', '#ffedd5', '#fecdd3'];
  const eyeColors = ['#1e293b', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#db2777'];
  
  const numAccs = Math.floor(Math.random() * 6);
  const randomAccs: number[] = [];
  while (randomAccs.length < numAccs) {
    const id = Math.floor(Math.random() * 17);
    if (!randomAccs.includes(id)) {
      randomAccs.push(id);
    }
  }

  return {
    body: Math.floor(Math.random() * 5),
    color: skinTones[Math.floor(Math.random() * skinTones.length)],
    eyes: Math.floor(Math.random() * 4),
    nose: Math.floor(Math.random() * 4),
    mouth: Math.floor(Math.random() * 8),
    hat: Math.floor(Math.random() * 12),
    accessories: randomAccs,
    eyeSize: Number((0.7 + Math.random() * 0.8).toFixed(2)),
    eyeSpacing: Math.floor(8 + Math.random() * 10),
    eyeY: Math.floor(48 + Math.random() * 10),
    eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
    eyeAngle: Math.floor(-10 + Math.random() * 20),
    pupilSize: Number((0.6 + Math.random() * 0.9).toFixed(2)),
    eyebrows: Math.floor(Math.random() * 5),
    eyebrowY: Math.floor(36 + Math.random() * 12),
    eyebrowAngle: Math.floor(-15 + Math.random() * 30),
    eyelashes: Math.floor(Math.random() * 3),
    mouthScale: Number((0.7 + Math.random() * 0.8).toFixed(2)),
    mouthY: Math.floor(66 + Math.random() * 12),
    blushScale: Number((0.6 + Math.random() * 0.9).toFixed(2))
  };
};

export const createDemoContacts = (mockContacts: Contact[]): Contact[] => {
  return mockContacts.map(c => ({
    ...c,
    avatarConfig: getRandomAvatarConfig(),
    avatar: '🤖'
  }));
};

export const generate50DemoContacts = (lang: 'en' | 'fr' | 'es' = 'en'): Contact[] => {
  const firstNamesEn = [
    'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver', 'Sophia', 'Elijah', 'Isabella', 'James',
    'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Alexander', 'Harper', 'Mason', 'Evelyn', 'Michael',
    'Abigail', 'Ethan', 'Emily', 'Daniel', 'Elizabeth', 'Jacob', 'Sofia', 'Logan', 'Avery', 'Jackson',
    'Ella', 'Levi', 'Madison', 'Sebastian', 'Scarlett', 'Mateo', 'Victoria', 'Jack', 'Aria', 'Owen',
    'Grace', 'Theodore', 'Chloe', 'Aiden', 'Camila', 'Samuel', 'Penelope', 'Joseph', 'Riley', 'John'
  ];
  const lastNamesEn = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
    'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Martin', 'Lee',
    'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
    'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
    'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez'
  ];
  const mockFactsEn = [
    'Fascinated by modular synthesis and sound waves.',
    'Only drinks specialty coffee (Ethiopian origin preferred).',
    'Looking for a Product Designer role with environmental impact.',
    'Loves reading dystopian science fiction novels.',
    'Lead developer on Mnemosyne OS IPC.',
    'Training for a marathon in October 2026.',
    'Codes exclusively in Neovim with a custom setup.',
    'Just adopted a ginger kitten named Pixel.',
    'Downhill mountain biking every weekend.',
    'Wants to learn the Rust programming language.',
    'Sensitive to seasonal changes.',
    'Renowned researcher in Category Theory applied to AI.',
    'Only drinks high-altitude harvested Oolong tea.',
    'Lives and works between Lausanne and Paris.',
    'Always recommends complex epistemology books.'
  ];

  const firstNamesFr = [
    'Lucas', 'Emma', 'Louis', 'Jade', 'Gabriel', 'Louise', 'Arthur', 'Alice', 'Jules', 'Chloé',
    'Hugo', 'Lina', 'Maël', 'Sarah', 'Léo', 'Eva', 'Raphaël', 'Manon', 'Mathis', 'Zoé',
    'Thomas', 'Camille', 'Antoine', 'Léa', 'Maxime', 'Inès', 'Alexandre', 'Clara', 'Paul', 'Charlotte',
    'Valentin', 'Adèle', 'Clément', 'Jeanne', 'Julien', 'Margaux', 'Pierre', 'Juliette', 'Nicolas', 'Mathilde',
    'Benoît', 'Pauline', 'Guillaume', 'Lucie', 'Romain', 'Elise', 'Sébastien', 'Sophie', 'Olivier', 'Audrey'
  ];
  const lastNamesFr = [
    'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau',
    'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel',
    'Girard', 'Andre', 'Lefevre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'Francois', 'Martinez', 'Legrand',
    'Garnier', 'Faure', 'Rousseau', 'Blanc', 'Guerin', 'Muller', 'Henry', 'Roussel', 'Nicolas', 'Perrin',
    'Morin', 'Mathieu', 'Clement', 'Gauthier', 'Dumont', 'Brunet', 'Fontaine', 'Picard', 'Colin', 'Aubry'
  ];
  const mockFactsFr = [
    'Passionné par la synthèse modulaire et les ondes sonores.',
    'Ne boit que du café de spécialité (origine éthiopienne de préférence).',
    'Recherche un poste de Product Designer à impact environnemental.',
    'Adore lire des romans de science-fiction dystopiques.',
    'Développeur principal sur l\'IPC de Mnemosyne OS.',
    'S\'entraîne pour un marathon en octobre 2026.',
    'Code exclusivement sous Neovim avec une config personnalisée.',
    'Vient d\'adopter un chaton roux nommé Pixel.',
    'Fait du VTT de descente tous les week-ends.',
    'Souhaite apprendre le langage de programmation Rust.',
    'Très sensible aux changements de saison.',
    'Chercheur renommé en Théorie des Catégories appliquée à l\'IA.',
    'Ne boit que du thé Oolong récolté en haute altitude.',
    'Vit et travaille entre Lausanne et Paris.',
    'Recommande toujours des livres d\'épistémologie complexes.'
  ];

  const firstNamesEs = [
    'Mateo', 'Sofía', 'Santiago', 'Valentina', 'Matías', 'Isabella', 'Sebastián', 'Camila', 'Alejandro', 'Valeria',
    'Diego', 'Mariana', 'Samuel', 'Gabriela', 'Nicolás', 'Sara', 'Daniel', 'Victoria', 'Joaquín', 'Lucía',
    'Lucas', 'Catalina', 'Tomas', 'Elena', 'Benjamín', 'Emilia', 'Emiliano', 'Paula', 'Andrés', 'Martina',
    'Felipe', 'Julia', 'Ignacio', 'Natalia', 'Bruno', 'Carmen', 'David', 'Adriana', 'Ángel', 'Daniela',
    'Javier', 'Clara', 'Francisco', 'Irene', 'Carlos', 'Beatriz', 'Manuel', 'Gloria', 'Luis', 'Rosa'
  ];
  const lastNamesEs = [
    'García', 'Martínez', 'Rodríguez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Flores', 'Gómez',
    'Díaz', 'Morales', 'Reyes', 'Ortiz', 'Torres', 'Gutiérrez', 'Castro', 'Ruiz', 'Álvarez', 'Jiménez',
    'Muñoz', 'Herrera', 'Medina', 'Vargas', 'Ramos', 'Guzmán', 'Velásquez', 'Salazar', 'Rojas', 'Ortega',
    'Guerrero', 'Mendoza', 'Cortés', 'Bustos', 'Maldonado', 'Vega', 'Miranda', 'Suárez', 'Cabrera', 'Navarro',
    'Aguilera', 'Valenzuela', 'Silva', 'Cárdenas', 'Tapia', 'Lara', 'Vera', 'Farías', 'Soto', 'Carrasco'
  ];
  const mockFactsEs = [
    'Fascinado por la síntesis modular y las ondas sonoras.',
    'Solo toma café de especialidad (prefiere origen etíope).',
    'Busca un puesto de Diseñador de Producto con impacto ambiental.',
    'Le encanta leer novelas de ciencia ficción distópica.',
    'Desarrollador principal del IPC de Mnemosyne OS.',
    'Entrenando para un maratón en octubre de 2026.',
    'Programa exclusivamente en Neovim con configuración personalizada.',
    'Acaba de adoptar un gatito pelirrojo llamado Pixel.',
    'Ciclismo de montaña de descenso todos los fines de semana.',
    'Quiere aprender el lenguaje de programación Rust.',
    'Sensible a los cambios estacionales.',
    'Investigador renombrado en Teoría de Categorías aplicada a la IA.',
    'Solo bebe té Oolong cosechado a gran altura.',
    'Vive y trabaja entre Lausana y París.',
    'Siempre recomienda libros complejos de epistemología.'
  ];

  const firstNames = lang === 'fr' ? firstNamesFr : lang === 'es' ? firstNamesEs : firstNamesEn;
  const lastNames = lang === 'fr' ? lastNamesFr : lang === 'es' ? lastNamesEs : lastNamesEn;
  const mockFacts = lang === 'fr' ? mockFactsFr : lang === 'es' ? mockFactsEs : mockFactsEn;

  const categories = ['Friend', 'Colleague', 'Family', 'Mentor'];
  const emojis = ['🦊', '🦁', '🐼', '🦄', '🐱', '🐶', '🐯', '🐰', '🐻', '🐨', '🐵', '🐸'];
  const moods = ['inspired', 'happy', 'neutral', 'tired', 'stressed'];
  const statuses: ('active' | 'warm' | 'dormant')[] = ['active', 'warm', 'dormant'];

  const contacts: Contact[] = [];
  for (let i = 0; i < 50; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const category = categories[i % categories.length];
    const emoji = emojis[i % emojis.length];
    const fact = mockFacts[i % mockFacts.length];
    const mood = moods[i % moods.length];
    const status = statuses[i % statuses.length];
    const warmth = Math.floor(20 + Math.random() * 80);
    const dateOffset = Math.floor(Math.random() * 30);
    const lastContact = new Date(Date.now() - dateOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Localized relations and comments
    let secondaryFact = `Is highly active in the ${category} circle.`;
    let mementoNote = `Interacted with ${fn} regarding recent updates.`;
    
    if (lang === 'fr') {
      const catFr = category === 'Friend' ? 'Ami' : category === 'Colleague' ? 'Collègue' : category === 'Family' ? 'Famille' : 'Mentor';
      secondaryFact = `Est très actif/ve au sein du cercle ${catFr}.`;
      mementoNote = `A échangé avec ${fn} à propos des dernières mises à jour.`;
    } else if (lang === 'es') {
      const catEs = category === 'Friend' ? 'Amigos' : category === 'Colleague' ? 'Colegas' : category === 'Family' ? 'Familia' : 'Mentores';
      secondaryFact = `Es muy activo/a en el círculo de ${catEs}.`;
      mementoNote = `Conversó con ${fn} sobre las últimas actualizaciones.`;
    }

    contacts.push({
      id: `demo-id-${i}`,
      name: `${fn} ${ln}`,
      relations: [category],
      status,
      lastContact,
      warmth,
      avatar: emoji,
      avatarConfig: getRandomAvatarConfig(),
      facts: [fact, secondaryFact],
      mood,
      mementos: [
        { date: lastContact, note: mementoNote }
      ]
    });
  }
  return contacts;
};

export const getLayoutPosition = (index: number, total: number, shape: 'sphere' | 'torus' | 'spiral' | 'dna') => {
  if (shape === 'torus') {
    const u = (index / total) * Math.PI * 2 * 3;
    const v = (index / total) * Math.PI * 2;
    const R = 110;
    const r = 35;
    return {
      x: (R + r * Math.cos(u)) * Math.cos(v),
      y: (R + r * Math.cos(u)) * Math.sin(v),
      z: r * Math.sin(u)
    };
  } else if (shape === 'spiral') {
    const theta = (index / total) * Math.PI * 2 * 4;
    const r = 40 + (index / total) * 70;
    const h = (index / total) * 180 - 90;
    return {
      x: r * Math.cos(theta),
      y: h,
      z: r * Math.sin(theta)
    };
  } else if (shape === 'dna') {
    const theta = (index / total) * Math.PI * 2 * 3;
    const r = 60;
    const h = (index / total) * 200 - 100;
    const angleOffset = (index % 2 === 0) ? 0 : Math.PI;
    return {
      x: r * Math.cos(theta + angleOffset),
      y: h,
      z: r * Math.sin(theta + angleOffset)
    };
  } else {
    // sphere (Fibonacci lattice)
    const phi = Math.acos((2 * index) / total - 1);
    const theta = Math.sqrt(total * Math.PI) * phi;
    const r = 100;
    return {
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi)
    };
  }
};

/**
 * Formats a relation tag, translating base categories and family sub-types.
 */
export function formatRelationTag(rel: string, t: (key: string) => string): string {
  if (rel.startsWith('Family (')) {
    const subtype = rel.substring(8, rel.length - 1);
    const translationKey = `family_${subtype.toLowerCase()}`;
    const translatedSubtype = t(translationKey) !== translationKey ? t(translationKey) : subtype;
    const relationFamily = t('relation_family') !== 'relation_family' ? t('relation_family') : 'Family';
    return `${relationFamily} (${translatedSubtype})`;
  }
  if (rel === 'Family') return t('relation_family') !== 'relation_family' ? t('relation_family') : 'Family';
  if (rel === 'Friend') return t('relation_friend') !== 'relation_friend' ? t('relation_friend') : 'Friend';
  if (rel === 'Colleague') return t('relation_colleague') !== 'relation_colleague' ? t('relation_colleague') : 'Colleague';
  if (rel === 'Mentor') return t('relation_mentor') !== 'relation_mentor' ? t('relation_mentor') : 'Mentor';
  return rel;
}
