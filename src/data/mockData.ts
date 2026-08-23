export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonSlide {
  id: string;
  title: string;
  content: string;
  emoji: string;
  fact?: string;
}

export interface Lesson {
  id: string;
  title: string;
  categoryId: string;
  difficulty: Difficulty;
  duration: number; // minutes
  xpReward: number;
  description: string;
  emoji: string;
  color: string; // tailwind gradient classes
  completed: boolean;
  slides: LessonSlide[];
  quiz: QuizQuestion[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  lessonsCount: number;
  gradient: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  emoji: string;
  difficulty: Difficulty;
  xpReward: number;
  coinReward: number;
  progress: number; // 0-100
  completed: boolean;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  date?: string;
  color: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  missions: number;
  impact: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface GardenItem {
  id: string;
  name: string;
  emoji: string;
  unlocked: boolean;
  category: 'tree' | 'flower' | 'animal' | 'decoration' | 'weather';
  description: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  emoji: string;
  cost: number;
  category: 'digital' | 'real' | 'badge';
  color: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  participants: number;
  daysLeft: number;
  xpReward: number;
  progress: number;
  joined: boolean;
  color: string;
}

export const categories: Category[] = [
  {
    id: 'climate',
    name: 'Climate Change',
    description: 'Understand how our planet is warming and what we can do',
    emoji: '🌍',
    color: 'coral',
    lessonsCount: 4,
    gradient: 'from-coral-400 to-sun-400',
  },
  {
    id: 'recycling',
    name: 'Recycling',
    description: 'Master the art of turning waste into resources',
    emoji: '♻️',
    color: 'leaf',
    lessonsCount: 4,
    gradient: 'from-leaf-400 to-lagoon-400',
  },
  {
    id: 'water',
    name: 'Water Conservation',
    description: 'Discover why every drop matters for our planet',
    emoji: '💧',
    color: 'lagoon',
    lessonsCount: 4,
    gradient: 'from-lagoon-400 to-sky2-400',
  },
  {
    id: 'wildlife',
    name: 'Wildlife',
    description: 'Explore the amazing animals we share Earth with',
    emoji: '🦋',
    color: 'sun',
    lessonsCount: 4,
    gradient: 'from-sun-400 to-coral-400',
  },
  {
    id: 'pollution',
    name: 'Pollution',
    description: 'Learn about pollution and how to fight it',
    emoji: '🌫️',
    color: 'lavender',
    lessonsCount: 4,
    gradient: 'from-lavender-400 to-lagoon-400',
  },
  {
    id: 'energy',
    name: 'Renewable Energy',
    description: 'Power the future with sun, wind, and water',
    emoji: '⚡',
    color: 'sky2',
    lessonsCount: 4,
    gradient: 'from-sky2-400 to-leaf-400',
  },
];

export const lessons: Lesson[] = [
  {
    id: 'climate-1',
    title: 'What is the Greenhouse Effect?',
    categoryId: 'climate',
    difficulty: 'Beginner',
    duration: 5,
    xpReward: 50,
    description: 'Discover how Earth stays warm and why too much warmth is a problem.',
    emoji: '🌡️',
    color: 'from-coral-400 to-sun-400',
    completed: true,
    slides: [
      {
        id: 's1',
        title: 'A Blanket Around Earth',
        content: 'Certain gases in our atmosphere act like a warm blanket, trapping heat and keeping our planet cozy. This is the greenhouse effect!',
        emoji: '🛏️',
        fact: 'Without the greenhouse effect, Earth would be about 33°C colder — too cold for most life!',
      },
      {
        id: 's2',
        title: 'The Main Players',
        content: 'Carbon dioxide, methane, and water vapor are the main greenhouse gases. They let sunlight in but slow down heat escaping.',
        emoji: '☁️',
      },
      {
        id: 's3',
        title: 'Too Much of a Good Thing',
        content: 'Burning fossil fuels adds extra greenhouse gases. More gases = thicker blanket = hotter planet. This is global warming.',
        emoji: '🔥',
        fact: 'CO₂ levels are now higher than any time in the last 800,000 years.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What do greenhouse gases do?',
        options: ['Cool the planet down', 'Trap heat like a blanket', 'Create oxygen', 'Make rain'],
        correctIndex: 1,
        explanation: 'Greenhouse gases trap heat in the atmosphere, keeping Earth warm — like a blanket!',
      },
      {
        id: 'q2',
        question: 'Which is a major greenhouse gas?',
        options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'],
        correctIndex: 2,
        explanation: 'Carbon dioxide (CO₂) is one of the most important greenhouse gases.',
      },
      {
        id: 'q3',
        question: 'What causes extra greenhouse gases?',
        options: ['Planting trees', 'Burning fossil fuels', 'Recycling', 'Walking to school'],
        correctIndex: 1,
        explanation: 'Burning fossil fuels like coal and oil releases extra CO₂ into the atmosphere.',
      },
    ],
  },
  {
    id: 'climate-2',
    title: 'Carbon Footprint Explained',
    categoryId: 'climate',
    difficulty: 'Intermediate',
    duration: 7,
    xpReward: 75,
    description: 'Learn how everyday choices create carbon emissions.',
    emoji: '👣',
    color: 'from-coral-400 to-sun-500',
    completed: true,
    slides: [
      {
        id: 's1',
        title: 'Your Carbon Footprint',
        content: 'Your carbon footprint is the total amount of greenhouse gases your actions produce, measured in CO₂ equivalent.',
        emoji: '👣',
        fact: 'The average person produces about 4 tons of CO₂ per year.',
      },
      {
        id: 's2',
        title: 'Big Contributors',
        content: 'Transportation, home energy use, and food choices are the biggest parts of most people\'s carbon footprint.',
        emoji: '🚗',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is a carbon footprint?',
        options: ['The size of your feet', 'Total greenhouse gases from your actions', 'Amount of carbon in your body', 'A type of shoe'],
        correctIndex: 1,
        explanation: 'A carbon footprint measures the total greenhouse gas emissions from your activities.',
      },
      {
        id: 'q2',
        question: 'Which contributes most to a typical carbon footprint?',
        options: ['Breathing', 'Using a phone', 'Transportation', 'Reading books'],
        correctIndex: 2,
        explanation: 'Transportation is one of the biggest contributors to most people\'s carbon footprint.',
      },
    ],
  },
  {
    id: 'climate-3',
    title: 'Extreme Weather Events',
    categoryId: 'climate',
    difficulty: 'Intermediate',
    duration: 8,
    xpReward: 80,
    description: 'How climate change fuels stronger storms, droughts, and heatwaves.',
    emoji: '🌪️',
    color: 'from-coral-500 to-lavender-400',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'A Warmer, Wilder World',
        content: 'As the planet warms, weather patterns become more extreme. Hotter days, heavier rain, and stronger storms.',
        emoji: '🌡️',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'How does climate change affect weather?',
        options: ['Makes it more extreme', 'Makes it always sunny', 'Stops rain forever', 'No effect'],
        correctIndex: 0,
        explanation: 'Climate change leads to more extreme and unpredictable weather events.',
      },
    ],
  },
  {
    id: 'climate-4',
    title: 'Climate Solutions',
    categoryId: 'climate',
    difficulty: 'Advanced',
    duration: 10,
    xpReward: 100,
    description: 'Explore the technologies and actions that can fight climate change.',
    emoji: '💡',
    color: 'from-sun-400 to-leaf-400',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Solutions Exist!',
        content: 'Renewable energy, reforestation, and sustainable transportation are key solutions to climate change.',
        emoji: '🌳',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which is a climate solution?',
        options: ['Burning more coal', 'Planting trees', 'Using more plastic', 'Cutting forests'],
        correctIndex: 1,
        explanation: 'Planting trees absorbs CO₂ and is an important climate solution.',
      },
    ],
  },
  {
    id: 'recycling-1',
    title: 'The 3 Rs: Reduce, Reuse, Recycle',
    categoryId: 'recycling',
    difficulty: 'Beginner',
    duration: 5,
    xpReward: 50,
    description: 'Learn the golden rules of waste management.',
    emoji: '♻️',
    color: 'from-leaf-400 to-lagoon-400',
    completed: true,
    slides: [
      {
        id: 's1',
        title: 'Reduce First!',
        content: 'The best waste is no waste. Reducing what we use is the most powerful of the 3 Rs.',
        emoji: '✂️',
        fact: 'Reducing is better than reusing, and reusing is better than recycling.',
      },
      {
        id: 's2',
        title: 'Reuse Creatively',
        content: 'Before throwing something away, ask: can I use this again? Glass jars, bags, and containers get second lives.',
        emoji: '🫙',
      },
      {
        id: 's3',
        title: 'Recycle Right',
        content: 'Recycling turns old materials into new products. But it only works if we sort correctly!',
        emoji: '♻️',
        fact: 'Recycling one aluminum can saves enough energy to run a TV for 3 hours.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which R should come first?',
        options: ['Recycle', 'Reuse', 'Reduce', 'Remove'],
        correctIndex: 2,
        explanation: 'Reduce comes first — preventing waste is better than managing it.',
      },
      {
        id: 'q2',
        question: 'Recycling one aluminum can saves enough energy to...',
        options: ['Charge a phone', 'Run a TV for 3 hours', 'Power a car', 'Light a match'],
        correctIndex: 1,
        explanation: 'Recycling one aluminum can saves enough energy to run a TV for 3 hours!',
      },
      {
        id: 'q3',
        question: 'What should you do before throwing away a glass jar?',
        options: ['Break it', 'Reuse it', 'Burn it', 'Bury it'],
        correctIndex: 1,
        explanation: 'Reusing items like glass jars gives them a second life before recycling.',
      },
    ],
  },
  {
    id: 'recycling-2',
    title: 'Plastic: The Good, Bad, and Ugly',
    categoryId: 'recycling',
    difficulty: 'Intermediate',
    duration: 7,
    xpReward: 75,
    description: 'Understand plastic pollution and how to tackle it.',
    emoji: '🥤',
    color: 'from-leaf-400 to-lagoon-500',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Plastic Everywhere',
        content: 'Plastic takes hundreds of years to break down. It fills our oceans and harms wildlife.',
        emoji: '🌊',
        fact: 'Over 8 million tons of plastic enter the ocean every year.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'How long does plastic take to break down?',
        options: ['A few days', 'A year', 'Hundreds of years', 'Never'],
        correctIndex: 2,
        explanation: 'Plastic can take hundreds of years to break down.',
      },
    ],
  },
  {
    id: 'recycling-3',
    title: 'Composting Magic',
    categoryId: 'recycling',
    difficulty: 'Beginner',
    duration: 6,
    xpReward: 60,
    description: 'Turn food scraps into garden gold.',
    emoji: '🌱',
    color: 'from-leaf-500 to-sun-400',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Nature\'s Recycling',
        content: 'Composting turns food scraps and yard waste into nutrient-rich soil.',
        emoji: '🪱',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What does composting create?',
        options: ['Trash', 'Nutrient-rich soil', 'Plastic', 'Gasoline'],
        correctIndex: 1,
        explanation: 'Composting creates nutrient-rich soil that helps plants grow.',
      },
    ],
  },
  {
    id: 'recycling-4',
    title: 'E-Waste and You',
    categoryId: 'recycling',
    difficulty: 'Advanced',
    duration: 9,
    xpReward: 90,
    description: 'How to handle old electronics responsibly.',
    emoji: '📱',
    color: 'from-lagoon-400 to-lavender-400',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'The E-Waste Problem',
        content: 'Old electronics contain valuable materials and toxic chemicals. They need special recycling.',
        emoji: '💻',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Why is e-wake special?',
        options: ['It\'s worth money', 'It contains toxic materials', 'It\'s heavier', 'It\'s colorful'],
        correctIndex: 1,
        explanation: 'E-waste contains toxic materials and should be recycled at special facilities.',
      },
    ],
  },
  {
    id: 'water-1',
    title: 'The Water Cycle',
    categoryId: 'water',
    difficulty: 'Beginner',
    duration: 5,
    xpReward: 50,
    description: 'Follow water on its endless journey around Earth.',
    emoji: '💧',
    color: 'from-lagoon-400 to-sky2-400',
    completed: true,
    slides: [
      {
        id: 's1',
        title: 'Water Never Disappears',
        content: 'Water evaporates, forms clouds, falls as rain, and flows back to the sea. It\'s a cycle!',
        emoji: '🔄',
        fact: 'The water you drink today may have been drunk by dinosaurs!',
      },
      {
        id: 's2',
        title: 'Evaporation & Condensation',
        content: 'The sun heats water until it turns into vapor (evaporation). Vapor cools and becomes clouds (condensation).',
        emoji: '☁️',
      },
      {
        id: 's3',
        title: 'Precipitation & Collection',
        content: 'Water falls as rain or snow, then collects in rivers, lakes, and oceans — ready to start again.',
        emoji: '🌧️',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is evaporation?',
        options: ['Water turning to vapor', 'Rain falling', 'Clouds forming', 'Ice melting'],
        correctIndex: 0,
        explanation: 'Evaporation is when water heats up and turns into vapor.',
      },
      {
        id: 'q2',
        question: 'What might the water you drink have done?',
        options: ['Been drunk by dinosaurs', 'Fallen as snow on Mars', 'Powered a spaceship', 'Been inside a volcano'],
        correctIndex: 0,
        explanation: 'Water cycles endlessly, so it could have been drunk by dinosaurs!',
      },
      {
        id: 'q3',
        question: 'What forms when water vapor cools?',
        options: ['Ice', 'Clouds', 'Rivers', 'Sand'],
        correctIndex: 1,
        explanation: 'When water vapor cools, it condenses into clouds.',
      },
    ],
  },
  {
    id: 'water-2',
    title: 'Saving Water at Home',
    categoryId: 'water',
    difficulty: 'Beginner',
    duration: 6,
    xpReward: 55,
    description: 'Simple actions that save thousands of gallons.',
    emoji: '🚿',
    color: 'from-lagoon-400 to-sky2-500',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Every Drop Counts',
        content: 'Shorter showers, fixing leaks, and turning off taps can save huge amounts of water.',
        emoji: '🚰',
        fact: 'A dripping faucet can waste over 3,000 gallons per year.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'How much can a dripping faucet waste?',
        options: ['10 gallons/year', '100 gallons/year', '3,000 gallons/year', 'No waste'],
        correctIndex: 2,
        explanation: 'A dripping faucet can waste over 3,000 gallons per year!',
      },
    ],
  },
  {
    id: 'water-3',
    title: 'The Ocean Crisis',
    categoryId: 'water',
    difficulty: 'Intermediate',
    duration: 8,
    xpReward: 80,
    description: 'Why our oceans are in trouble and how we can help.',
    emoji: '🌊',
    color: 'from-sky2-400 to-lagoon-500',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Oceans in Danger',
        content: 'Pollution, overfishing, and warming threaten ocean life that billions depend on.',
        emoji: '🐠',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What threatens ocean health?',
        options: ['Pollution and overfishing', 'Too many fish', 'Cold water', 'Whales'],
        correctIndex: 0,
        explanation: 'Pollution, overfishing, and warming are major threats to oceans.',
      },
    ],
  },
  {
    id: 'water-4',
    title: 'Water Scarcity',
    categoryId: 'water',
    difficulty: 'Advanced',
    duration: 10,
    xpReward: 100,
    description: 'Why 2 billion people lack safe water access.',
    emoji: '🏜️',
    color: 'from-sun-400 to-coral-400',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Not Enough for Everyone',
        content: 'Climate change and overuse create water scarcity. 2 billion people lack safely managed water.',
        emoji: '💧',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'How many people lack safe water?',
        options: ['1 million', '100 million', '2 billion', 'Everyone has water'],
        correctIndex: 2,
        explanation: 'About 2 billion people lack safely managed drinking water.',
      },
    ],
  },
  {
    id: 'wildlife-1',
    title: 'Meet the Pollinators',
    categoryId: 'wildlife',
    difficulty: 'Beginner',
    duration: 5,
    xpReward: 50,
    description: 'Discover the tiny creatures that feed the world.',
    emoji: '🐝',
    color: 'from-sun-400 to-coral-400',
    completed: true,
    slides: [
      {
        id: 's1',
        title: 'Tiny Heroes',
        content: 'Bees, butterflies, and hummingbirds pollinate plants. Without them, we wouldn\'t have most fruits!',
        emoji: '🐝',
        fact: 'Bees pollinate about 75% of the crops we eat.',
      },
      {
        id: 's2',
        title: 'Why They\'re Disappearing',
        content: 'Pesticides, habitat loss, and climate change are harming pollinators worldwide.',
        emoji: '🦋',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What do pollinators do?',
        options: ['Make honey only', 'Pollinate plants', 'Eat leaves', 'Build nests'],
        correctIndex: 1,
        explanation: 'Pollinators transfer pollen between plants, helping them produce fruits and seeds.',
      },
      {
        id: 'q2',
        question: 'What % of crops do bees pollinate?',
        options: ['10%', '25%', '75%', '100%'],
        correctIndex: 2,
        explanation: 'Bees pollinate about 75% of the crops we eat.',
      },
    ],
  },
  {
    id: 'wildlife-2',
    title: 'Endangered Species',
    categoryId: 'wildlife',
    difficulty: 'Intermediate',
    duration: 7,
    xpReward: 75,
    description: 'Animals at risk of disappearing forever.',
    emoji: '🐼',
    color: 'from-coral-400 to-lavender-400',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Vanishing Wonders',
        content: 'Over 40,000 species are threatened with extinction. Habitat loss and poaching are main causes.',
        emoji: '🦁',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'How many species are threatened?',
        options: ['100', '1,000', '40,000+', 'None'],
        correctIndex: 2,
        explanation: 'Over 40,000 species are threatened with extinction.',
      },
    ],
  },
  {
    id: 'wildlife-3',
    title: 'Coral Reefs',
    categoryId: 'wildlife',
    difficulty: 'Intermediate',
    duration: 8,
    xpReward: 80,
    description: 'The rainforests of the sea and their fight for survival.',
    emoji: '🪸',
    color: 'from-coral-400 to-lagoon-400',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Underwater Cities',
        content: 'Coral reefs cover less than 1% of the ocean floor but host 25% of all marine life.',
        emoji: '🐠',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What % of marine life lives in coral reefs?',
        options: ['1%', '5%', '25%', '90%'],
        correctIndex: 2,
        explanation: 'Coral reefs host about 25% of all marine life despite covering less than 1% of the ocean floor.',
      },
    ],
  },
  {
    id: 'wildlife-4',
    title: 'Protecting Biodiversity',
    categoryId: 'wildlife',
    difficulty: 'Advanced',
    duration: 10,
    xpReward: 100,
    description: 'How we can protect life on Earth.',
    emoji: '🌿',
    color: 'from-leaf-400 to-sun-400',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Biodiversity Matters',
        content: 'Biodiversity keeps ecosystems healthy. Each species plays a role — lose one and the system weakens.',
        emoji: '🌐',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Why does biodiversity matter?',
        options: ['It looks nice', 'Each species plays a role', 'It\'s expensive', 'No real reason'],
        correctIndex: 1,
        explanation: 'Each species plays a unique role in its ecosystem — losing one weakens the whole system.',
      },
    ],
  },
  {
    id: 'pollution-1',
    title: 'Air Pollution 101',
    categoryId: 'pollution',
    difficulty: 'Beginner',
    duration: 5,
    xpReward: 50,
    description: 'What\'s in the air we breathe?',
    emoji: '💨',
    color: 'from-lavender-400 to-lagoon-400',
    completed: true,
    slides: [
      {
        id: 's1',
        title: 'Invisible Danger',
        content: 'Air pollution comes from cars, factories, and burning fuels. It harms health and the planet.',
        emoji: '🏭',
        fact: 'Air pollution causes 7 million early deaths every year.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What causes air pollution?',
        options: ['Trees', 'Cars and factories', 'Rain', 'Wind'],
        correctIndex: 1,
        explanation: 'Cars, factories, and burning fuels are major sources of air pollution.',
      },
    ],
  },
  {
    id: 'pollution-2',
    title: 'Ocean Plastic',
    categoryId: 'pollution',
    difficulty: 'Intermediate',
    duration: 7,
    xpReward: 75,
    description: 'The plastic tide threatening our oceans.',
    emoji: '🗑️',
    color: 'from-lavender-400 to-sky2-400',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Plastic Oceans',
        content: 'There are estimated to be 5.25 trillion pieces of plastic debris in the ocean.',
        emoji: '🌊',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'How much plastic is in the ocean?',
        options: ['1 million pieces', '5 trillion pieces', 'None', '100 pieces'],
        correctIndex: 1,
        explanation: 'There are an estimated 5.25 trillion pieces of plastic debris in the ocean.',
      },
    ],
  },
  {
    id: 'pollution-3',
    title: 'Noise & Light Pollution',
    categoryId: 'pollution',
    difficulty: 'Intermediate',
    duration: 6,
    xpReward: 70,
    description: 'Pollution you can\'t see but can feel.',
    emoji: '🔊',
    color: 'from-lavender-400 to-coral-400',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Hidden Pollution',
        content: 'Too much noise and artificial light disrupt wildlife and human health.',
        emoji: '💡',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is light pollution?',
        options: ['Dirty lightbulbs', 'Excess artificial light', 'Sun being too bright', 'A type of lamp'],
        correctIndex: 1,
        explanation: 'Light pollution is excess artificial light that disrupts ecosystems and sleep.',
      },
    ],
  },
  {
    id: 'pollution-4',
    title: 'Fighting Pollution',
    categoryId: 'pollution',
    difficulty: 'Advanced',
    duration: 10,
    xpReward: 100,
    description: 'Solutions and policies that clean our world.',
    emoji: '🛡️',
    color: 'from-lavender-400 to-leaf-400',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Clean Solutions',
        content: 'Renewable energy, regulations, and personal actions all reduce pollution.',
        emoji: '✨',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What helps reduce pollution?',
        options: ['Burning more fuel', 'Renewable energy', 'More cars', 'Cutting trees'],
        correctIndex: 1,
        explanation: 'Renewable energy, regulations, and personal actions all help reduce pollution.',
      },
    ],
  },
  {
    id: 'energy-1',
    title: 'Solar Power Basics',
    categoryId: 'energy',
    difficulty: 'Beginner',
    duration: 5,
    xpReward: 50,
    description: 'How sunlight becomes electricity.',
    emoji: '☀️',
    color: 'from-sky2-400 to-leaf-400',
    completed: true,
    slides: [
      {
        id: 's1',
        title: 'Power from the Sun',
        content: 'Solar panels convert sunlight directly into electricity using photovoltaic cells.',
        emoji: '🔆',
        fact: 'The sun provides enough energy in one hour to power the world for a year!',
      },
      {
        id: 's2',
        title: 'Clean and Abundant',
        content: 'Solar energy produces no emissions and the sun won\'t run out for 5 billion years.',
        emoji: '🌞',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What do solar panels convert?',
        options: ['Water to electricity', 'Sunlight to electricity', 'Wind to electricity', 'Coal to electricity'],
        correctIndex: 1,
        explanation: 'Solar panels convert sunlight directly into electricity.',
      },
      {
        id: 'q2',
        question: 'How long will the sun last?',
        options: ['100 years', '1,000 years', '5 billion years', 'Forever'],
        correctIndex: 2,
        explanation: 'The sun will shine for about 5 billion more years — a truly renewable source!',
      },
    ],
  },
  {
    id: 'energy-2',
    title: 'Wind Energy',
    categoryId: 'energy',
    difficulty: 'Intermediate',
    duration: 7,
    xpReward: 75,
    description: 'Harnessing the power of moving air.',
    emoji: '🌬️',
    color: 'from-sky2-400 to-lagoon-400',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Turbines That Spin',
        content: 'Wind turbines use the wind\'s kinetic energy to generate electricity.',
        emoji: '🌀',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What do wind turbines use to make electricity?',
        options: ['Sunlight', 'Wind', 'Water', 'Coal'],
        correctIndex: 1,
        explanation: 'Wind turbines convert the wind\'s kinetic energy into electricity.',
      },
    ],
  },
  {
    id: 'energy-3',
    title: 'Hydro & Geothermal',
    categoryId: 'energy',
    difficulty: 'Intermediate',
    duration: 8,
    xpReward: 80,
    description: 'Power from water and Earth\'s heat.',
    emoji: '🌋',
    color: 'from-lagoon-400 to-sky2-500',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'Power from Earth',
        content: 'Hydroelectric dams use flowing water. Geothermal uses heat from deep underground.',
        emoji: '⚡',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What does geothermal energy use?',
        options: ['Sun', 'Wind', 'Earth\'s internal heat', 'Ocean waves'],
        correctIndex: 2,
        explanation: 'Geothermal energy uses heat from deep within the Earth.',
      },
    ],
  },
  {
    id: 'energy-4',
    title: 'The Future of Energy',
    categoryId: 'energy',
    difficulty: 'Advanced',
    duration: 10,
    xpReward: 100,
    description: 'Innovations powering a clean energy future.',
    emoji: '🚀',
    color: 'from-sky2-400 to-lavender-400',
    completed: false,
    slides: [
      {
        id: 's1',
        title: 'A Clean Future',
        content: 'Battery storage, smart grids, and new technologies are making renewable energy reliable 24/7.',
        emoji: '🔋',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What makes renewable energy reliable?',
        options: ['Battery storage', 'More coal', 'Bigger wires', 'Nothing'],
        correctIndex: 0,
        explanation: 'Battery storage and smart grids make renewable energy available even when the sun and wind aren\'t.',
      },
    ],
  },
];

