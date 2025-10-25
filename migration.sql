-- Migration script to add streak columns and ensure proper constraints

-- First, update any existing habits with invalid frequency to 'daily'
UPDATE habits SET frequency = 'daily' WHERE frequency NOT IN ('daily', 'weekly', 'monthly', 'custom');

-- Add streak columns if they don't exist
DO $$ 
BEGIN
    -- Add current_streak column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'habits' AND column_name = 'current_streak') THEN
        ALTER TABLE habits ADD COLUMN current_streak INTEGER DEFAULT 0;
    END IF;
    
    -- Add longest_streak column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'habits' AND column_name = 'longest_streak') THEN
        ALTER TABLE habits ADD COLUMN longest_streak INTEGER DEFAULT 0;
    END IF;
    
    -- Initialize streak values for existing habits
    UPDATE habits SET current_streak = 0 WHERE current_streak IS NULL;
    UPDATE habits SET longest_streak = 0 WHERE longest_streak IS NULL;
END $$;

-- Ensure the frequency constraint is properly set
ALTER TABLE habits DROP CONSTRAINT IF EXISTS habits_frequency_check;
ALTER TABLE habits ADD CONSTRAINT habits_frequency_check CHECK (frequency IN ('daily', 'weekly', 'monthly', 'custom'));
