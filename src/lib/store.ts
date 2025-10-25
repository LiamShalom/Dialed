import { create } from 'zustand'
import { Database } from './database.types'

type User = Database['public']['Tables']['users']['Row']
type Habit = Database['public']['Tables']['habits']['Row']
type HabitLog = Database['public']['Tables']['habit_logs']['Row']

interface AppState {
  user: User | null
  habits: Habit[]
  todayLogs: HabitLog[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User | null) => void
  setHabits: (habits: Habit[]) => void
  addHabit: (habit: Habit) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  setTodayLogs: (logs: HabitLog[]) => void
  updateLog: (habitId: string, amount: number, completed: boolean, date?: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  habits: [],
  todayLogs: [],
  isLoading: false,
  error: null,
  
  setUser: (user) => {
    console.log('Setting user:', user)
    set({ user })
  },
  
  setHabits: (habits) => set({ habits }),
  
  addHabit: (habit) => set((state) => ({ 
    habits: [...state.habits, habit] 
  })),
  
  updateHabit: (id, updates) => set((state) => ({
    habits: state.habits.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    )
  })),
  
  deleteHabit: (id) => set((state) => ({
    habits: state.habits.filter(habit => habit.id !== id)
  })),
  
  setTodayLogs: (logs) => set({ todayLogs: logs }),
  
  updateLog: (habitId, amount, completed, date) => set((state) => {
    const logDate = date || new Date().toISOString().split('T')[0]
    const existingLog = state.todayLogs.find(log => log.habit_id === habitId && log.date === logDate)
    
    if (existingLog) {
      return {
        todayLogs: state.todayLogs.map(log =>
          log.habit_id === habitId && log.date === logDate
            ? { ...log, amount, completed, updated_at: new Date().toISOString() }
            : log
        )
      }
    } else {
      const newLog: HabitLog = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        date: logDate,
        amount,
        completed,
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return {
        todayLogs: [...state.todayLogs, newLog]
      }
    }
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  reset: () => set({
    user: null,
    habits: [],
    todayLogs: [],
    isLoading: false,
    error: null
  })
}))
