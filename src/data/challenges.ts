import type { LucideIcon } from 'lucide-react';
import {
  ShieldCheck, Wallet, Database, MessageSquare, PenTool, Store, AlertTriangle,
  Shapes, Sprout, BookMarked, Lightbulb, MonitorSmartphone, Cpu, Trash2, Megaphone,
} from 'lucide-react';

export type ChallengeFormat = 'guided' | 'brief';

export interface ChallengeInstructions {
  steps?: string[];
  examples?: string[];
  brief?: string;
  deliverables?: string[];
  assumptions?: string[];
  reviewCriteria?: string[];
  teacherChecklist?: string[];
  tips: string[];
  evidence: string[];
}

export interface Challenge {
  id: string;
  title: string;
  category: string;
  categoryTagClass: string;
  duration: string;
  minutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  icon: LucideIcon;
  iconBg: string;
  description: string;
  format: ChallengeFormat;
  practise: string;
  instructions: ChallengeInstructions;
}

export const categoryFilters = [
  'All',
  'Digital Literacy',
  'Communication',
  'Financial Literacy',
  'Data Skills',
  'Creative Skills',
  'Applied Mathematics',
  'Science & Environment',
  'Design & Problem-Solving',
  'Software & UI/UX',
  'Hardware & IoT',
  'Business & Marketing',
] as const;

