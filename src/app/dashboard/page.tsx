'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Layout } from '@/components/layout/layout'
import { HabitCard } from '@/components/habits/habit-card'
import { HabitForm } from '@/components/habits/habit-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database.types'
import { Plus, Calendar, Target, Flame } from 'lucide-react'
import { getDateString, getPeriodStartDate, getPeriodEndDate, getPeriodDisplayName, calculateStreakAdvanced } from '@/lib/utils'

type Habit = Database['public']['Tables']['habits']['Row']
type HabitLog = Database['public']['Tables']['habit_logs']['Row']

export default function DashboardPage() {
  const { user, habits, todayLogs, setHabits, setTodayLogs, updateLog, setUser, deleteHabit, updateHabit } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [weeklyLogs, setWeeklyLogs] = useState<HabitLog[]>([])
  const [isClient, setIsClient] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(getDateString())
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)
  const loadedHabitsRef = useRef<string[]>([])
  const [streakData, setStreakData] = useState<{date: string, hasActivity: boolean}[]>([])
  const [weeklyProgressLogs, setWeeklyProgressLogs] = useState<HabitLog[]>([])

  const supabase = createClient()

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  console.log('Dashboard component rendered - user:', user, 'isLoading:', isLoading, 'isClient:', isClient)

  // Check for existing session on mount (only on client side)
  useEffect(() => {
    if (!isClient) return
    
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        console.log('Session found:', session, 'Error:', sessionError)
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          return
        }
        
        if (session?.user && !user) {
          console.log('Session exists but no user in store, fetching profile...')
          // Fetch user profile
          const { data: profile, error: profileError } = await (supabase as any)
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profileError) {
            console.error('Error fetching user profile:', profileError)
            // If profile doesn't exist, create it
            if (profileError.code === 'PGRST116') {
              console.log('Profile not found, creating new profile...')
              const { data: newProfile, error: createError } = await (supabase as any)
                .from('users')
                .insert({
                  id: session.user.id,
                  email: session.user.email!,
                  name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
                  theme: 'system',
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                })
                .select()
                .single()

              if (createError) {
                console.error('Error creating user profile:', createError)
              } else {
                console.log('Profile created:', newProfile)
                setUser(newProfile)
              }
            }
          } else {
            console.log('Profile fetched:', profile)
            setUser(profile)
          }
        }
      } catch (err) {
        console.error('Error in session check:', err)
      }
    }
    
    checkSession()
  }, [isClient])

  useEffect(() => {
    console.log('Dashboard useEffect - user:', user)
    if (user) {
      console.log('User exists, loading habits and logs')
      loadHabits()
      loadTodayLogs()
      loadWeeklyLogs()
      loadStreakData()
      loadWeeklyProgressLogs()
    } else {
      console.log('No user found, not loading data')
      // Set loading to false if no user after a delay
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [user])

  // Load logs for selected date when component mounts or selectedDate changes
  useEffect(() => {
    console.log('🟡 useEffect [selectedDate, user, habits] triggered')
    if (user && selectedDate && habits.length > 0) {
      // Check if we've already loaded logs for these habits
      const currentHabitIds = habits.map(h => h.id).sort().join(',')
      const loadedHabitIds = loadedHabitsRef.current.sort().join(',')
      
      console.log('🟡 Comparing habit IDs:', { currentHabitIds, loadedHabitIds })
      
      // Only reload if habits have actually changed (new habits added/removed)
      if (currentHabitIds !== loadedHabitIds || selectedDate !== loadedHabitsRef.current[0]) {
        console.log('🔴 FETCHING LOGS - habits or date changed')
        const loadLogsForSelectedDate = async () => {
          try {
            setIsLoadingLogs(true)
            console.log('Loading logs for selected date on mount/change:', selectedDate)
            
            // For daily habits, load logs for the specific date
            // For weekly/monthly/custom habits, load logs for the entire period
            const dailyHabits = habits.filter(h => h.frequency === 'daily')
            const periodHabits = habits.filter(h => h.frequency !== 'daily')
            
            let allLogs: any[] = []
            
            // Load daily habit logs
            if (dailyHabits.length > 0) {
              const { data: dailyLogs, error: dailyError } = await (supabase as any)
                .from('habit_logs')
                .select('*')
                .eq('date', selectedDate)
                .in('habit_id', dailyHabits.map(h => h.id))
              
              if (dailyError) throw dailyError
              allLogs = [...(dailyLogs || [])]
            }
            
            // Load period habit logs
            for (const habit of periodHabits) {
              const periodStart = getPeriodStartDate(habit.frequency, habit.custom_frequency || undefined, new Date(selectedDate))
              const periodEnd = getPeriodEndDate(habit.frequency, habit.custom_frequency || undefined, new Date(selectedDate))
              
              console.log('🔍 Loading period logs for habit:', habit.title, 'frequency:', habit.frequency, 'period:', periodStart, 'to', periodEnd, 'selectedDate:', selectedDate)
              
              const { data: periodLogs, error: periodError } = await (supabase as any)
                .from('habit_logs')
                .select('*')
                .eq('habit_id', habit.id)
                .gte('date', periodStart)
                .lte('date', periodEnd)
              
              if (periodError) throw periodError
              console.log('🔍 Found period logs:', periodLogs)
              allLogs = [...allLogs, ...(periodLogs || [])]
            }
            
            setTodayLogs(allLogs)
            
            // Update ref to track what we've loaded
            loadedHabitsRef.current = [selectedDate, ...habits.map(h => h.id)]
          } catch (err) {
            console.error('Error loading logs for selected date:', err)
          } finally {
            setIsLoadingLogs(false)
          }
        }
        loadLogsForSelectedDate()
      }
    }
  }, [selectedDate, user, habits]) // Keep habits in dependencies but use ref to prevent unnecessary reloads


  // Load streak data and weekly progress logs when habits change
  useEffect(() => {
    if (user && habits.length > 0) {
      loadStreakData()
      loadWeeklyProgressLogs()
    }
  }, [habits, user])

  // Weekly logs are now loaded manually when needed
  // This prevents unnecessary reloads when habits change


  const loadHabits = async () => {
    if (!user?.id) {
      console.log('No user ID available')
      setIsLoading(false)
      return
    }
    
    try {
      setIsLoading(true)
      console.log('Loading habits for user:', user.id)
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const habitsPromise = (supabase as any)
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('position')

      const { data, error } = await Promise.race([habitsPromise, timeoutPromise])

      if (error) {
        console.error('Error loading habits:', error)
        throw error
      }
      console.log('Loaded habits:', data)
      setHabits(data || [])
    } catch (err) {
      console.error('Failed to load habits:', err)
      setError(err instanceof Error ? err.message : 'Failed to load habits')
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to filter habits that are active for a given date
  const getActiveHabitsForDate = (habits: Habit[], date: string) => {
    // Show all active habits regardless of creation date
    // This allows updating habits on any day
    const activeHabits = habits.filter(habit => habit.is_active)

    // Return habits in their original order (no sorting)
    return activeHabits.sort((a, b) => a.position - b.position)
  }

  const loadTodayLogs = async () => {
    try {
      const today = getDateString()
      const { data, error } = await (supabase as any)
        .from('habit_logs')
        .select('*')
        .eq('date', today)

      if (error) throw error
      setTodayLogs(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load today\'s logs')
    }
  }


  const loadWeeklyLogs = async () => {
    if (!user?.id) return
    
    try {
      const today = new Date()
      const startDate = new Date(today)
      startDate.setDate(today.getDate() - 3)
      const endDate = new Date(today)
      endDate.setDate(today.getDate() + 3)
      
      const { data, error } = await (supabase as any)
        .from('habit_logs')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])

      if (error) throw error
      setWeeklyLogs(data || [])
    } catch (err) {
      console.error('Failed to load weekly logs:', err)
    }
  }

  const loadStreakData = async () => {
    if (!user?.id || habits.length === 0) return
    
    try {
      const today = new Date()
      const startDate = new Date(today)
      startDate.setDate(today.getDate() - 30) // Check last 30 days
      
      const { data, error } = await (supabase as any)
        .from('habit_logs')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0])
        .in('habit_id', habits.map(h => h.id))

      if (error) throw error
      
      // Process the data to determine activity for each day
      const streakDataArray = []
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(today.getDate() - i)
        const dateString = checkDate.toISOString().split('T')[0]
        
        const activeHabitsForDate = getActiveHabitsForDate(habits, dateString)
        const hasActivity = data?.some((log: HabitLog) => 
          log.date === dateString && 
          activeHabitsForDate.some(habit => habit.id === log.habit_id)
        ) || false
        
        streakDataArray.push({
          date: dateString,
          hasActivity
        })
      }
      
      setStreakData(streakDataArray)
    } catch (err) {
      console.error('Failed to load streak data:', err)
    }
  }

  const loadWeeklyProgressLogs = async () => {
    if (!user?.id || habits.length === 0) return
    
    try {
      const today = new Date()
      // Load a wider range to cover monthly periods (30 days back, 30 days forward)
      const startDate = new Date(today)
      startDate.setDate(today.getDate() - 30)
      const endDate = new Date(today)
      endDate.setDate(today.getDate() + 30)
      
      const { data, error } = await (supabase as any)
        .from('habit_logs')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .in('habit_id', habits.map(h => h.id))

      if (error) throw error
      setWeeklyProgressLogs(data || [])
    } catch (err) {
      console.error('Failed to load weekly progress logs:', err)
    }
  }

  const getWeeklyProgress = () => {
    console.log('🔄 getWeeklyProgress called - todayLogs:', todayLogs.length, 'weeklyProgressLogs:', weeklyProgressLogs.length, 'selectedDate:', selectedDate)
    
    const today = new Date()
    const weekDays = []
    
    // Get past 3 days and next 3 days
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      weekDays.push(date)
    }
    
    return weekDays.map(date => {
      const dateString = date.toISOString().split('T')[0]
      const isToday = dateString === getDateString()
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      const dayNumber = date.getDate()
      
      // Calculate completion for this day
      // Get active habits for this specific date
      const activeHabitsForDay = getActiveHabitsForDate(habits, dateString)
      const totalHabits = activeHabitsForDay.length
      
      // Count completed habits for this day
      let completedHabits = 0
      
      for (const habit of activeHabitsForDay) {
        console.log(`🔍 Checking habit: ${habit.title} (${habit.frequency}) for date ${dateString}`)
        
        if (habit.frequency === 'daily') {
          // For daily habits, check if there's a completed log on this specific date
          // Use todayLogs only if this is the selected date, otherwise use weeklyProgressLogs
          const logsToCheck = dateString === selectedDate ? todayLogs : weeklyProgressLogs
          console.log(`📅 Daily habit - using ${dateString === selectedDate ? 'todayLogs' : 'weeklyProgressLogs'} (${logsToCheck.length} logs)`)
          
          const dayLog = logsToCheck.find(log => 
            log.habit_id === habit.id && 
            log.date === dateString && 
            log.completed
          )
          
          console.log(`🔍 Found log for ${habit.title}:`, dayLog ? `completed=${dayLog.completed}` : 'no log found')
          
          if (dayLog) {
            completedHabits++
            console.log(`✅ Daily habit ${habit.title} completed on ${dateString}`)
          } else {
            console.log(`❌ Daily habit ${habit.title} NOT completed on ${dateString}`)
          }
        } else {
          // For weekly/monthly/custom habits, check if there's a completed log within the period
          const periodStart = getPeriodStartDate(habit.frequency, habit.custom_frequency || undefined, new Date(dateString))
          const periodEnd = getPeriodEndDate(habit.frequency, habit.custom_frequency || undefined, new Date(dateString))
          
          // Check if this date's period matches the selected date's period
          const selectedDatePeriodStart = getPeriodStartDate(habit.frequency, habit.custom_frequency || undefined, new Date(selectedDate))
          const isSelectedDatePeriod = periodStart === selectedDatePeriodStart
          
          console.log(`📅 Period habit - period: ${periodStart} to ${periodEnd}, selected date period: ${selectedDatePeriodStart}, isSelectedDatePeriod: ${isSelectedDatePeriod}`)
          
          // Use todayLogs for the selected date's period, weeklyProgressLogs for others
          const logsToCheck = isSelectedDatePeriod ? todayLogs : weeklyProgressLogs
          console.log(`📅 Using ${isSelectedDatePeriod ? 'todayLogs' : 'weeklyProgressLogs'} (${logsToCheck.length} logs)`)
          
          const periodLog = logsToCheck.find(log => 
            log.habit_id === habit.id && 
            log.date >= periodStart && 
            log.date <= periodEnd && 
            log.completed
          )
          
          console.log(`🔍 Found period log for ${habit.title}:`, periodLog ? `completed=${periodLog.completed}, date=${periodLog.date}` : 'no log found')
          
          if (periodLog) {
            completedHabits++
            console.log(`✅ Period habit ${habit.title} completed for period ${periodStart} to ${periodEnd}`)
          } else {
            console.log(`❌ Period habit ${habit.title} NOT completed for period ${periodStart} to ${periodEnd}`)
          }
        }
      }
      
      const completionRate = totalHabits > 0 ? completedHabits / totalHabits : 0
      
      if (dateString === selectedDate) {
        console.log(`📊 Progress for ${dateString}: ${completedHabits}/${totalHabits} (${Math.round(completionRate * 100)}%)`)
      }
      
      return {
        date: dateString,
        dayName,
        dayNumber,
        isToday,
        completionRate,
        completedHabits,
        totalHabits
      }
    })
  }

  const handleDaySelect = async (date: string) => {
    console.log('Selecting date:', date)
    setSelectedDate(date)
  }

  const updateHabitStreak = async (habitId: string) => {
    try {
      const habit = habits.find(h => h.id === habitId)
      if (!habit) return

      // Get all logs for this habit
      const { data: allLogs, error: logsError } = await (supabase as any)
        .from('habit_logs')
        .select('*')
        .eq('habit_id', habitId)
        .order('date', { ascending: true })

      if (logsError) throw logsError

      // Calculate new streak
      const { currentStreak, longestStreak } = calculateStreakAdvanced(habit, allLogs || [])

      // Update habit with new streak values
      const { error: updateError } = await (supabase as any)
        .from('habits')
        .update({
          current_streak: currentStreak,
          longest_streak: Math.max(habit.longest_streak, longestStreak),
          updated_at: new Date().toISOString()
        })
        .eq('id', habitId)

      if (updateError) throw updateError

      // Update local state - this is necessary for the streak display
      // Use updateHabit to avoid triggering unnecessary reloads
      updateHabit(habitId, {
        current_streak: currentStreak,
        longest_streak: Math.max(habit.longest_streak, longestStreak)
      })
    } catch (err) {
      console.error('Failed to update streak:', err)
    }
  }

  const handleLogUpdate = async (habitId: string, amount: number, completed: boolean) => {
    try {
      console.log('🔵 handleLogUpdate called:', { habitId, amount, completed, selectedDate })
      
      // Find the habit to get its frequency
      const habit = habits.find(h => h.id === habitId)
      if (!habit) {
        console.log('🔵 Habit not found:', habitId)
        return
      }

      console.log('🔵 Found habit:', { id: habit.id, title: habit.title, frequency: habit.frequency })

      // Determine the correct log date based on habit frequency
      let logDate: string
      if (habit.frequency === 'daily') {
        // For daily habits, use the selected date
        logDate = selectedDate
      } else {
        // For weekly/monthly/custom habits, use the period start date
        logDate = getPeriodStartDate(habit.frequency, habit.custom_frequency || undefined, new Date(selectedDate))
      }

      console.log('🔵 Using log date:', logDate, 'for habit frequency:', habit.frequency)

      // Update local state first with the correct log date
      updateLog(habitId, amount, completed, logDate)
      
      // Update in database with the correct log date
      console.log('🔵 Updating database with:', { habit_id: habitId, date: logDate, amount, completed })
      const { data, error } = await (supabase as any)
        .from('habit_logs')
        .upsert({
          habit_id: habitId,
          date: logDate,
          amount,
          completed,
        }, {
          onConflict: 'habit_id,date'
        })
        .select()

      if (error) {
        console.error('🔵 Database update error:', error)
        throw error
      }
      
      console.log('🔵 Database update successful:', data)

      // Refresh logs for the selected date to show the updated data
      const loadLogsForSelectedDate = async () => {
        try {
          console.log('🔄 Reloading logs after update for selected date:', selectedDate)
          
          // For daily habits, load logs for the specific date
          // For weekly/monthly/custom habits, load logs for the entire period
          const dailyHabits = habits.filter(h => h.frequency === 'daily')
          const periodHabits = habits.filter(h => h.frequency !== 'daily')
          
          let allLogs: any[] = []
          
          // Load daily habit logs
          if (dailyHabits.length > 0) {
            const { data: dailyLogs, error: dailyError } = await (supabase as any)
              .from('habit_logs')
              .select('*')
              .eq('date', selectedDate)
              .in('habit_id', dailyHabits.map(h => h.id))
            
            if (dailyError) throw dailyError
            allLogs = [...(dailyLogs || [])]
          }
          
          // Load period habit logs
          for (const habit of periodHabits) {
            const periodStart = getPeriodStartDate(habit.frequency, habit.custom_frequency || undefined, new Date(selectedDate))
            const periodEnd = getPeriodEndDate(habit.frequency, habit.custom_frequency || undefined, new Date(selectedDate))
            
            const { data: periodLogs, error: periodError } = await (supabase as any)
              .from('habit_logs')
              .select('*')
              .eq('habit_id', habit.id)
              .gte('date', periodStart)
              .lte('date', periodEnd)
            
            if (periodError) throw periodError
            allLogs = [...allLogs, ...(periodLogs || [])]
          }
          
          setTodayLogs(allLogs)
        } catch (err) {
          console.error('Error reloading logs after update:', err)
        }
      }
      
      await loadLogsForSelectedDate()

      // Refresh weekly progress logs to update progress rings
      await loadWeeklyProgressLogs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update log')
    }
  }

  const handleDeleteHabit = async (habitId: string) => {
    try {
      // Check if the selected date is in the past
      const today = new Date().toISOString().split('T')[0]
      if (selectedDate < today) {
        setError('Cannot delete habits from past dates')
        return
      }

      // Delete from database
      const { error } = await (supabase as any)
        .from('habits')
        .delete()
        .eq('id', habitId)

      if (error) throw error

      // Update local state
      deleteHabit(habitId)

      // Refresh weekly logs
      await loadWeeklyLogs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete habit')
    }
  }

  const getTodayStats = () => {
    const activeHabitsForSelectedDate = getActiveHabitsForDate(habits, selectedDate)
    const completedHabits = todayLogs.filter(log => log.completed).length
    const totalHabits = activeHabitsForSelectedDate.length
    const completionRate = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0

    return {
      completed: completedHabits,
      total: totalHabits,
      rate: Math.round(completionRate)
    }
  }

  const getCurrentStreak = () => {
    if (!user || habits.length === 0 || streakData.length === 0) return 0

    let currentStreak = 0
    
    // Check backwards from today to find consecutive days with habit activity
    for (const dayData of streakData) {
      if (dayData.hasActivity) {
        currentStreak++
      } else {
        // No activity on this date, streak ends
        break
      }
    }
    
    return currentStreak
  }

  const getWeeklyCompletionRate = () => {
    if (!user || habits.length === 0) return 0

    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)
    const weekEnd = new Date(today)
    weekEnd.setDate(today.getDate() + (6 - today.getDay())) // End of week (Saturday)

    let totalPossibleCompletions = 0
    let actualCompletions = 0

    // Check each day of the week
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(weekStart)
      checkDate.setDate(weekStart.getDate() + i)
      const dateString = checkDate.toISOString().split('T')[0]
      
      // Get active habits for this date
      const activeHabitsForDay = getActiveHabitsForDate(habits, dateString)
      totalPossibleCompletions += activeHabitsForDay.length
      
      // Count completed habits for this day
      for (const habit of activeHabitsForDay) {
        if (habit.frequency === 'daily') {
          // For daily habits, check if there's a completed log on this specific date
          const dayLog = weeklyProgressLogs.find(log => 
            log.habit_id === habit.id && 
            log.date === dateString && 
            log.completed
          )
          if (dayLog) actualCompletions++
        } else {
          // For weekly/monthly/custom habits, check if there's a completed log within the period
          const periodStart = getPeriodStartDate(habit.frequency, habit.custom_frequency || undefined, new Date(dateString))
          const periodEnd = getPeriodEndDate(habit.frequency, habit.custom_frequency || undefined, new Date(dateString))
          
          const periodLog = weeklyProgressLogs.find(log => 
            log.habit_id === habit.id && 
            log.date >= periodStart && 
            log.date <= periodEnd && 
            log.completed
          )
          if (periodLog) actualCompletions++
        }
      }
    }
    
    return totalPossibleCompletions > 0 ? Math.round((actualCompletions / totalPossibleCompletions) * 100) : 0
  }

  const stats = getTodayStats()
  const currentStreak = getCurrentStreak()
  const weeklyCompletionRate = getWeeklyCompletionRate()

  if (!isClient) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Initializing...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your habits...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {selectedDate === getDateString() ? "Today's Habits" : "Habits"}
            </h1>
            <p className="text-muted-foreground">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button onClick={() => setShowHabitForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Habit
          </Button>
        </div>

        {/* Weekly Progress Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Weekly Progress</h3>
              <span className="text-sm text-muted-foreground">
                {getWeeklyProgress().filter(day => day.isToday)[0]?.completedHabits || 0} / {getActiveHabitsForDate(habits, getDateString()).length} today
              </span>
            </div>
            <div className="flex items-center justify-between">
              {getWeeklyProgress().map((day, index) => (
                <div key={day.date} className="flex flex-col items-center space-y-2">
                  <div className={`text-xs font-medium transition-colors duration-200 ${
                    selectedDate === day.date 
                      ? 'text-white' 
                      : 'text-muted-foreground'
                  }`}>
                    {day.dayName}
                  </div>
                  
                  {/* Container with filled oval background for selected day */}
                  <div className={`relative transition-all duration-300 ${
                    selectedDate === day.date 
                      ? 'bg-primary rounded-2xl px-4 py-3 shadow-lg' 
                      : 'hover:bg-muted/50 rounded-2xl px-4 py-3'
                  }`}>
                    <button
                      onClick={() => handleDaySelect(day.date)}
                      className="relative transition-all duration-200 hover:scale-105"
                    >
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium relative z-10 ${
                        day.isToday 
                          ? selectedDate === day.date
                            ? day.completionRate === 1
                              ? 'border-white bg-white/20 text-primary'
                              : 'border-white bg-white/20 text-white'
                            : day.completionRate === 1
                              ? 'border-primary bg-primary/10 text-white'
                              : 'border-primary bg-primary/10 text-primary'
                          : selectedDate === day.date
                            ? day.completionRate === 1
                              ? 'border-white bg-white/20 text-primary'
                              : 'border-white bg-white/20 text-white'
                            : day.completionRate === 1
                              ? 'border-muted-foreground/30 text-white'
                              : 'border-muted-foreground/30 hover:border-primary/50'
                      }`}>
                        {day.dayNumber}
                      </div>
                      {/* Progress ring */}
                      <div className="absolute inset-0 rounded-full">
                        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 24 24">
                          {day.completionRate === 1 ? (
                            // Filled circle when 100% complete
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              fill="currentColor"
                              className={selectedDate === day.date ? 'text-white' : 'text-green-500'}
                            />
                          ) : (
                            // Progress ring for partial completion
                            <>
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                className={selectedDate === day.date ? 'text-white/50' : 'text-muted-foreground/20'}
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 10}`}
                                strokeDashoffset={`${2 * Math.PI * 10 * (1 - day.completionRate)}`}
                                className={`transition-all duration-300 ${
                                  selectedDate === day.date
                                    ? day.completionRate > 0 
                                      ? 'text-blue-100' 
                                      : 'text-white/50'
                                    : day.completionRate > 0 
                                      ? 'text-blue-500' 
                                      : 'text-muted-foreground/20'
                                }`}
                                style={{
                                  strokeDasharray: `${2 * Math.PI * 10}`,
                                  strokeDashoffset: `${2 * Math.PI * 10 * (1 - day.completionRate)}`,
                                  strokeLinecap: 'round'
                                }}
                              />
                            </>
                          )}
                        </svg>
                      </div>
                    </button>
                    
                    {/* Progress text below the circle */}
                    <div className={`text-xs text-center mt-2 transition-colors duration-200 ${
                      selectedDate === day.date ? 'text-white' : ''
                    }`}>
                      <div className={`font-medium ${
                        selectedDate === day.date
                          ? 'text-white'
                          : day.completionRate === 1 
                            ? 'text-green-600' 
                            : 'text-muted-foreground'
                      }`}>
                        {Math.round(day.completionRate * 100)}%
                      </div>
                      <div className={`text-xs ${
                        selectedDate === day.date 
                          ? 'text-white/80' 
                          : 'text-muted-foreground'
                      }`}>
                        {day.completedHabits}/{day.totalHabits}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}/{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.rate}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</div>
              <p className="text-xs text-muted-foreground">
                {currentStreak === 0 ? 'Start your streak!' : currentStreak < 7 ? 'Keep it up! 🔥' : currentStreak < 30 ? 'Amazing! 🔥🔥' : 'Incredible! 🔥🔥🔥'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyCompletionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Weekly completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Habits List */}
        {(() => {
          const activeHabitsForSelectedDate = getActiveHabitsForDate(habits, selectedDate)
          
          if (activeHabitsForSelectedDate.length === 0) {
            return (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {habits.length === 0 ? "No habits yet" : "No active habits for this date"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {habits.length === 0 
                      ? "Start building your routine by adding your first habit."
                      : "This habit hasn't started yet or has ended for this date."
                    }
                  </p>
                  <Button onClick={() => setShowHabitForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {habits.length === 0 ? "Create Your First Habit" : "Add New Habit"}
                  </Button>
                </CardContent>
              </Card>
            )
          }
          
          if (isLoadingLogs) {
            return (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading habits for {selectedDate}...</p>
                </CardContent>
              </Card>
            )
          }
          
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeHabitsForSelectedDate.map((habit, index) => {
                const todayLog = todayLogs.find(log => log.habit_id === habit.id)
                console.log(`Rendering habit ${habit.title} for date ${selectedDate}:`, {
                  habitId: habit.id,
                  log: todayLog,
                  allLogs: todayLogs
                })
                return (
                  <div 
                    key={`${habit.id}-${selectedDate}`}
                  >
                    <HabitCard
                      habit={habit}
                      todayLog={todayLog}
                      selectedDate={selectedDate}
                      onUpdate={handleLogUpdate}
                      onDelete={handleDeleteHabit}
                    />
                  </div>
                )
              })}
            </div>
          )
        })()}

        {/* Habit Form Modal */}
        {showHabitForm && (
          <HabitForm onClose={() => setShowHabitForm(false)} />
        )}
      </div>
    </Layout>
  )
}
