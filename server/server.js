// server/server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const pg = require('pg');

const DB_NAME = 'testdb';
// create postgres database manually via console, or GUI - database name.
const client = new pg.Client(process.env.DATABASE_URL || `postgres://localhost/${DB_NAME}`);

app.listen(PORT, async ()=>{
    console.log(`Server listening on port ${PORT}`);
    
    // seed data.. 
    // import function that seeds data, if needed.

})


// Middleware to parse JSON requests
app.use(express.json());
