// export DB client setup for reuse.

const express = require("express");
const pg = require("pg");
const DB_NAME = "acme_shop_db";
const client = new pg.Client(
    // process.env.DATABASE_NAME || `postgres://localhost/${DB_NAME}`
    process.env.DATABASE_NAME || `postgres://localhost/acme_shop_db`
);

module.exports = { express, client };