export const missions: Mission[] = [
  {
    id: 'm1',
    title: 'Use a Reusable Bottle',
    description: 'Skip single-use plastic and carry a reusable water bottle today.',
    emoji: '🍶',
    difficulty: 'Beginner',
    xpReward: 30,
    coinReward: 15,
    progress: 100,
    completed: true,
    color: 'from-lagoon-400 to-sky2-400',
  },
  {
    id: 'm2',
    title: 'Recycle Paper Waste',
    description: 'Collect and properly recycle all paper waste from your home.',
    emoji: '📄',
    difficulty: 'Beginner',
    xpReward: 25,
    coinReward: 10,
    progress: 60,
    completed: false,
    color: 'from-leaf-400 to-lagoon-400',
  },
  {
    id: 'm3',
    title: 'Save Water',
    description: 'Take a 5-minute shower and turn off the tap while brushing.',
    emoji: '🚿',
    difficulty: 'Beginner',
    xpReward: 20,
    coinReward: 10,
    progress: 0,
    completed: false,
    color: 'from-sky2-400 to-lagoon-400',
  },
  {
    id: 'm4',
    title: 'Plant a Sapling',
    description: 'Plant a seed or sapling and care for it as it grows.',
    emoji: '🌱',
    difficulty: 'Intermediate',
    xpReward: 50,
    coinReward: 25,
    progress: 0,
    completed: false,
    color: 'from-leaf-500 to-sun-400',
  },
  {
    id: 'm5',
    title: 'Avoid Single-Use Plastic',
    description: 'Go a full day without using any single-use plastic items.',
    emoji: '🚫',
    difficulty: 'Intermediate',
    xpReward: 40,
    coinReward: 20,
    progress: 0,
    completed: false,
    color: 'from-coral-400 to-sun-400',
  },
  {
    id: 'm6',
    title: 'Meatless Monday',
    description: 'Eat plant-based meals for a day to reduce your carbon footprint.',
    emoji: '🥗',
    difficulty: 'Intermediate',
    xpReward: 35,
    coinReward: 15,
    progress: 0,
    completed: false,
    color: 'from-leaf-400 to-sun-400',
  },
];

