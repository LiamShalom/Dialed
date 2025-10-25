'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/lib/store'
import { getHabitColors, getHabitIcons, getIconByName } from '@/lib/utils'
import { COMMON_HABITS, HABIT_CATEGORIES, PREDEFINED_COLORS } from '@/lib/common-habits'
import { X, Plus, Palette } from 'lucide-react'

interface HabitFormProps {
  onClose: () => void
  habit?: any // For editing existing habits
}

export function HabitForm({ onClose, habit }: HabitFormProps) {
  const { user, addHabit, updateHabit } = useAppStore()
  const [title, setTitle] = useState(habit?.title || '')
  const [description, setDescription] = useState(habit?.description || '')
  const [color, setColor] = useState(habit?.color || '#3b82f6')
  const [icon, setIcon] = useState(habit?.icon || '')
  const [frequency, setFrequency] = useState(habit?.frequency || 'daily')
  const [customFrequency, setCustomFrequency] = useState(habit?.custom_frequency || 1)
  const [unit, setUnit] = useState(habit?.unit || 'count')
  const [target, setTarget] = useState(habit?.target || 1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCommonHabits, setShowCommonHabits] = useState(!habit) // Show for new habits only
  const [selectedCategory, setSelectedCategory] = useState('Health & Fitness')
  const [customColor, setCustomColor] = useState('#3b82f6')
  const [showCustomColor, setShowCustomColor] = useState(false)

  const supabase = createClient()
  const colors = getHabitColors()
  const icons = getHabitIcons()

  const handleCommonHabitSelect = (commonHabit: any) => {
    setTitle(commonHabit.title)
    setDescription(commonHabit.description)
    setColor(commonHabit.color)
    
    // Convert the common habit icon component to the format expected by the form
    const iconObject = icons.find(icon => icon.component === commonHabit.icon)
    setIcon(iconObject || '')
    
    setShowCommonHabits(false)
  }

  const handleCustomColorChange = (newColor: string) => {
    setCustomColor(newColor)
    setColor(newColor)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Convert icon component to string name for storage
      const iconName = icon?.name || null

      if (habit) {
        // Update existing habit
        const { data, error } = await (supabase as any)
          .from('habits')
          .update({
            title,
            description,
            color,
            icon: iconName,
            frequency,
            custom_frequency: frequency === 'custom' ? customFrequency : null,
            unit,
            target,
            updated_at: new Date().toISOString()
          })
          .eq('id', habit.id)

        if (error) throw error

        updateHabit(habit.id, {
          title,
          description,
          color,
          icon: iconName,
          frequency,
          custom_frequency: frequency === 'custom' ? customFrequency : null,
          unit,
          target
        })
      } else {
        // Create new habit
        const { data, error } = await (supabase as any)
          .from('habits')
          .insert({
            user_id: user?.id,
            title,
            description,
            color,
            icon: iconName,
            frequency,
            custom_frequency: frequency === 'custom' ? customFrequency : null,
            unit,
            target,
            position: 0 // Will be updated after creation
          })
          .select()
          .single()

        if (error) throw error

        addHabit(data)
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save habit')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{habit ? 'Edit Habit' : 'Create New Habit'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {showCommonHabits ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Choose a Common Habit</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select from popular habits or create your own
                </p>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {HABIT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Common Habits Grid */}
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {COMMON_HABITS
                  .filter(habit => habit.category === selectedCategory)
                  .map((commonHabit) => {
                    const IconComponent = commonHabit.icon
                    return (
                      <button
                        key={commonHabit.id}
                        type="button"
                        onClick={() => handleCommonHabitSelect(commonHabit)}
                        className="p-3 rounded-lg border border-input hover:border-primary hover:bg-primary/5 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: commonHabit.color }}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {commonHabit.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {commonHabit.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
              </div>

              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setShowCommonHabits(false)}
                  className="flex-1"
                >
                  Create Custom
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Habit Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Drink 8 glasses of water"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description (optional)
              </label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Color</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomColor(!showCustomColor)}
                  className="text-xs"
                >
                  <Palette className="h-3 w-3 mr-1" />
                  Custom
                </Button>
              </div>
              
              {showCustomColor ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="w-8 h-8 rounded border border-input"
                    />
                    <Input
                      value={customColor}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Enter a hex color code or use the color picker
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_COLORS.map((colorOption) => (
                    <button
                      key={colorOption}
                      type="button"
                      onClick={() => setColor(colorOption)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        color === colorOption ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: colorOption }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Icon (optional)</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIcon('')}
                  className={`w-8 h-8 rounded border flex items-center justify-center ${
                    !icon || icon === '' ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'
                  }`}
                >
                  <X className="h-4 w-4" style={{ color: !icon || icon === '' ? '#3b82f6' : '#374151' }} />
                </button>
                {icons.map((iconOption, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setIcon(iconOption)}
                    className={`w-8 h-8 rounded border flex items-center justify-center ${
                      icon?.name === iconOption.name ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'
                    }`}
                  >
                    {React.createElement(iconOption.component, { 
                      className: "h-4 w-4",
                      style: { color: icon?.name === iconOption.name ? '#3b82f6' : '#374151' }
                    })}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium mb-2">
                Frequency
              </label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {frequency === 'custom' && (
              <div>
                <label htmlFor="customFrequency" className="block text-sm font-medium mb-2">
                  Custom Frequency (days)
                </label>
                <Input
                  id="customFrequency"
                  type="number"
                  value={customFrequency}
                  onChange={(e) => setCustomFrequency(parseInt(e.target.value) || 1)}
                  min="1"
                  placeholder="e.g., 3 for every 3 days"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How many days between each habit check-in
                </p>
              </div>
            )}

            <div>
              <label htmlFor="unit" className="block text-sm font-medium mb-2">
                Unit
              </label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="count">Count (times)</option>
                <option value="minutes">Minutes</option>
              </select>
            </div>

            <div>
              <label htmlFor="target" className="block text-sm font-medium mb-2">
                Target
              </label>
              <Input
                id="target"
                type="number"
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value) || 1)}
                min="1"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {frequency === 'daily' && (unit === 'minutes' ? 'minutes per day' : 
                 unit === 'count' ? 'times per day' : 
                 'completion per day')}
                {frequency === 'weekly' && (unit === 'minutes' ? 'minutes per week' : 
                 unit === 'count' ? 'times per week' : 
                 'completion per week')}
                {frequency === 'monthly' && (unit === 'minutes' ? 'minutes per month' : 
                 unit === 'count' ? 'times per month' : 
                 'completion per month')}
                {frequency === 'custom' && (unit === 'minutes' ? `minutes per ${customFrequency} days` : 
                 unit === 'count' ? `times per ${customFrequency} days` : 
                 `completion per ${customFrequency} days`)}
              </p>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Saving...' : (habit ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