export const challenges: Challenge[] = [
  {
    id: 'plan-a-student-club-event-budget',
    title: 'Plan a Student-Club Event Budget',
    category: 'Financial Literacy',
    categoryTagClass: 'financial',
    duration: '60 minutes',
    minutes: 60,
    difficulty: 'Intermediate',
    skills: ['Budgeting', 'Decision making'],
    icon: Wallet,
    iconBg: '#e5edf1',
    description: 'Compare costs, allocate a limited fictional budget, and explain how to handle a shortfall.',
    format: 'brief',
    practise: 'Building an event budget, comparing cost options, and planning for a shortfall.',
    instructions: {
      brief:
        'Your student club has Rs. 5,000 to host a welcome event for 40 students. You must budget for at least five cost categories, compare two options for one major cost, and explain how you would handle any shortfall if your total exceeds the budget.',
      deliverables: [
        'A budget spreadsheet listing at least five cost items with per-unit and total amounts.',
        'A side-by-side comparison of two options for one major cost (e.g. two caterers or two venues).',
        'A short note (3 to 5 sentences) explaining your shortfall plan. If within budget, explain why no shortfall plan is needed.',
      ],
      assumptions: [
        'The Rs. 5,000 budget is fictional and fixed — you cannot raise more.',
        'All costs are fictional; you do not need to research real prices.',
        'You may assume the event lasts 2 to 3 hours.',
      ],
      tips: [
        'Show per-unit and total costs so the comparison is clear.',
        'A shortfall plan should be specific — name the item you would change and by how much.',
      ],
      evidence: [
        'Your event budget spreadsheet (file link or screenshot).',
        'Your cost comparison and shortfall explanation.',
      ],
      teacherChecklist: [
        'At least five cost items are listed with realistic amounts.',
        'Two options for one major cost are compared clearly.',
        'Grand total is calculated correctly and compared to the Rs. 5,000 limit.',
        'Shortfall plan is specific and practical.',
      ],
    },
  },
  {
    id: 'improve-app-error-messages',
    title: "Improve an App's Error Messages",
    category: 'Communication',
    categoryTagClass: 'communication',
    duration: '45 minutes',
    minutes: 45,
    difficulty: 'Beginner',
    skills: ['Writing', 'Communication'],
    icon: AlertTriangle,
    iconBg: '#f0e8f4',
    description: 'Rewrite three fictional confusing error messages with clear next actions.',
    format: 'brief',
    practise: 'Writing clear, user-friendly error messages that guide the next action.',
    instructions: {
      brief:
        'A fictional campus app shows three confusing error messages that leave users stuck. You will rewrite each message so a non-technical user understands what went wrong and what to do next. For each message, also write one sentence of reasoning explaining your change.',
      deliverables: [
        'A before-and-after list of three error messages.',
        'For each rewritten message, one sentence of reasoning explaining why it is clearer.',
      ],
      assumptions: [
        'The three original error messages are provided below — you do not need to find real ones.',
        'Original messages: 1) "Error 402: Payment failed." 2) "Permission denied." 3) "Upload unsuccessful — try again."',
        'You may add a help link or contact suggestion, but keep each message under 30 words.',
      ],
      tips: [
        'Avoid technical codes (e.g. "ERR_402") in the user-facing message.',
        'Start with what happened, then what to do: "Your upload was too large. Please use a file under 5 MB."',
      ],
      evidence: [
        'Your before-and-after messages with reasoning (document link or typed sheet).',
      ],
      teacherChecklist: [
        'Each rewritten message states the problem in plain language.',
        'Each rewritten message includes a clear next action.',
        'Reasoning explains the specific change, not just "it is better."',
        'Tone is helpful, not blaming the user.',
      ],
    },
  },
  {
    id: 'design-a-local-business-catalogue',
    title: 'Design a Local Business Catalogue',
    category: 'Creative Skills',
    categoryTagClass: 'creative',
    duration: '60 minutes',
    minutes: 60,
    difficulty: 'Intermediate',
    skills: ['Research', 'Communication'],
    icon: Store,
    iconBg: '#fde8e8',
    description: 'Create a three-product catalogue for a fictional local business.',
    format: 'brief',
    practise: 'Designing a small product catalogue with audience and layout in mind.',
    instructions: {
      brief:
        'A fictional local business (you choose the type — bakery, stationery, plant nursery, etc.) needs a simple three-product catalogue to share with customers on WhatsApp. Design a one-page catalogue showing three products, each with a name, price, and short description. Then explain your audience and layout choices.',
      deliverables: [
        'A one-page catalogue with three products (name, price, one-line description each).',
        'A short explanation (4 to 6 sentences) of your audience and layout choices.',
      ],
      assumptions: [
        'The business and products are fictional — you make up the names and prices.',
        'The catalogue will be shared as a single image or PDF on WhatsApp.',
        'You may use any design tool (Canva, Figma, hand-drawn, etc.).',
      ],
      tips: [
        'Keep descriptions under 12 words so the page stays scannable.',
        'A simple grid or stacked layout works better than crowded columns on mobile.',
      ],
      evidence: [
        'Your catalogue (image, PDF, or design-tool link).',
        'Your explanation of audience and layout choices.',
      ],
      teacherChecklist: [
        'Three products are shown with name, price, and description.',
        'Layout is clear and easy to read on a small phone screen.',
        'Audience choice is stated and the layout reasoning connects to it.',
        'Prices and descriptions are consistent in style.',
      ],
    },
  },
  {
    id: 'prototype-a-campus-help-page',
    title: 'Prototype a Campus Help Page',
    category: 'Software & UI/UX',
    categoryTagClass: 'software',
    duration: '60 minutes',
    minutes: 60,
    difficulty: 'Intermediate',
    skills: ['Problem solving', 'User experience', 'Prototyping'],
    icon: MonitorSmartphone,
    iconBg: '#e8eef6',
    description: 'Create a paper, design-tool, or coded prototype that helps students find campus services.',
    format: 'brief',
    practise: 'Designing a user-friendly help page with clear navigation and information hierarchy.',
    instructions: {
      brief:
        'Your campus has a scattered set of services (health centre, counselling, library, IT help, lost-and-found, hostel office) but no single place to find them. Design a one-page help prototype that lets a stressed student find the right service in under 30 seconds.',
      deliverables: [
        'A prototype of the help page (paper sketch, Figma/Canva design, or coded HTML page).',
        'A short note (4 to 6 sentences) explaining your layout choices — where you placed the search, categories, and emergency contact, and why.',
      ],
      assumptions: [
        'The page is for mobile-first use (students will open it on their phones).',
        'You may invent contact details — they do not need to be real.',
        'Coding is optional — a clear paper or tool-based prototype is equally valid.',
      ],
      tips: [
        'Prioritise the most urgent services (health, counselling) near the top.',
        'A search bar and category buttons help users who do not know the exact service name.',
      ],
      evidence: [
        'Your prototype (photo of sketch, design-tool link, or code link).',
        'Your layout explanation.',
      ],
      teacherChecklist: [
        'At least five campus services are represented.',
        'Layout is mobile-friendly and scannable.',
        'An emergency or urgent contact is easy to find.',
        'Layout explanation connects design choices to user needs.',
      ],
    },
  },
  {
    id: 'design-a-sensor-alert-system',
    title: 'Design a Sensor Alert System',
    category: 'Hardware & IoT',
    categoryTagClass: 'hardware',
    duration: '60 minutes',
    minutes: 60,
    difficulty: 'Intermediate',
    skills: ['Systems thinking', 'Engineering design'],
    icon: Cpu,
    iconBg: '#eae4f0',
    description: 'Create a labelled diagram or simulation explaining a sensor, threshold, and alert.',
    format: 'brief',
    practise: 'Designing a simple sensor-to-alert system and explaining the logic behind it.',
    instructions: {
      brief:
        'A campus library wants an alert system that notifies staff when the study room gets too noisy. Design a system using one sensor, a threshold value, and an alert action. You do not need to build hardware — a labelled diagram or a simple simulation (spreadsheet, flowchart, or pseudocode) is enough.',
      deliverables: [
        'A labelled diagram or flowchart showing: sensor → threshold check → alert action.',
        'A short explanation (4 to 6 sentences) covering: what the sensor measures, what threshold you chose and why, and what happens when the threshold is crossed.',
      ],
      assumptions: [
        'You do not need real hardware — a diagram or simulation is sufficient.',
        'You may choose any type of sensor (sound, light, temperature, etc.).',
        'The alert can be visual (a light), auditory (a buzzer), or digital (a phone notification).',
      ],
      tips: [
        'Name a specific sensor type (e.g. "sound sensor measuring decibels") rather than just "a sensor".',
        'A threshold should have a unit and a reason (e.g. "above 60 dB, because normal conversation is around 50 dB").',
      ],
      evidence: [
        'Your labelled diagram, flowchart, or simulation (photo, scan, or file link).',
        'Your explanation of sensor, threshold, and alert action.',
      ],
      teacherChecklist: [
        'A specific sensor type is named with what it measures.',
        'A threshold value is stated with a unit and a reason.',
        'The alert action is clearly described.',
        'Diagram or simulation is labelled and easy to follow.',
      ],
    },
  },
  {
    id: 'analyse-campus-waste-data',
    title: 'Analyse Campus Waste Data',
    category: 'Science & Environment',
    categoryTagClass: 'science',
    duration: '60 minutes',
    minutes: 60,
    difficulty: 'Intermediate',
    skills: ['Data analysis', 'Sustainability', 'Research'],
    icon: Trash2,
    iconBg: '#e4f0ea',
    description: 'Use a small fictional dataset to identify waste patterns and suggest one improvement.',
    format: 'brief',
    practise: 'Analysing a small dataset to find patterns and propose a data-informed improvement.',
    instructions: {
      brief:
        'Your campus conducted a one-week waste audit. You are given a fictional dataset showing daily waste by category (food, paper, plastic, glass, e-waste) in kilograms. Analyse the data, identify the largest waste category, spot any day-to-day pattern, and suggest one specific improvement the campus could try.',
      deliverables: [
        'A short summary table or chart showing total waste by category.',
        'Your one-paragraph analysis: which category is largest, any pattern across days, and why it matters.',
        'One specific, actionable improvement suggestion (not just "recycle more").',
      ],
      assumptions: [
        'The dataset is fictional — use the provided numbers below.',
        'Fictional data (kg per day): Mon — Food 12, Paper 8, Plastic 6, Glass 2, E-waste 0; Tue — Food 14, Paper 7, Plastic 7, Glass 1, E-waste 1; Wed — Food 10, Paper 9, Plastic 5, Glass 3, E-waste 0; Thu — Food 15, Paper 6, Plastic 8, Glass 2, E-waste 2; Fri — Food 18, Paper 5, Plastic 9, Glass 1, E-waste 1.',
        'Your improvement suggestion should be realistic for a campus with limited budget.',
      ],
      tips: [
        'Add up each category across all five days to find the total.',
        'A good improvement is specific: "Place clearly labelled food-waste bins near the canteen" is better than "reduce waste."',
      ],
      evidence: [
        'Your summary table or chart (file link or photo).',
        'Your analysis paragraph and improvement suggestion.',
      ],
      teacherChecklist: [
        'Waste totals by category are calculated correctly.',
        'The largest category and any day-to-day pattern are identified.',
        'Improvement suggestion is specific and actionable.',
        'Analysis connects the data to the suggestion.',
      ],
    },
  },
  {
    id: 'create-a-mini-marketing-experiment',
    title: 'Create a Mini Marketing Experiment',
    category: 'Business & Marketing',
    categoryTagClass: 'business',
    duration: '45 minutes',
    minutes: 45,
    difficulty: 'Beginner',
    skills: ['Business planning', 'Communication'],
    icon: Megaphone,
    iconBg: '#fdf3e0',
    description: 'Design two promotional messages for a fictional product and explain how you would compare their effectiveness.',
    format: 'brief',
    practise: 'Crafting marketing messages and designing a simple comparison experiment.',
    instructions: {
      brief:
        'A fictional campus startup is launching a reusable water bottle and cannot decide between two marketing messages. Write two different promotional messages for the same product, then design a simple experiment to compare which one performs better. You do not need to run the experiment or collect real data.',
      deliverables: [
        'Two promotional messages (each 1 to 2 sentences) for the same reusable water bottle.',
        'A short experiment plan (4 to 6 sentences) explaining: what you would measure (e.g. clicks, sign-ups), how you would split the audience, and how you would decide which message wins.',
      ],
      assumptions: [
        'The product and audience are fictional — you define the target customer.',
        'You do not need to run the experiment or collect real data — just design it.',
        'You may assume access to a simple tool (e.g. email, social media, or a landing page).',
      ],
      tips: [
        'Make the two messages genuinely different in tone or appeal (e.g. emotional vs. practical).',
        'An A/B test works best when only the message changes and everything else stays the same.',
      ],
      evidence: [
        'Your two messages and experiment plan (document link or typed sheet).',
      ],
      teacherChecklist: [
        'Two distinct messages are written for the same product.',
        'The experiment plan states what metric would be measured.',
        'The audience split is fair (e.g. random, similar-sized groups).',
        'The plan explains how a winner would be decided.',
      ],
    },
  },
];
