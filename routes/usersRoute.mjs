import express from "express";
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
        res.status(HTTPCodes.ClientSideErrorRespons.NotFound).end();
    }
});

USER_API.post('/', (req, res) => {
    const { name, email, pswHash } = req.body;

    if (name && email && pswHash) {
        const newUser = {
            id: assignID(5),
            name: name,
            email: email,
            pswHash: pswHash
        };

        users.push(newUser);
        res.status(HTTPCodes.SuccesfullRespons.Ok).json(newUser);
        console.log("Existing Users:");
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Missing data fields").end();
    }
});

USER_API.put('/:id', (req, res) => {
    const userId = req.params.id;
    const { name, pswHash } = req.body;

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        // Update user if found
        users[userIndex] = {
            ...users[userIndex],
            name: name || users[userIndex].name,
            email: email || users[userIndex].email,
            pswHash: pswHash || users[userIndex].pswHash
        };
        res.status(HTTPCodes.SuccesfullRespons.Ok).json(users[userIndex]);
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.NotFound).end();
    }
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
