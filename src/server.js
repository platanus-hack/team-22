import dotenv from 'dotenv'
dotenv.config()

console.log('Variables de entorno:', {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY
});

import app from "./app.js";
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
