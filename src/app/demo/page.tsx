import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, Flame, BarChart3, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  const demoHabits = [
    {
      id: '1',
      title: 'Drink Water',
      color: '#3b82f6',
      icon: '💧',
      target: 8,
      unit: 'count',
      completed: 5,
      streak: 7
    },
    {
      id: '2',
      title: 'Exercise',
      color: '#22c55e',
      icon: '🏃',
      target: 30,
      unit: 'minutes',
      completed: 30,
      streak: 12
    },
    {
      id: '3',
      title: 'Read',
      color: '#f59e0b',
      icon: '📚',
      target: 1,
      unit: 'boolean',
      completed: 1,
      streak: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">Dialed</Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">See Dialed in Action</h1>
            <p className="text-xl text-muted-foreground">
              Experience the power of habit tracking with this interactive demo
            </p>
          </div>

          {/* Demo Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2/3</div>
                <p className="text-xs text-muted-foreground">67% completion rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 days</div>
                <p className="text-xs text-muted-foreground">Keep it up! 🔥</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Weekly completion rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Demo Habits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {demoHabits.map((habit) => (
              <Card key={habit.id} className="w-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      <CardTitle className="text-lg">{habit.title}</CardTitle>
                      <span className="text-xl">{habit.icon}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-muted-foreground">
                        {habit.completed}/{habit.target}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((habit.completed / habit.target) * 100, 100)}%`,
                        backgroundColor: habit.color,
                      }}
                    />
                  </div>

                  {/* Demo Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        -
                      </Button>
                      
                      <div className="w-16 text-center px-2 py-1 border rounded">
                        {habit.completed}
                      </div>
                      
                      <Button variant="outline" size="sm" disabled>
                        +
                      </Button>
                    </div>

                    <Button
                      variant={habit.completed >= habit.target ? "default" : "outline"}
                      size="sm"
                      className={habit.completed >= habit.target ? "bg-green-500 hover:bg-green-600" : ""}
                      disabled
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {habit.completed >= habit.target ? 'Completed' : 'Complete'}
                    </Button>
                  </div>

                  {/* Target Display */}
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Target className="h-4 w-4 mr-1" />
                    Target: {habit.target} {habit.unit === 'minutes' ? 'minutes' : habit.unit === 'count' ? 'times' : ''}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Analytics Dashboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Track your progress with beautiful charts and insights. See your streaks, 
                  completion rates, and identify patterns in your habits.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-32 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Smart Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Simple, intuitive habit tracking. Log your progress with just a few taps. 
                  Support for different units: count, minutes, or yes/no.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-32 flex items-center justify-center">
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to start your journey?</h2>
            <p className="mb-6">
              Join thousands of people who are building better habits with Dialed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button variant="secondary" size="lg">
                  Start Building Habits
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
