import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

export function getStartOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getEndOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export function calculateStreak(logs: Array<{ date: string; completed: boolean }>): number {
  if (logs.length === 0) return 0

  const sortedLogs = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  let streak = 0
  let currentDate = new Date()

  for (const log of sortedLogs) {
    const logDate = new Date(log.date)
    const daysDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === streak && log.completed) {
      streak++
      currentDate = logDate
    } else if (daysDiff === streak + 1 && log.completed) {
      streak++
      currentDate = logDate
    } else {
      break
    }
  }

  return streak
}

// Enhanced streak calculation for different habit frequencies
export function calculateStreakAdvanced(
  habit: { frequency: string; custom_frequency?: number | null },
  logs: Array<{ date: string; completed: boolean }>
): { currentStreak: number; longestStreak: number } {
  if (!logs.length) return { currentStreak: 0, longestStreak: 0 }

  // Filter only completed logs and sort by date ascending
  const completedLogs = logs
    .filter(log => log.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (completedLogs.length === 0) return { currentStreak: 0, longestStreak: 0 }

  let currentStreak = 1
  let longestStreak = 1

  for (let i = 1; i < completedLogs.length; i++) {
    const prev = new Date(completedLogs[i - 1].date)
    const curr = new Date(completedLogs[i].date)
    
    const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))
    
    let isConsecutive = false
    
    switch (habit.frequency) {
      case 'daily':
        // For daily habits, consecutive means exactly 1 day apart
        isConsecutive = diffDays === 1
        break
        
      case 'weekly':
        // For weekly habits, consecutive means within 7 days
        isConsecutive = diffDays <= 7
        break
        
      case 'monthly':
        // For monthly habits, consecutive means in consecutive months
        const prevMonth = prev.getMonth()
        const currMonth = curr.getMonth()
        const prevYear = prev.getFullYear()
        const currYear = curr.getFullYear()
        
        isConsecutive = (
          (prevMonth === 11 && currMonth === 0 && currYear === prevYear + 1) || // Dec to Jan
          (currMonth === prevMonth + 1 && currYear === prevYear) // Same year, next month
        )
        break
        
      case 'custom':
        // For custom habits, consecutive means within the custom frequency days
        const customDays = habit.custom_frequency || 1
        isConsecutive = diffDays <= customDays
        break
        
      default:
        isConsecutive = diffDays === 1
    }
    
    if (isConsecutive) {
      currentStreak += 1
    } else {
      currentStreak = 1 // Reset streak if not consecutive
    }
    
    longestStreak = Math.max(longestStreak, currentStreak)
  }

  return { currentStreak, longestStreak }
}

export function getHabitColors() {
  return [
    { name: 'Red', value: '#ef4444', bg: 'bg-red-500', text: 'text-red-500' },
    { name: 'Orange', value: '#f97316', bg: 'bg-orange-500', text: 'text-orange-500' },
    { name: 'Yellow', value: '#eab308', bg: 'bg-yellow-500', text: 'text-yellow-500' },
    { name: 'Green', value: '#22c55e', bg: 'bg-green-500', text: 'text-green-500' },
    { name: 'Blue', value: '#3b82f6', bg: 'bg-blue-500', text: 'text-blue-500' },
    { name: 'Purple', value: '#a855f7', bg: 'bg-purple-500', text: 'text-purple-500' },
    { name: 'Pink', value: '#ec4899', bg: 'bg-pink-500', text: 'text-pink-500' },
    { name: 'Indigo', value: '#6366f1', bg: 'bg-indigo-500', text: 'text-indigo-500' },
  ]
}

