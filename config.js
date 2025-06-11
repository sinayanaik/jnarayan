// Supabase configuration
const SUPABASE_URL = 'https://ktiiyeuvsvbqnrhqbwmr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0aWl5ZXV2c3ZicW5yaHFid21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NjI1OTIsImV4cCI6MjA2NTEzODU5Mn0.yPZY4oo70R4UXl4grSLyLRfNLJzFg1EYMeoKjpZy6tA';

// Initialize the Supabase client
const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Make sure the client is available globally
window.supabaseClient = supabaseClient;

// Initialize and export the client
window.initSupabase = initSupabase;

// Initialize the client when the script loads
document.addEventListener('DOMContentLoaded', () => {
    if (!window.supabaseClient) {
        window.supabaseClient = initSupabase();
    }
}); 