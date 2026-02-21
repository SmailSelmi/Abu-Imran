const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  content.split("\n").forEach((line) => {
    const [key, ...value] = line.split("=");
    if (key && value) {
      env[key.trim()] = value.join("=").trim();
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log("Checking database schema...");

  // Try to select the new columns
  const { data, error } = await supabase
    .from("products")
    .select("slug, category, subcategory")
    .limit(1);

  if (error) {
    console.error("Check failed:", error.message);
    if (
      error.message.includes('column "slug" does not exist') ||
      error.code === "42703"
    ) {
      console.log("SCHEMA_MISSING");
    } else {
      console.log("SCHEMA_ERROR: " + error.message);
    }
  } else {
    console.log("SCHEMA_OK");
  }
}

checkSchema();