import {
  Activity,        // exercise / fitness
  Apple,           // healthy eating
  Bed,             // sleep
  Bike,            // bike ride
  BookMarked,      // reading
  BookOpen,        // reading / learning
  Brain,           // mindfulness / focus
  Briefcase,       // work
  Brush,           // art / creativity
  Bus,             // transportation
  Calendar,        // planning
  CameraIcon,      // photography
  CarIcon,         // driving
  CheckCircle,     // task completed
  Cigarette,       // smoking
  CigaretteOff,       // smoking
  Clock,           // time management
  Coffee,          // energy / morning focus
  Dog,             // pet care / compassion
  Droplet,         // hydration
  Droplets,        // hydration
  Dumbbell,        // exercise
  Flame,           // streak / motivation
  Footprints,      // walking
  Headphones,      // music
  Heart,           // health / kindness
  Home,            // household / environment
  Joystick,        // gaming
  Lightbulb,       // new ideas / personal growth
  Laptop,          // work / productivity
  Mail,            // email
  MessageCircle,   // social connection
  MessageSquare,   // social media
  Moon,            // sleep
  Music,           // relaxation / creativity
  Palette,         // art
  PawPrint,        // pet care
  PenTool,         // journaling / writing
  Phone,           // screen time
  PhoneCall,       // communication
  Plane,           // travel
  ShowerHead,      // hygiene / self-care
  Smile,           // gratitude / mood
  Snowflake,       // cold shower
  Star,            // achievements
  Stethoscope,     // health check
  Sun,             // morning routine / wake up early
  Target,          // goal setting
  Timer,           // focus time
  TreePine,        // time outdoors / nature
  Trophy,          // milestones / success
  Users,           // family / social
  Utensils,        // eating habits
  Zap              // energy / productivity
} from 'lucide-react'

export function getHabitIcons() {
  return [
    { name: 'Activity', component: Activity },
    { name: 'Apple', component: Apple },
    { name: 'Bed', component: Bed },
    { name: 'Bike', component: Bike },
    { name: 'BookMarked', component: BookMarked },
    { name: 'BookOpen', component: BookOpen },
    { name: 'Brain', component: Brain },
    { name: 'Briefcase', component: Briefcase },
    { name: 'Brush', component: Brush },
    { name: 'Bus', component: Bus },
    { name: 'Calendar', component: Calendar },
    { name: 'CameraIcon', component: CameraIcon },
    { name: 'CarIcon', component: CarIcon },
    { name: 'CheckCircle', component: CheckCircle },
    { name: 'Cigarette', component: Cigarette },
    { name: 'CigaretteOff', component: CigaretteOff },
    { name: 'Clock', component: Clock },
    { name: 'Coffee', component: Coffee },
    { name: 'Dog', component: Dog },
    { name: 'Droplet', component: Droplet },
    { name: 'Droplets', component: Droplets },
    { name: 'Dumbbell', component: Dumbbell },
    { name: 'Email', component: Mail },
    { name: 'Flame', component: Flame },
    { name: 'Footprints', component: Footprints },
    { name: 'Headphones', component: Headphones },
    { name: 'Heart', component: Heart },
    { name: 'Home', component: Home },
    { name: 'Joystick', component: Joystick },
    { name: 'Lightbulb', component: Lightbulb },
    { name: 'Laptop', component: Laptop },
    { name: 'Mail', component: Mail },
    { name: 'MessageCircle', component: MessageCircle },
    { name: 'MessageSquare', component: MessageSquare },
    { name: 'Moon', component: Moon },
    { name: 'Music', component: Music },
    { name: 'Palette', component: Palette },
    { name: 'PawPrint', component: PawPrint },
    { name: 'PenTool', component: PenTool },
    { name: 'Phone', component: Phone },
    { name: 'PhoneCall', component: PhoneCall },
    { name: 'Plane', component: Plane },
    { name: 'ShowerHead', component: ShowerHead },
    { name: 'Smile', component: Smile },
    { name: 'Snowflake', component: Snowflake },
    { name: 'Star', component: Star },
    { name: 'Stethoscope', component: Stethoscope },
    { name: 'Sun', component: Sun },
    { name: 'Target', component: Target },
    { name: 'Timer', component: Timer },
    { name: 'TreePine', component: TreePine },
    { name: 'Trophy', component: Trophy },
    { name: 'Users', component: Users },
    { name: 'Utensils', component: Utensils },
    { name: 'Zap', component: Zap }
  ]
}

