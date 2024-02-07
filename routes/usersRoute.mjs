import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";

const USER_API = express.Router();
USER_API.use(express.json());

// Assuming you have some data structure to store users
let users = [];

function assignID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomID = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomID += characters.charAt(randomIndex);
    }

    return randomID;
}

USER_API.get('/', (req, res) => {
    // Log users in console
    console.log("Existing Users:");
    console.log(users);

    res.status(HTTPCodes.SuccesfullRespons.Ok).json(users);
});

USER_API.get('/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);

    if (user) {
        res.status(HTTPCodes.SuccesfullRespons.Ok).json(user);
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.NotFound) ();
    }
});

USER_API.post('/', (req, res, next) => {
    console.log("Received request to create user:");
    const { name, email, password, score, isAdmin} = req.body;
    if (name != "" && email != "" && password != "") {
        const user = new User(); 
        user.name = name;
        user.email = email;
        user.id = assignID(5);
        user.score = score;
        user.isAdmin = isAdmin;
        ///TODO: Do not save passwords.
        user.pswHash = password;

        ///TODO: Does the user exist?
        let exists = false;

        if (!exists) {
            users.push(user);
            res.status(HTTPCodes.SuccesfullRespons.Ok).end();
            console.log("Added user:" + user.name);
            users.forEach(element => {
              console.log("Users array contains: " + element.name);
            });

        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
        }

    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

});

USER_API.put('/:id', (req, res) => {
    const userId = req.params.id;
    const { name, pswHash } = req.body;

});

USER_API.delete('/:id', (req, res) => {
    const userId = req.params.id;
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        // Remove user if found
        users.splice(userIndex, 1);
        res.status(HTTPCodes.SuccesfullRespons.Ok).end();
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.NotFound).end();
    }
});

export default USER_API;
