import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wprlcucuavwgqnmajtbk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwcmxjdWN1YXZ3Z3FubWFqdGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ5NDI0MTUsImV4cCI6MTk3MDUxODQxNX0.YSLmZ719OZEWzRcb9sHOuMDzEE3xdslbyb8oYFZZ0sc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey)