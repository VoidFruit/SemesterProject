import express from 'express'; // Express is installed using npm
import USER_API from './routes/usersRoute.mjs'; // This is where we have defined the API for working with users.
import BATTLE_API from './routes/battleRoute.mjs'; // This is where we have defined the API for working with multiplayer games.
import SESSION_API from './routes/sessionRoute.mjs'; // This is where we have defined the API for working with participants in multiplayer games.
import SCORE_API from './routes/scoreRoute.mjs'; // This is where we have defined the API for working with the game.
import SuperLogger from './modules/SuperLogger.mjs';
// Creating an instance of the server
const server = express();
// Selecting a port for the server to use.
const port = (process.env.PORT || 8080);
server.set('port', port);

// Enable logging for server
const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger()); // Will logg all http method requests


// Defining a folder that will contain static files.
server.use(express.static('public'));

// Telling the server to use the USER_API (all urls that uses this code will have to have the /user after the base address)
server.use("/user", USER_API); //USERS AND SCORES
server.use("/session", SESSION_API);
server.use("/battle", BATTLE_API);

// Start the server 
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});