export const achievements: Achievement[] = [
  { id: 'a1', title: 'First Steps', description: 'Complete your first lesson', emoji: '👶', unlocked: true, date: '2 days ago', color: 'from-leaf-400 to-lagoon-400' },
  { id: 'a2', title: 'Eco Warrior', description: 'Complete 5 missions', emoji: '⚔️', unlocked: true, date: '1 day ago', color: 'from-coral-400 to-sun-400' },
  { id: 'a3', title: 'Quiz Master', description: 'Get 100% on 3 quizzes', emoji: '🎯', unlocked: true, date: '3 days ago', color: 'from-sun-400 to-coral-400' },
  { id: 'a4', title: 'Streak Star', description: 'Maintain a 7-day streak', emoji: '🔥', unlocked: true, date: 'Today', color: 'from-coral-500 to-sun-500' },
  { id: 'a5', title: 'Gardener', description: 'Reach Forest Explorer rank', emoji: '🌳', unlocked: false, color: 'from-leaf-500 to-lagoon-500' },
  { id: 'a6', title: 'Scholar', description: 'Complete 10 lessons', emoji: '🎓', unlocked: false, color: 'from-lavender-400 to-lagoon-400' },
  { id: 'a7', title: 'Earth Guardian', description: 'Reach the final garden rank', emoji: '🛡️', unlocked: false, color: 'from-leaf-600 to-sky2-500' },
  { id: 'a8', title: 'Social Star', description: 'Reach top 3 on school leaderboard', emoji: '⭐', unlocked: false, color: 'from-sun-400 to-coral-400' },
];

