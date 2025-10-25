'use client'

import { useEffect, useState, useRef } from 'react'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database.types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Calendar, Flame, Target, TrendingUp } from 'lucide-react'
import * as d3 from 'd3'

type TabType = 'weekly' | 'monthly' | 'yearly'

type Habit = Database['public']['Tables']['habits']['Row']
type HabitLog = Database['public']['Tables']['habit_logs']['Row']

export default function AnalyticsPage() {
  const { user, habits } = useAppStore()
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('weekly')
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const heatmapRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadAnalytics()
    }
  }, [user, selectedYear])

  useEffect(() => {
    if (activeTab === 'yearly' && logs.length > 0 && habits.length > 0) {
      createHeatmap()
    }
  }, [activeTab, logs, habits, selectedYear])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      
      // Get logs for the selected year
      const startOfYear = new Date(selectedYear, 0, 1)
      const endOfYear = new Date(selectedYear, 11, 31)
      
      const { data, error } = await (supabase as any)
        .from('habit_logs')
        .select('*')
        .gte('date', startOfYear.toISOString().split('T')[0])
        .lte('date', endOfYear.toISOString().split('T')[0])
        .order('date', { ascending: true })

      if (error) throw error
      setLogs(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  const getWeeklyData = () => {
    const weeklyData = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayLogs = logs.filter(log => log.date === dateStr)
      const completedCount = dayLogs.filter(log => log.completed).length
      const totalHabits = habits.length
      
      weeklyData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedCount,
        total: totalHabits,
        percentage: totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0
      })
    }
    
    return weeklyData
  }

  const getMaxHabitsForWeek = () => {
    const today = new Date()
    let maxHabits = 0
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // Get active habits for this specific date
      const activeHabits = habits.filter(habit => habit.is_active)
      maxHabits = Math.max(maxHabits, activeHabits.length)
    }
    
    return maxHabits
  }


  const createHeatmap = () => {
    if (!heatmapRef.current || activeTab !== 'yearly') return

    // Clear previous heatmap
    d3.select(heatmapRef.current).selectAll("*").remove()

    // --- Config ---
    const weeks = 52
    const days = 7
    const cellSize = 12
    const padding = 2
    const width = weeks * (cellSize + padding)
    const height = days * (cellSize + padding)

    const svg = d3.select(heatmapRef.current)
      .append("svg")
      .attr("width", width + 60)
      .attr("height", height + 40)
      .append("g")
      .attr("transform", "translate(30, 30)")

    // --- Generate data for selected year ---
    const startOfYear = new Date(selectedYear, 0, 1)
    const endOfYear = new Date(selectedYear, 11, 31)
    
    const data = d3.timeDays(startOfYear, endOfYear).map(date => {
      const dateStr = date.toISOString().split('T')[0]
      const dayLogs = logs.filter(log => log.date === dateStr)
      const completedCount = dayLogs.filter(log => log.completed).length
      const activeHabits = habits.filter(habit => habit.is_active)
      const totalHabits = activeHabits.length
      
      // Calculate completion percentage
      const completionRate = totalHabits > 0 ? completedCount / totalHabits : 0
      
      // Map to intensity levels (0-4) based on percentage
      let intensity = 0
      if (completionRate > 0) {
        if (completionRate <= 0.25) intensity = 1
        else if (completionRate <= 0.5) intensity = 2
        else if (completionRate <= 0.75) intensity = 3
        else intensity = 4
      }
      
      return {
        date,
        value: intensity,
        completedCount,
        totalHabits,
        completionRate: Math.round(completionRate * 100)
      }
    })

    // --- Scales ---
    const color = d3.scaleOrdinal<number, string>()
      .domain([0, 1, 2, 3, 4])
      .range(["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"])

    const week = (d: any) => d3.timeWeek.count(d3.timeYear(startOfYear), d.date)
    const day = (d: any) => d.date.getDay()

    // --- Draw cells ---
    svg.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", (d: any) => week(d) * (cellSize + padding))
      .attr("y", (d: any) => day(d) * (cellSize + padding))
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("fill", (d: any) => color(d.value))
      .append("title")
      .text((d: any) => `${d.completedCount}/${d.totalHabits} habits completed (${d.completionRate}%) on ${d3.timeFormat("%b %d, %Y")(d.date)}`)

    // --- Add month labels ---
    const months = d3.timeMonths(d3.timeMonth.floor(startOfYear), endOfYear)
    svg.selectAll("text.month")
      .data(months)
      .join("text")
      .attr("class", "month")
      .attr("x", (d: any) => week({date: d}) * (cellSize + padding))
      .attr("y", -8)
      .attr("font-size", "12px")
      .attr("fill", "#666")
      .text(d3.timeFormat("%b"))
  }

  const getHabitStats = () => {
    return habits.map(habit => {
      const habitLogs = logs.filter(log => log.habit_id === habit.id)
      const completedCount = habitLogs.filter(log => log.completed).length
      const totalDays = habitLogs.length
      const successRate = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0
      
      // Calculate current streak
      let streak = 0
      const sortedLogs = habitLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
      
      return {
        ...habit,
        successRate,
        streak,
        completedCount,
        totalDays
      }
    })
  }

  const getOverallStats = () => {
    const totalLogs = logs.length
    const completedLogs = logs.filter(log => log.completed).length
    const successRate = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 0
    
    const habitStats = getHabitStats()
    const bestHabit = habitStats.reduce((best, current) => 
      current.successRate > best.successRate ? current : best, habitStats[0] || { successRate: 0 }
    )
    
    const longestStreak = Math.max(...habitStats.map(h => h.streak), 0)
    
    return {
      successRate,
      totalHabits: habits.length,
      bestHabit,
      longestStreak
    }
  }

  const weeklyData = getWeeklyData()
  const maxHabitsForWeek = getMaxHabitsForWeek()
  const habitStats = getHabitStats()
  const overallStats = getOverallStats()

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading analytics...</p>
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
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track your progress and celebrate your achievements
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'weekly'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'monthly'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'yearly'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Yearly
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'weekly' && (
          <div className="space-y-6">
            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis 
                      domain={[0, maxHabitsForWeek]}
                      tickCount={maxHabitsForWeek + 1}
                    />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Week</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {weeklyData.reduce((sum, day) => sum + day.completed, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total completions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Day</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.max(...weeklyData.map(day => day.completed))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Most completions in a day
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(weeklyData.reduce((sum, day) => sum + day.completed, 0) / 7)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Completions per day
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallStats.successRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Overall completion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallStats.totalHabits}</div>
                  <p className="text-xs text-muted-foreground">
                    Active habits
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
                  <Flame className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallStats.longestStreak}</div>
                  <p className="text-xs text-muted-foreground">
                    Days in a row
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Habit</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{overallStats.bestHabit?.title || 'N/A'}</div>
                  <p className="text-xs text-muted-foreground">
                    {overallStats.bestHabit?.successRate || 0}% success rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Habit Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Habit Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {habitStats.map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: habit.color }}
                        />
                        <div>
                          <h3 className="font-medium">{habit.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {habit.completedCount} completions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{habit.successRate}%</div>
                        <div className="text-sm text-muted-foreground">
                          {habit.streak} day streak
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'yearly' && (
          <div className="space-y-6">
            {/* Year Selector */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Yearly Analytics</h2>
                <p className="text-muted-foreground">
                  View your habit completion patterns by year
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="year-select" className="text-sm font-medium">
                  Year:
                </label>
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-1 border rounded-md bg-background text-sm"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>

            {/* Yearly Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedYear} Activity Heatmap</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Color intensity represents the percentage of habits completed each day
                </p>
              </CardHeader>
              <CardContent>
                <div ref={heatmapRef} className="overflow-x-auto"></div>
              </CardContent>
            </Card>

            {/* Yearly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Completions</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {logs.filter(log => log.completed).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    In {selectedYear}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Days</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(logs.filter(log => log.completed).map(log => log.date)).size}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Days with completions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average per Day</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(logs.filter(log => log.completed).length / 365 * 10) / 10}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Completions per day in {selectedYear}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
