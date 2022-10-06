import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

console.log(dotenv.config());

const project_url = process.env.PROJECT_URL || "";
const public_anon_key = process.env.PUBLIC_ANON_KEY || "";

// Create a single supabase client for interacting with your database
const supabase = createClient(project_url, public_anon_key, {
  autoRefreshToken: true,
});

export default supabase;