export const leaderboardSchool: LeaderboardEntry[] = [
  { id: 'u1', name: 'Maya Chen', avatar: '🦊', xp: 2840, level: 12, streak: 21, missions: 48, impact: 890, rank: 1 },
  { id: 'u2', name: 'Liam Patel', avatar: '🦁', xp: 2610, level: 11, streak: 18, missions: 42, impact: 760, rank: 2 },
  { id: 'u3', name: 'You', avatar: '🐼', xp: 2450, level: 10, streak: 12, missions: 36, impact: 720, rank: 3, isCurrentUser: true },
  { id: 'u4', name: 'Sofia Garcia', avatar: '🦋', xp: 2280, level: 10, streak: 9, missions: 33, impact: 650, rank: 4 },
  { id: 'u5', name: 'Noah Kim', avatar: '🐧', xp: 2100, level: 9, streak: 15, missions: 30, impact: 580, rank: 5 },
  { id: 'u6', name: 'Ava Johnson', avatar: '🦉', xp: 1950, level: 9, streak: 7, missions: 28, impact: 520, rank: 6 },
  { id: 'u7', name: 'Ethan Wong', avatar: '🐢', xp: 1820, level: 8, streak: 11, missions: 25, impact: 480, rank: 7 },
  { id: 'u8', name: 'Zoe Miller', avatar: '🦜', xp: 1700, level: 8, streak: 5, missions: 23, impact: 440, rank: 8 },
];

