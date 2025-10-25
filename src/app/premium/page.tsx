'use client'

import { Layout } from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Crown, Zap, Star, Shield } from 'lucide-react'

export default function PremiumPage() {
  const features = [
    'Unlimited habits',
    'Advanced analytics',
    'Custom themes',
    'Data export',
    'Priority support',
    'No ads'
  ]

  const benefits = [
    {
      icon: Zap,
      title: 'Unlimited Habits',
      description: 'Track as many habits as you want without restrictions.'
    },
    {
      icon: Star,
      title: 'Advanced Analytics',
      description: 'Get detailed insights into your habit patterns and progress.'
    },
    {
      icon: Shield,
      title: 'Data Export',
      description: 'Export your data anytime in multiple formats.'
    }
  ]

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Crown className="h-4 w-4" />
            <span>Premium</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock unlimited habits, advanced analytics, and premium features to supercharge your habit-building journey.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-primary">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Premium</CardTitle>
              <div className="text-4xl font-bold">$4.99<span className="text-lg font-normal">/month</span></div>
              <p className="text-muted-foreground">Cancel anytime</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button className="w-full" size="lg">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Secure payment powered by Stripe
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">What happens to my data if I cancel?</h3>
              <p className="text-muted-foreground">
                Your data remains safe and accessible. You can export all your data before canceling, and it will be stored according to our privacy policy.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                Yes! You can try premium features for 7 days free. No credit card required to start your trial.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to level up your habits?</h2>
          <p className="mb-6">
            Join thousands of users who have upgraded to premium and are building better habits.
          </p>
          <Button variant="secondary" size="lg">
            <Crown className="h-4 w-4 mr-2" />
            Start Free Trial
          </Button>
        </div>
      </div>
    </Layout>
  )
}
