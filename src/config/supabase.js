import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan las credenciales de Supabase en las variables de entorno')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
