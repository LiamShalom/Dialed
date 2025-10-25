import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Target, BarChart3, Bell, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Target,
      title: 'Track Your Habits',
      description: 'Create and manage daily habits with simple, intuitive tracking.'
    },
    {
      icon: BarChart3,
      title: 'Visualize Progress',
      description: 'See your progress with beautiful charts and streak calendars.'
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Get personalized notifications to stay on track.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is secure and private. No ads, no tracking.'
    }
  ]

  const benefits = [
    'Build lasting habits with proven methods',
    'Track streaks and celebrate milestones',
    'Beautiful, distraction-free interface',
    'Works offline, syncs everywhere',
    'Free forever for up to 5 habits'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">Dialed</div>
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build Better Habits
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The simple, beautiful habit tracker that helps you build lasting routines. 
            Track your progress, celebrate streaks, and achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Building Habits
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything you need to succeed</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple tools, powerful results. Grit helps you build habits that stick.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 bg-background/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why choose Grit?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <Zap className="h-12 w-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Start your journey today</h3>
              <p className="mb-6">
                Join thousands of people who are building better habits with Grit. 
                It's free to get started, and you can upgrade anytime.
              </p>
              <Link href="/auth/signup">
                <Button variant="secondary" size="lg" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to build better habits?</h2>
          <p className="text-muted-foreground mb-8">
            Start your habit tracking journey today. It's free, simple, and effective.
          </p>
          <Link href="/auth/signup">
            <Button size="lg">
              Start Building Habits
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-primary mb-4 md:mb-0">Dialed</div>
            <div className="text-sm text-muted-foreground">
              © 2024 Dialed. Built with ❤️ for habit builders.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}