import pg from "pg";
import bcrypt from "bcrypt";
import SuperLogger from "./SuperLogger.mjs";

/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {

    #credentials = {};

    constructor(connectionString) {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
        };

    }

    async getUsers() {

        const client = new pg.Client(this.#credentials);

        let users = []

        try {
            await client.connect();
            const output = await client.query('Select * from "public"."Users" order by id desc');
            users = output.rows

        } catch (error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server
        } finally {
            client.end(); // Always disconnect from the database.
        }

        //return user;
        return users;

    }

    async getUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Select * from "public"."Users"  where id = $1;', [user.id]);

            if (output.rows.length == 1) {
                user.id = output.rows[0].id;
                user.name = output.rows[0].name;
                user.email = output.rows[0].email;
                user.pswHash = output.rows[0].password;

                //Todo: Fill all properties
                console.log("StorageManager getUser result: " + output.rows[0].id + " " + output.rows[0].name)
            }
            else {
                console.log("StorageManager getUser: No match was found!");
                // Setting user id to empty string since there was no match
                user.id = "";
            }

        } catch (error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server
        } finally {
            client.end(); // Always disconnect from the database.
        }
        console.log("StorageManager getUser user object is now: " + user.id + " " + user.name)
        return user;

    }

    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Update "public"."Users" set "name" = $1, "email" = $2, "password" = $3, "isadmin" = $4, "highscore" = $5 where id = $6;', [user.name, user.email, user.pswHash, user.isAdmin, user.highscore, user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.
            if (output.rows.length == 1) {
              // We stored the user in the DB.
              user.id = output.rows[0].id;
              console.log("StorageManager updateUser: " + user.id + " " + user.name + " was saved to DB" )
          }


        } catch (error) {
           
            console.log(error);
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;
    }

    async deleteUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."Users"  where id = $1;', [user.id]);

         
        } catch (error) {
           
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;
    }

    async createUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Users"("name", "email", "password", "isadmin", "highscore") VALUES($1::Text, $2::Text, $3::Text, $4::Boolean, $5::Integer ) RETURNING id;', [user.name, user.email, user.pswHash, user.isAdmin, user.highscore]);


            if (output.rows.length == 1) {
                user.id = output.rows[0].id;
                console.log("StorageManager createUser: " + user.id + " " + user.name + " was saved to DB" )
            }

        } catch (error) {
            console.error(error);
            
            console.log("Failed to create user!");
            console.log("Connectionstring is " + connectionString);
        } finally {
            client.end(); 
        }

        return user;

    }

    async updateUserHighscore(user) {
      const client = new pg.Client(this.#credentials);

      console.log(' Inside storage manager user ' + user.id + ' score is ' + user.highscore);

      try {
          await client.connect();
          const output = await client.query('UPDATE "public"."Users" SET "highscore" = $1 WHERE id = $2;',[user.highscore, user.id]);

          if (output.rows.length == 1) {
            user.id = output.rows[0].id;
            console.log("StorageManager updateUserHighscore for user id: " + user.id + " to score " + user.highscore );
        }

      } catch (error) {
       
          console.log(error);
      } finally {
          client.end(); // Always disconnect from the database.
      }
      return user;
    }

    async authenticateUser(user) {

      const client = new pg.Client(this.#credentials);

      try {
          await client.connect();
          const output = await client.query('SELECT * FROM "public"."Users" WHERE email = $1;', [user.email]);

          if (output.rows.length == 1) {
            console.log("StorageManager authenticateUser: Found user with matching email.");

            // Compare provided password with the hash stored in DB
            let isPasswordMatch = bcrypt.compareSync(user.pswHash, output.rows[0].password);

            if (isPasswordMatch) {
              // Fill user object with missing info
              user.id = output.rows[0].id;
              user.name = output.rows[0].name;
              user.highscore = output.rows[0].highscore;
              user.isadmin = output.rows[0].isadmin;
              console.log(`StorageManager authenticateUser: User ${user.id} ${user.email} authenticated!`);
            }
            else {
              user.id = "";
              console.log(`StorageManager authenticateUser: Password for ${user.email} did not match`);
            }
          }
          else {
            console.log(`StorageManager authenticateUser: User ${user.email} was not found`);
            user.id = "";
          }
      } catch (error) {
          console.log(error);
      } finally {
          client.end(); // Always disconnect from the database.
      }
      return user;
  }
}

// get the db connection string from the environment variables.
let connectionString = process.env.ENVIRONMENT == "local" ? process.env.DB_CONNECTIONSTRING_LOCAL : process.env.DB_CONNECTIONSTRING_PROD;

// We are using an environment variable to get the db credentials
if (connectionString == undefined) {
    throw ("You forgot the db connection string");
}

export default new DBManager(connectionString);

