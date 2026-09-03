import { createClient } from '@supabase/supabase-js'
import { Database } from './src/supabase.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabase = createClient<Database>(
	supabaseUrl ?? 'https://placeholder.supabase.co',
	supabaseKey ?? 'missing-supabase-key',
)