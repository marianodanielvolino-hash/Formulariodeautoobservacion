require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️  Faltan las credenciales de Supabase (SUPABASE_URL y SUPABASE_KEY) en el archivo .env");
}

// Inicializar cliente de Supabase
const supabase = createClient(
    supabaseUrl || 'https://ejemplo.supabase.co', 
    supabaseKey || 'ejemplo_key'
);

module.exports = supabase;
