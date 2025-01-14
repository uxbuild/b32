const { client } = require("./common");

const TABLE_NAME = "flavors";

const seed = async () => {
  try {
    await client.connect();
    const SQL = `DROP TABLE IF EXISTS flavors;
           CREATE TABLE flavors (
            id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(100),
            is_favorite BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW() 
          );
              INSERT INTO flavors (name, is_favorite) VALUES('Chocolate', true);
              INSERT INTO flavors (name) VALUES('Vanilla');
              INSERT INTO flavors (name) VALUES('Coffee');
              INSERT INTO flavors (name) VALUES('Lemon Sorbet');
              INSERT INTO flavors (name) VALUES('Pistachio');
          `;
    await client.query(SQL);
    await client.end();
    console.log("We have flavored data!");
  } catch (error) {
    console.log(error);
  }
};

seed();