export const leaderboardFriends: LeaderboardEntry[] = [
  { id: 'f1', name: 'Sofia Garcia', avatar: '🦋', xp: 2280, level: 10, streak: 9, missions: 33, impact: 650, rank: 1 },
  { id: 'f2', name: 'You', avatar: '🐼', xp: 2450, level: 10, streak: 12, missions: 36, impact: 720, rank: 2, isCurrentUser: true },
  { id: 'f3', name: 'Noah Kim', avatar: '🐧', xp: 2100, level: 9, streak: 15, missions: 30, impact: 580, rank: 3 },
  { id: 'f4', name: 'Ethan Wong', avatar: '🐢', xp: 1820, level: 8, streak: 11, missions: 25, impact: 480, rank: 4 },
  { id: 'f5', name: 'Mia Davis', avatar: '🦊', xp: 1500, level: 7, streak: 6, missions: 20, impact: 380, rank: 5 },
];

export const leaderboardGlobal: LeaderboardEntry[] = [
  { id: 'g1', name: 'EcoChampion2026', avatar: '🏆', xp: 12450, level: 25, streak: 95, missions: 210, impact: 4200, rank: 1 },
  { id: 'g2', name: 'GreenNinja', avatar: '🥷', xp: 11200, level: 23, streak: 78, missions: 195, impact: 3900, rank: 2 },
  { id: 'g3', name: 'EarthSaver', avatar: '🌍', xp: 10800, level: 22, streak: 67, missions: 188, impact: 3700, rank: 3 },
  { id: 'g4', name: 'ForestSpirit', avatar: '🌲', xp: 9500, level: 20, streak: 54, missions: 170, impact: 3200, rank: 4 },
  { id: 'g5', name: 'You', avatar: '🐼', xp: 2450, level: 10, streak: 12, missions: 36, impact: 720, rank: 847, isCurrentUser: true },
];

