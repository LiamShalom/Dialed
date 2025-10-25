'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Database } from '@/lib/database.types'
import { useAppStore } from '@/lib/store'
import { getIconByName, getPeriodDisplayName, getPeriodProgress } from '@/lib/utils'
import { Plus, Minus, Target, Flame, Trash2 } from 'lucide-react'

type Habit = Database['public']['Tables']['habits']['Row']
type HabitLog = Database['public']['Tables']['habit_logs']['Row']

interface HabitCardProps {
  habit: Habit
  todayLog?: HabitLog
  selectedDate: string
  onUpdate: (habitId: string, amount: number, completed: boolean) => void
  onDelete: (habitId: string) => void
}

export function HabitCard({ habit, todayLog, selectedDate, onUpdate, onDelete }: HabitCardProps) {
  const [amount, setAmount] = useState(todayLog?.amount || 0)
  const [isCompleted, setIsCompleted] = useState(todayLog?.completed || false)
  
  // Debug: log the icon value
  console.log('Habit icon:', habit.icon, 'Type:', typeof habit.icon)

  const handleAmountChange = (newAmount: number) => {
    console.log('🔄 handleAmountChange called:', { habitId: habit.id, newAmount, frequency: habit.frequency })
    const clampedAmount = Math.max(0, newAmount) // Only prevent negative values, allow exceeding target
    setAmount(clampedAmount)
    const completed = clampedAmount >= habit.target
    setIsCompleted(completed)
    console.log('🔄 Calling onUpdate:', { habitId: habit.id, clampedAmount, completed })
    onUpdate(habit.id, clampedAmount, completed)
  }

  const handleIncrement = () => {
    if (habit.unit === 'minutes') {
      handleAmountChange(amount + 5)
    } else {
      handleAmountChange(amount + 1)
    }
  }

  const handleDecrement = () => {
    if (habit.unit === 'minutes') {
      handleAmountChange(amount - 5)
    } else {
      handleAmountChange(amount - 1)
    }
  }


  const getProgressPercentage = () => {
    const percentage = getPeriodProgress(amount, habit.target, habit.frequency, habit.custom_frequency || undefined)
    // Cap the visual progress bar at 100% even if amount exceeds target
    return Math.min(percentage, 100)
  }

  const isExceedingTarget = () => {
    return amount > habit.target
  }

  const isFutureDate = () => {
    const today = new Date().toISOString().split('T')[0]
    return selectedDate > today
  }

  const isPastDate = () => {
    const today = new Date().toISOString().split('T')[0]
    return selectedDate < today
  }

  const getStreakColor = () => {
    const percentage = getProgressPercentage()
    if (percentage === 100) return 'text-green-500'
    if (percentage >= 50) return 'text-yellow-500'
    return 'text-gray-400'
  }

  // Generate color variants for the card
  const getCardStyles = () => {
    const baseColor = habit.color
    
    if (isCompleted) {
      // When completed, use the full color as background
      return {
        backgroundColor: baseColor,
        borderColor: baseColor,
        color: 'white'
      }
    } else {
      // When incomplete, use a lighter variant as background with colored border
      return {
        backgroundColor: `${baseColor}15`, // 15% opacity
        borderColor: baseColor,
        color: 'inherit'
      }
    }
  }

  const cardStyles = getCardStyles()

  return (
    <Card 
      className="w-full transition-all duration-500 ease-in-out hover:shadow-lg transform"
      style={{
        backgroundColor: cardStyles.backgroundColor,
        borderColor: cardStyles.borderColor,
        borderWidth: '2px',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full border-2 border-white/50"
              style={{ backgroundColor: isCompleted ? 'white' : habit.color }}
            />
            <div className="flex flex-col">
              <CardTitle 
                className="text-lg"
                style={{ color: cardStyles.color }}
              >
                {habit.title}
              </CardTitle>
            </div>
            {habit.icon && (() => {
              const IconComponent = getIconByName(habit.icon)
              return IconComponent ? (
                <div className="text-xl">
                  {React.createElement(IconComponent, { 
                    className: "h-5 w-5",
                    style: { color: isCompleted ? 'rgba(255,255,255,0.7)' : '#374151' }
                  })}
                </div>
              ) : null
            })()}
          </div>
          <div className="flex items-center space-x-2">
            <span 
              className="text-sm"
              style={{ 
                color: isCompleted ? 'rgba(255,255,255,0.8)' : 'inherit'
              }}
            >
              <span className={isExceedingTarget() ? 'font-bold' : ''}>
                {amount}
              </span>
              /{habit.target}
              {isExceedingTarget() && (
                <span 
                  className="ml-1 text-xs px-1 py-0.5 rounded"
                  style={{
                    backgroundColor: isCompleted ? 'rgba(255,255,255,0.2)' : '#10b981',
                    color: isCompleted ? 'rgba(255,255,255,0.9)' : 'white'
                  }}
                >
                  +{amount - habit.target}
                </span>
              )}
            </span>
            {/* Streak Display */}
            <div className="flex items-center space-x-1 ml-2">
              <Flame className="h-3 w-3" style={{ color: isCompleted ? 'rgba(255,255,255,0.7)' : '#f59e0b' }} />
              <span 
                className="text-xs font-medium"
                style={{ 
                  color: isCompleted ? 'rgba(255,255,255,0.7)' : '#6b7280'
                }}
              >
                {habit.current_streak || 0}
              </span>
              {habit.longest_streak > (habit.current_streak || 0) && (
                <span 
                  className="text-xs"
                  style={{ 
                    color: isCompleted ? 'rgba(255,255,255,0.5)' : '#9ca3af'
                  }}
                >
                  (best: {habit.longest_streak})
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(habit.id)}
              className="hover:text-red-700 hover:bg-red-50"
              style={{ color: isCompleted ? 'rgba(255,255,255,0.7)' : '#374151' }}
              disabled={isFutureDate() || isPastDate()}
              title={isPastDate() ? "Cannot delete habits from past dates" : isFutureDate() ? "Cannot delete habits from future dates" : "Delete habit"}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div 
          className="w-full rounded-full h-2"
          style={{
            backgroundColor: isCompleted ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'
          }}
        >
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${getProgressPercentage()}%`,
              backgroundColor: isCompleted ? 'white' : habit.color,
            }}
          />
        </div>

        {/* Controls */}
        {(!isFutureDate() || habit.frequency !== 'daily') && (
          <div className="flex items-center justify-between">
            {/* Frequency Badge - left aligned */}
            <span 
              className="text-xs px-2 py-1 rounded-full font-medium"
              style={{
                backgroundColor: isCompleted ? 'rgba(255,255,255,0.2)' : `${habit.color}20`,
                color: isCompleted ? 'rgba(255,255,255,0.9)' : habit.color,
                border: `1px solid ${isCompleted ? 'rgba(255,255,255,0.3)' : habit.color}`
              }}
            >
              {habit.frequency === 'daily' ? 'Daily' : 
               habit.frequency === 'weekly' ? 'Weekly' : 
               habit.frequency === 'monthly' ? 'Monthly' : 
               `Every ${habit.custom_frequency} days`}
            </span>
            
            {/* Count Controls - right aligned */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecrement}
                disabled={amount <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <Input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(parseInt(e.target.value) || 0)}
                className="w-16 text-center"
                min="0"
                step={habit.unit === 'minutes' ? '5' : '1'}
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleIncrement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Target Display */}
        <div 
          className="flex items-center justify-center text-sm"
          style={{ 
            color: isCompleted ? 'rgba(255,255,255,0.7)' : 'inherit'
          }}
        >
          <Target className="h-4 w-4 mr-1" style={{ color: isCompleted ? 'rgba(255,255,255,0.7)' : '#374151' }} />
          <span className="mr-1">Target:</span>
          <span className="font-medium">{habit.target}</span>
          <span className="ml-1">
            {habit.unit === 'minutes' ? 'minutes' : habit.unit === 'count' ? (habit.target === 1 ? 'time' : 'times') : ''}
          </span>
          <span className="ml-1 text-xs opacity-75">
            {getPeriodDisplayName(habit.frequency, habit.custom_frequency || undefined).toLowerCase()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
