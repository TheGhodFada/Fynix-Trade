// assets/js/supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔥 IMPORTANT — replace these with your own values
const SUPABASE_URL = "https://oexcxbedyhwrvqqrcewl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leGN4YmVkeWh3cnZxcXJjZXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MTk0MzAsImV4cCI6MjA4MDA5NTQzMH0.xvbnnKt122QoJ-mdR78U-GrpEWjuSpOnYY6QlwR5hD0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
