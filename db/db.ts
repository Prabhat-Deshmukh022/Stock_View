import { Pool } from 'pg'

const db = new Pool({
    connectionString: process.env.DATABASE_URL
})

db.on('error', (error) => {
    console.log(`ERROR IN DB CONNECT - ${error}`);
    
})

export default db