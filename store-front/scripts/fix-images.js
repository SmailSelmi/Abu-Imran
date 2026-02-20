const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iuxtnvieuwzauxgiopbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1eHRudmlldXd6YXV4Z2lvcGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjM4NzgsImV4cCI6MjA4Njg5OTg3OH0.UnGggM7nJ_g9LsdGodekM38mPpL72LXlxODm6Z6sLnc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateImages() {
  console.log('Updating product images...');

  // Update Eggs, Chicks, Chickens
  const { error: error1 } = await supabase
    .from('products')
    .update({ image_url: '/images/chicken.svg' })
    .in('category', ['eggs', 'chicks', 'chickens', 'livestock']);

  if (error1) console.error('Error updating chickens:', error1);
  else console.log('Updated chickens/eggs images');

  // Update Machines
  const { error: error2 } = await supabase
    .from('products')
    .update({ image_url: '/images/incubator.svg' })
    .in('category', ['machine', 'incubators']);

  if (error2) console.error('Error updating machines:', error2);
  else console.log('Updated machine images');
}

updateImages();
