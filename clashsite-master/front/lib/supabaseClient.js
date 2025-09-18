import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wdjivdgdnhbiagbvhtjb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkaml2ZGdkbmhiaWFnYnZodGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MjcwODUsImV4cCI6MjA3MzUwMzA4NX0.6z7PGJlrf2CbEjy3SOF2IkPxe6fTQA0ONQ_AvDt7BOA";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: null,
    persistSession: true,
  },
});

export default supabase;