export const gardenItems: GardenItem[] = [
  { id: 't1', name: 'Oak Sapling', emoji: '🌱', unlocked: true, category: 'tree', description: 'Your first tree — just planted!' },
  { id: 't2', name: 'Young Birch', emoji: '🌿', unlocked: true, category: 'tree', description: 'Growing taller every day' },
  { id: 't3', name: 'Cherry Blossom', emoji: '🌸', unlocked: true, category: 'tree', description: 'Pink petals in spring' },
  { id: 't4', name: 'Mighty Oak', emoji: '🌳', unlocked: false, category: 'tree', description: 'Unlocks at Forest Explorer rank' },
  { id: 't5', name: 'Ancient Redwood', emoji: '🌲', unlocked: false, category: 'tree', description: 'Unlocks at Earth Guardian rank' },
  { id: 'f1', name: 'Sunflower', emoji: '🌻', unlocked: true, category: 'flower', description: 'Always faces the sun' },
  { id: 'f2', name: 'Tulip', emoji: '🌷', unlocked: true, category: 'flower', description: 'A splash of color' },
  { id: 'f3', name: 'Rose', emoji: '🌹', unlocked: false, category: 'flower', description: 'Unlocks at Forest Explorer rank' },
  { id: 'f4', name: 'Lotus', emoji: '🪷', unlocked: false, category: 'flower', description: 'Unlocks at Earth Guardian rank' },
  { id: 'a1', name: 'Butterfly', emoji: '🦋', unlocked: true, category: 'animal', description: 'Flutters between flowers' },
  { id: 'a2', name: 'Songbird', emoji: '🐦', unlocked: true, category: 'animal', description: 'Sings at dawn' },
  { id: 'a3', name: 'Bunny', emoji: '🐰', unlocked: false, category: 'animal', description: 'Unlocks at Forest Explorer rank' },
  { id: 'a4', name: 'Fox', emoji: '🦊', unlocked: false, category: 'animal', description: 'Unlocks at Earth Guardian rank' },
  { id: 'a5', name: 'Owl', emoji: '🦉', unlocked: false, category: 'animal', description: 'Unlocks at Earth Guardian rank' },
  { id: 'd1', name: 'Garden Bench', emoji: '🪑', unlocked: true, category: 'decoration', description: 'A cozy spot to rest' },
  { id: 'd2', name: 'Wind Chime', emoji: '🎐', unlocked: true, category: 'decoration', description: 'Gentle music in the breeze' },
  { id: 'd3', name: 'Fountain', emoji: '⛲', unlocked: false, category: 'decoration', description: 'Unlocks at Forest Explorer rank' },
  { id: 'd4', name: 'Treehouse', emoji: '🏠', unlocked: false, category: 'decoration', description: 'Unlocks at Earth Guardian rank' },
  { id: 'w1', name: 'Sunny Day', emoji: '☀️', unlocked: true, category: 'weather', description: 'Perfect growing weather' },
  { id: 'w2', name: 'Gentle Rain', emoji: '🌧️', unlocked: true, category: 'weather', description: 'Water for your plants' },
  { id: 'w3', name: 'Rainbow', emoji: '🌈', unlocked: false, category: 'weather', description: 'Unlocks at Forest Explorer rank' },
];