// Create a mapping from component names to components
export function getIconByName(iconName: string) {
  const iconMap: { [key: string]: any } = {
    'Activity': Activity,
    'Apple': Apple,
    'Bed': Bed,
    'Bike': Bike,
    'BookMarked': BookMarked,
    'BookOpen': BookOpen,
    'Brain': Brain,
    'Briefcase': Briefcase,
    'Brush': Brush,
    'Bus': Bus,
    'Calendar': Calendar,
    'CameraIcon': CameraIcon,
    'CarIcon': CarIcon,
    'CheckCircle': CheckCircle,
    'Cigarette': Cigarette,
    'CigaretteOff': CigaretteOff,
    'Clock': Clock,
    'Coffee': Coffee,
    'Dog': Dog,
    'Droplet': Droplet,
    'Droplets': Droplets,
    'Dumbbell': Dumbbell,
    'Email': Mail,
    'Flame': Flame,
    'Footprints': Footprints,
    'Headphones': Headphones,
    'Heart': Heart,
    'Home': Home,
    'Joystick': Joystick,
    'Lightbulb': Lightbulb,
    'Laptop': Laptop,
    'Mail': Mail,
    'MessageCircle': MessageCircle,
    'MessageSquare': MessageSquare,
    'Moon': Moon,
    'Music': Music,
    'Palette': Palette,
    'PawPrint': PawPrint,
    'PenTool': PenTool,
    'Phone': Phone,
    'PhoneCall': PhoneCall,
    'Plane': Plane,
    'ShowerHead': ShowerHead,
    'Smile': Smile,
    'Snowflake': Snowflake,
    'Star': Star,
    'Stethoscope': Stethoscope,
    'Sun': Sun,
    'Target': Target,
    'Timer': Timer,
    'TreePine': TreePine,
    'Trophy': Trophy,
    'Users': Users,
    'Utensils': Utensils,
    'Zap': Zap,
  }
  
  return iconMap[iconName] || null
}

// Frequency-based date utilities
export function getPeriodStartDate(frequency: string, customFrequency?: number, date: Date = new Date()): string {
  const d = new Date(date)
  
  switch (frequency) {
    case 'daily':
      return d.toISOString().split('T')[0]
    
    case 'weekly':
      // Get start of week (Monday)
      const dayOfWeek = d.getDay()
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      d.setDate(d.getDate() - daysToMonday)
      return d.toISOString().split('T')[0]
    
    case 'monthly':
      // Get start of month
      d.setDate(1)
      return d.toISOString().split('T')[0]
    
    case 'custom':
      if (!customFrequency) return d.toISOString().split('T')[0]
      // For custom frequency, find the start of the current period
      const daysSinceEpoch = Math.floor(d.getTime() / (1000 * 60 * 60 * 24))
      const periodStart = Math.floor(daysSinceEpoch / customFrequency) * customFrequency
      const epochDate = new Date(1970, 0, 1)
      epochDate.setDate(epochDate.getDate() + periodStart)
      return epochDate.toISOString().split('T')[0]
    
    default:
      return d.toISOString().split('T')[0]
  }
}

export function getPeriodEndDate(frequency: string, customFrequency?: number, date: Date = new Date()): string {
  const d = new Date(date)
  
  switch (frequency) {
    case 'daily':
      return d.toISOString().split('T')[0]
    
    case 'weekly':
      // Get end of week (Sunday)
      const dayOfWeek = d.getDay()
      const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
      d.setDate(d.getDate() + daysToSunday)
      return d.toISOString().split('T')[0]
    
    case 'monthly':
      // Get end of month
      d.setMonth(d.getMonth() + 1, 0)
      return d.toISOString().split('T')[0]
    
    case 'custom':
      if (!customFrequency) return d.toISOString().split('T')[0]
      // For custom frequency, find the end of the current period
      const daysSinceEpoch = Math.floor(d.getTime() / (1000 * 60 * 60 * 24))
      const periodEnd = Math.floor(daysSinceEpoch / customFrequency) * customFrequency + customFrequency - 1
      const epochDate = new Date(1970, 0, 1)
      epochDate.setDate(epochDate.getDate() + periodEnd)
      return epochDate.toISOString().split('T')[0]
    
    default:
      return d.toISOString().split('T')[0]
  }
}

export function getPeriodDisplayName(frequency: string, customFrequency?: number): string {
  switch (frequency) {
    case 'daily':
      return 'Today'
    case 'weekly':
      return 'This Week'
    case 'monthly':
      return 'This Month'
    case 'custom':
      return `Every ${customFrequency} days`
    default:
      return 'Today'
  }
}

export function getPeriodProgress(amount: number, target: number, frequency: string, customFrequency?: number): number {
  // For daily habits, progress is straightforward
  if (frequency === 'daily') {
    return Math.min((amount / target) * 100, 100)
  }
  
  // For weekly/monthly/custom, we need to consider the period
  // This is a simplified calculation - in a real app you might want more sophisticated logic
  return Math.min((amount / target) * 100, 100)
}