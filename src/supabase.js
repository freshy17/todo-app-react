import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://nhdzrzcfprpiwiasiibo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZHpyemNmcHJwaXdpYXNpaWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDkwNTcsImV4cCI6MjA5NjU4NTA1N30.XjqxEH7s8BRHwemuUGtSFmfydiO5cknNDKVQx1b61iw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)