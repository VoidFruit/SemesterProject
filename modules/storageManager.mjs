import pg from "pg"
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

    // New query for getting all users
    async getUsers() {

        const client = new pg.Client(this.#credentials);

        let users = []

        try {
            await client.connect();
            const output = await client.query('Select * from "public"."Users"');
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
    // End new query for get

    // New query for get user by id
    async getUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Select * from "public"."Users"  where id = $1;', [user.id]);

            if (output.rows.length == 1) {
                user.id = output.rows[0].id;
                user.name = output.rows[0].name;
                user.email = output.rows[0].email;
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
    // End new query for get

    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Update "public"."Users" set "name" = $1, "email" = $2, "password" = $3 where id = $4;', [user.name, user.email, user.pswHash, user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO Did we update the user?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server
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

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO: Did the user get deleted?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;
    }

    async createUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Users"("name", "email", "password") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;', [user.name, user.email, user.pswHash]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            if (output.rows.length == 1) {
                // We stored the user in the DB.
                user.id = output.rows[0].id;
                console.log("StorageManager createUser: " + user.id + " " + user.name + " was saved to DB" )
            }

        } catch (error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server
            console.log("Failed to create user!");
            console.log("Connectionstring is " + connectionString);
        } finally {
            client.end(); // Always disconnect from the database.
        }

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

            //TODO Did we update the user?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server
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

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO: Did the user get deleted?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server
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

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            if (output.rows.length == 1) {
                // We stored the user in the DB.
                user.id = output.rows[0].id;
                console.log("StorageManager createUser: " + user.id + " " + user.name + " was saved to DB" )
            }

        } catch (error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server
            console.log("Failed to create user!");
            console.log("Connectionstring is " + connectionString);
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;

    }

    async updateUserHighscore(user) {
      const client = new pg.Client(this.#credentials);

      try {
          await client.connect();
          const output = await client.query('UPDATE "public"."Users" SET "highscore" = $1 WHERE id = $2;',[user.highscore, user.id]);

          if (output.rows.length == 1) {
            user.id = output.rows[0].id;
            console.log("StorageManager updateUserHighscore for user id: " + user.id + " to score " + user.highscore );
        }

      } catch (error) {
          //TODO : Error handling?? Remember that this is a module seperate from your server
          console.log(error);
      } finally {
          client.end(); // Always disconnect from the database.
      }
      return user;
    }

}




// The following is thre examples of how to get the db connection string from the enviorment variables.
// They accomplish the same thing but in different ways.
// It is a judgment call which one is the best. But go for the one you understand the best.

// 1:
let connectionString = process.env.ENVIORMENT == "local" ? process.env.DB_CONNECTIONSTRING_LOCAL : process.env.DB_CONNECTIONSTRING_PROD;

// 2:
connectionString = process.env.DB_CONNECTIONSTRING_LOCAL;
if (process.env.ENVIORMENT != "local") {
    connectionString = process.env.DB_CONNECTIONSTRING_PROD;
}

//3:
connectionString = process.env["DB_CONNECTIONSTRING_" + process.env.ENVIORMENT.toUpperCase()];


// We are using an enviorment variable to get the db credentials
if (connectionString == undefined) {
    throw ("You forgot the db connection string");
}

export default new DBManager(connectionString);

//
