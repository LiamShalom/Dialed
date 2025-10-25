import { 
  Dumbbell, 
  BookOpen, 
  Moon, 
  Sun, 
  Coffee, 
  Heart, 
  Brain, 
  Music, 
  Camera, 
  PenTool, 
  Gamepad2, 
  Car, 
  Utensils, 
  ShowerHead, 
  Phone, 
  Laptop,
  TreePine,
  Dog,
  MessageCircle,
  Target,
  Droplets,
  Footprints,
  BookMarked,
  Lightbulb,
  Brush,
  Headphones,
  CameraIcon,
  Joystick,
  Palette,
  Users,
  Briefcase,
  CarIcon,
  PawPrint,
  Zap,
  Apple,
  Bed,
  Stethoscope,
  Activity,
  Timer,
  CheckCircle,
  Star,
  Trophy,
  Smile,
  Home,
  Clock,
  Flame,
  CheckSquare,
  MessageSquare,
  PhoneCall,
  Mail,
  Calendar,
  MapPin,
  Compass,
  Plane,
  Bike,
  Bus,
  Train
} from 'lucide-react'

export interface CommonHabit {
  id: string
  title: string
  description: string
  icon: any
  color: string
  category: string
}

export const COMMON_HABITS: CommonHabit[] = [
  // Health & Fitness
  {
    id: 'exercise',
    title: 'Exercise',
    description: 'Daily physical activity',
    icon: Activity,
    color: '#ef4444', // red-500
    category: 'Health & Fitness'
  },
  {
    id: 'meditation',
    title: 'Meditation',
    description: 'Mindfulness and relaxation',
    icon: Brain,
    color: '#8b5cf6', // violet-500
    category: 'Health & Fitness'
  },
  {
    id: 'sleep',
    title: 'Sleep',
    description: 'Get adequate rest',
    icon: Bed,
    color: '#3b82f6', // blue-500
    category: 'Health & Fitness'
  },
  {
    id: 'water',
    title: 'Drink Water',
    description: 'Stay hydrated',
    icon: Droplets,
    color: '#06b6d4', // cyan-500
    category: 'Health & Fitness'
  },
  {
    id: 'walk',
    title: 'Walk',
    description: 'Take a daily walk',
    icon: Footprints,
    color: '#10b981', // emerald-500
    category: 'Health & Fitness'
  },
  {
    id: 'yoga',
    title: 'Yoga',
    description: 'Practice yoga and stretching',
    icon: Zap,
    color: '#f59e0b', // amber-500
    category: 'Health & Fitness'
  },
  {
    id: 'doctor',
    title: 'Health Check',
    description: 'Regular health monitoring',
    icon: Stethoscope,
    color: '#ec4899', // pink-500
    category: 'Health & Fitness'
  },

  // Learning & Development
  {
    id: 'reading',
    title: 'Reading',
    description: 'Read books or articles',
    icon: BookMarked,
    color: '#f59e0b', // amber-500
    category: 'Learning & Development'
  },
  {
    id: 'journaling',
    title: 'Journaling',
    description: 'Write in your journal',
    icon: PenTool,
    color: '#84cc16', // lime-500
    category: 'Learning & Development'
  },
  {
    id: 'learning',
    title: 'Learning',
    description: 'Study or learn something new',
    icon: Lightbulb,
    color: '#6366f1', // indigo-500
    category: 'Learning & Development'
  },
  {
    id: 'language',
    title: 'Language Learning',
    description: 'Practice a new language',
    icon: BookOpen,
    color: '#0ea5e9', // sky-500
    category: 'Learning & Development'
  },

  // Daily Routines
  {
    id: 'morning_routine',
    title: 'Morning Routine',
    description: 'Start your day right',
    icon: Sun,
    color: '#f97316', // orange-500
    category: 'Daily Routines'
  },
  {
    id: 'coffee',
    title: 'Coffee',
    description: 'Enjoy your morning coffee',
    icon: Coffee,
    color: '#a3a3a3', // neutral-400
    category: 'Daily Routines'
  },
  {
    id: 'shower',
    title: 'Shower',
    description: 'Daily hygiene routine',
    icon: ShowerHead,
    color: '#0ea5e9', // sky-500
    category: 'Daily Routines'
  },
  {
    id: 'cooking',
    title: 'Cooking',
    description: 'Prepare healthy meals',
    icon: Utensils,
    color: '#ec4899', // pink-500
    category: 'Daily Routines'
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    description: 'Keep your space tidy',
    icon: Home,
    color: '#84cc16', // lime-500
    category: 'Daily Routines'
  },
  {
    id: 'meal_prep',
    title: 'Meal Prep',
    description: 'Prepare meals in advance',
    icon: Apple,
    color: '#10b981', // emerald-500
    category: 'Daily Routines'
  },

  // Hobbies & Interests
  {
    id: 'music',
    title: 'Music',
    description: 'Listen to or play music',
    icon: Headphones,
    color: '#8b5cf6', // violet-500
    category: 'Hobbies & Interests'
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'Take photos',
    icon: CameraIcon,
    color: '#6366f1', // indigo-500
    category: 'Hobbies & Interests'
  },
  {
    id: 'gaming',
    title: 'Gaming',
    description: 'Play video games',
    icon: Joystick,
    color: '#10b981', // emerald-500
    category: 'Hobbies & Interests'
  },
  {
    id: 'art',
    title: 'Art',
    description: 'Create or appreciate art',
    icon: Palette,
    color: '#f59e0b', // amber-500
    category: 'Hobbies & Interests'
  },
  {
    id: 'drawing',
    title: 'Drawing',
    description: 'Practice drawing skills',
    icon: Brush,
    color: '#ec4899', // pink-500
    category: 'Hobbies & Interests'
  },
  {
    id: 'gardening',
    title: 'Gardening',
    description: 'Tend to your garden',
    icon: TreePine,
    color: '#10b981', // emerald-500
    category: 'Hobbies & Interests'
  },

  // Social & Communication
  {
    id: 'social_media',
    title: 'Social Media',
    description: 'Check social media',
    icon: MessageSquare,
    color: '#3b82f6', // blue-500
    category: 'Social & Communication'
  },
  {
    id: 'calls',
    title: 'Phone Calls',
    description: 'Make important calls',
    icon: PhoneCall,
    color: '#06b6d4', // cyan-500
    category: 'Social & Communication'
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Check and respond to emails',
    icon: Mail,
    color: '#64748b', // slate-500
    category: 'Social & Communication'
  },
  {
    id: 'family_time',
    title: 'Family Time',
    description: 'Spend quality time with family',
    icon: Users,
    color: '#f97316', // orange-500
    category: 'Social & Communication'
  },

  // Work & Productivity
  {
    id: 'work',
    title: 'Work',
    description: 'Complete work tasks',
    icon: Briefcase,
    color: '#64748b', // slate-500
    category: 'Work & Productivity'
  },
  {
    id: 'goals',
    title: 'Goals',
    description: 'Work toward your goals',
    icon: Target,
    color: '#ef4444', // red-500
    category: 'Work & Productivity'
  },
  {
    id: 'planning',
    title: 'Planning',
    description: 'Plan your day and tasks',
    icon: Calendar,
    color: '#3b82f6', // blue-500
    category: 'Work & Productivity'
  },
  {
    id: 'focus_time',
    title: 'Focus Time',
    description: 'Deep work sessions',
    icon: Timer,
    color: '#8b5cf6', // violet-500
    category: 'Work & Productivity'
  },

  // Transportation
  {
    id: 'driving',
    title: 'Driving',
    description: 'Drive safely',
    icon: CarIcon,
    color: '#f59e0b', // amber-500
    category: 'Transportation'
  },
  {
    id: 'cycling',
    title: 'Cycling',
    description: 'Ride your bike',
    icon: Bike,
    color: '#10b981', // emerald-500
    category: 'Transportation'
  },
  {
    id: 'public_transport',
    title: 'Public Transport',
    description: 'Use buses or trains',
    icon: Bus,
    color: '#6366f1', // indigo-500
    category: 'Transportation'
  },
  {
    id: 'travel',
    title: 'Travel',
    description: 'Explore new places',
    icon: Plane,
    color: '#0ea5e9', // sky-500
    category: 'Transportation'
  },

  // Pets
  {
    id: 'pet_care',
    title: 'Pet Care',
    description: 'Take care of your pets',
    icon: PawPrint,
    color: '#84cc16', // lime-500
    category: 'Pets'
  },

  // Wellness & Self-Care
  {
    id: 'gratitude',
    title: 'Gratitude',
    description: 'Practice gratitude',
    icon: Heart,
    color: '#ec4899', // pink-500
    category: 'Wellness & Self-Care'
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness',
    description: 'Practice mindfulness',
    icon: Smile,
    color: '#f59e0b', // amber-500
    category: 'Wellness & Self-Care'
  },
  {
    id: 'self_care',
    title: 'Self Care',
    description: 'Take time for yourself',
    icon: Star,
    color: '#8b5cf6', // violet-500
    category: 'Wellness & Self-Care'
  }
]

export const HABIT_CATEGORIES = [
  'Health & Fitness',
  'Learning & Development', 
  'Daily Routines',
  'Hobbies & Interests',
  'Social & Communication',
  'Work & Productivity',
  'Transportation',
  'Pets',
  'Wellness & Self-Care'
]

export const PREDEFINED_COLORS = [
  '#ef4444', // red-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#84cc16', // lime-500
  '#6366f1', // indigo-500
  '#0ea5e9', // sky-500
  '#64748b', // slate-500
  '#a3a3a3'  // neutral-400
]