export const rewards: Reward[] = [
  { id: 'r1', title: 'Eco Hero Badge', description: 'A digital badge for your profile', emoji: '🏅', cost: 100, category: 'badge', color: 'from-sun-400 to-coral-400' },
  { id: 'r2', title: 'Custom Avatar Frame', description: 'Decorate your profile with a nature frame', emoji: '🖼️', cost: 250, category: 'digital', color: 'from-leaf-400 to-lagoon-400' },
  { id: 'r3', title: 'Garden Theme: Sunset', description: 'A warm sunset theme for your Eco Garden', emoji: '🌅', cost: 300, category: 'digital', color: 'from-coral-400 to-sun-400' },
  { id: 'r4', title: 'Reusable Water Bottle', description: 'A real EcoSpark branded water bottle!', emoji: '🍶', cost: 500, category: 'real', color: 'from-lagoon-400 to-sky2-400' },
  { id: 'r5', title: 'Seed Kit', description: 'A real kit with seeds to plant at home', emoji: '🌻', cost: 750, category: 'real', color: 'from-leaf-500 to-sun-400' },
  { id: 'r6', title: 'Eco T-Shirt', description: 'An organic cotton EcoSpark t-shirt', emoji: '👕', cost: 1000, category: 'real', color: 'from-leaf-400 to-lagoon-500' },
  { id: 'r7', title: 'Tree Planted in Your Name', description: 'We plant a real tree in a forest restoration project', emoji: '🌳', cost: 1500, category: 'real', color: 'from-leaf-600 to-leaf-400' },
  { id: 'r8', title: 'Golden Garden', description: 'A premium golden theme for your garden', emoji: '✨', cost: 2000, category: 'digital', color: 'from-sun-400 to-sun-500' },
];

export const challenges: Challenge[] = [
  {
    id: 'c1',
    title: 'Plastic-Free Week',
    description: 'Join your school in going 7 days without single-use plastic. Every small action adds up!',
    emoji: '🚫',
    participants: 234,
    daysLeft: 5,
    xpReward: 300,
    progress: 40,
    joined: true,
    color: 'from-coral-400 to-sun-400',
  },
  {
    id: 'c2',
    title: 'Tree Planting Month',
    description: 'School-wide goal to plant 100 trees. Each student\'s sapling counts toward the total.',
    emoji: '🌳',
    participants: 156,
    daysLeft: 18,
    xpReward: 500,
    progress: 25,
    joined: true,
    color: 'from-leaf-500 to-lagoon-400',
  },
  {
    id: 'c3',
    title: 'Energy Saving Sprint',
    description: 'Reduce home electricity use for 14 days. Track your savings and learn energy tips.',
    emoji: '⚡',
    participants: 89,
    daysLeft: 12,
    xpReward: 400,
    progress: 0,
    joined: false,
    color: 'from-sky2-400 to-sun-400',
  },
  {
    id: 'c4',
    title: 'Water Warrior Challenge',
    description: 'Save 50 gallons of water in a week through daily conservation actions.',
    emoji: '💧',
    participants: 112,
    daysLeft: 7,
    xpReward: 250,
    progress: 0,
    joined: false,
    color: 'from-lagoon-400 to-sky2-400',
  },
];

