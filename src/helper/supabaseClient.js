import { createClient} from "@supabase/supabase-js";

const supabaseUrl = "https://tvuyptqtizgfwxazpcpr.supabase.co";
const supabaseAnonKey = 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dXlwdHF0aXpnZnd4YXpwY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjcyODgsImV4cCI6MjA2NzgwMzI4OH0.OoqSS8871MUv17PqiHRovlyKCoNh185dB6TfxPT1He8";


const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;