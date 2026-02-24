const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDb() {
  try {
    const { count: familyCount, error: familyError } = await supabase
      .from('families')
      .select('*', { count: 'exact', head: true });
    
    const { count: breedCount, error: breedError } = await supabase
      .from('breeds')
      .select('*', { count: 'exact', head: true });

    const { count: productCount, error: productError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    console.log('--- Database Status ---');
    console.log('Families:', familyCount, familyError ? `(Error: ${familyError.message})` : '');
    console.log('Breeds:', breedCount, breedError ? `(Error: ${breedError.message})` : '');
    console.log('Products:', productCount, productError ? `(Error: ${productError.message})` : '');

    if (familyCount > 0) {
        const { data: families } = await supabase.from('families').select('id, slug, name_ar');
        console.log('Families in DB:', families);
    }

    if (productCount > 0) {
      const { data: sampleProducts } = await supabase
        .from('products')
        .select('name, category, breed_id, family_id, slug')
        .limit(10);
      console.log('Sample Products:', sampleProducts);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkDb();