export const gardenRanks = [
  { name: 'Seedling', minLevel: 1, emoji: '🌱', color: 'from-leaf-400 to-sun-400', description: 'Just starting your journey' },
  { name: 'Forest Explorer', minLevel: 5, emoji: '🌿', color: 'from-leaf-500 to-lagoon-400', description: 'Your garden is thriving' },
  { name: 'Earth Guardian', minLevel: 12, emoji: '🌍', color: 'from-leaf-600 to-sky2-500', description: 'A true protector of nature' },
];

export const aiGuideSuggestions = [
  { id: 's1', text: 'How can I reduce my carbon footprint?', emoji: '👣' },
  { id: 's2', text: 'What should I recycle first?', emoji: '♻️' },
  { id: 's3', text: 'Tell me about endangered animals', emoji: '🐼' },
  { id: 's4', text: 'How does solar energy work?', emoji: '☀️' },
  { id: 's5', text: 'Ways to save water at home', emoji: '💧' },
  { id: 's6', text: 'What is biodiversity?', emoji: '🦋' },
];

export const aiGuideResponses: Record<string, string> = {
  'How can I reduce my carbon footprint?': 'Great question! Here are 5 simple ways to reduce your carbon footprint:\n\n1. Walk, bike, or take public transport instead of car rides\n2. Eat more plant-based meals — try Meatless Monday!\n3. Turn off lights and unplug devices when not in use\n4. Buy local and seasonal foods to reduce transport emissions\n5. Plant trees or support reforestation\n\nEvery small action adds up. Start with one and build from there! 🌱',
  'What should I recycle first?': 'Start with the "big five" that are most commonly accepted:\n\n♻️ Paper and cardboard (flatten boxes first!)\n♻️ Plastic bottles and jugs (check the number)\n♻️ Aluminum and steel cans\n♻️ Glass bottles and jars\n♻️ Clean plastic containers\n\nRemember: rinse items first and never bag recyclables in plastic — put them loose in the bin!',
  'Tell me about endangered animals': 'Here are some amazing animals that need our help:\n\n🐼 Giant Panda — habitat loss is their biggest threat\n🐅 Tiger — only ~4,000 left in the wild\n🦏 Black Rhino — poached for their horns\n🐢 Sea Turtles — threatened by plastic pollution\n🦍 Mountain Gorilla — only ~1,000 remain\n\nThe good news? Conservation efforts are helping many species recover. You can help by learning and spreading awareness!',
  'How does solar energy work?': 'Solar power is amazing! Here\'s how it works:\n\n1. Solar panels are made of photovoltaic cells\n2. When sunlight hits the cells, it knocks electrons loose\n3. This creates an electric current\n4. An inverter converts it to usable electricity\n5. Extra energy can be stored in batteries for nighttime\n\n☀️ Fun fact: The sun gives Earth enough energy in ONE HOUR to power the entire world for a YEAR!',
  'Ways to save water at home': 'Here are easy ways to save water every day:\n\n🚿 Take shorter showers (aim for 5 minutes)\n🚰 Turn off the tap while brushing teeth\n🔄 Reuse pasta water for plants\n💧 Fix dripping faucets quickly\n🚽 Don\'t use the toilet as a trash can\n🌧️ Collect rainwater for your garden\n🧺 Only run full loads of laundry\n\nA family of four can save thousands of gallons per year with these simple steps!',
  'What is biodiversity?': 'Biodiversity is the variety of all living things on Earth!\n\nThink of it like a giant puzzle:\n🧩 Each species is a piece\n🧩 Remove pieces and the picture falls apart\n🧩 Every plant, animal, and microbe has a role\n\nThree levels:\n1. Genetic diversity (within species)\n2. Species diversity (different species)\n3. Ecosystem diversity (different habitats)\n\nMore biodiversity = healthier planet for everyone! 🌐',
};

export const quizQuestions = [
  {
    id: 'qz1',
    title: 'Climate Change Basics',
    categoryId: 'climate',
    difficulty: 'Beginner' as Difficulty,
    questions: 5,
    xpReward: 100,
    emoji: '🌍',
    color: 'from-coral-400 to-sun-400',
    completed: true,
    bestScore: 80,
  },
  {
    id: 'qz2',
    title: 'Recycling Champion',
    categoryId: 'recycling',
    difficulty: 'Beginner' as Difficulty,
    questions: 5,
    xpReward: 100,
    emoji: '♻️',
    color: 'from-leaf-400 to-lagoon-400',
    completed: true,
    bestScore: 100,
  },
  {
    id: 'qz3',
    title: 'Water World',
    categoryId: 'water',
    difficulty: 'Intermediate' as Difficulty,
    questions: 5,
    xpReward: 150,
    emoji: '💧',
    color: 'from-lagoon-400 to-sky2-400',
    completed: false,
    bestScore: 0,
  },
  {
    id: 'qz4',
    title: 'Wildlife Expert',
    categoryId: 'wildlife',
    difficulty: 'Intermediate' as Difficulty,
    questions: 5,
    xpReward: 150,
    emoji: '🦋',
    color: 'from-sun-400 to-coral-400',
    completed: false,
    bestScore: 0,
  },
  {
    id: 'qz5',
    title: 'Pollution Solutions',
    categoryId: 'pollution',
    difficulty: 'Advanced' as Difficulty,
    questions: 5,
    xpReward: 200,
    emoji: '🌫️',
    color: 'from-lavender-400 to-lagoon-400',
    completed: false,
    bestScore: 0,
  },
  {
    id: 'qz6',
    title: 'Energy Master',
    categoryId: 'energy',
    difficulty: 'Advanced' as Difficulty,
    questions: 5,
    xpReward: 200,
    emoji: '⚡',
    color: 'from-sky2-400 to-leaf-400',
    completed: false,
    bestScore: 0,
  },
];
