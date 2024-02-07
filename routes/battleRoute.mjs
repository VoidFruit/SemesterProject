import Battle from "../modules/user.mjs";
import express from "express";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";

const BATTLE_API = express.Router();
BATTLE_API.use(express.json());

let battles = [];

function assignID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomID = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomID += characters.charAt(randomIndex);
    }

    return randomID;
}

USER_API.post('/battle', (req, res) => {
    const { battleID, numberOfPlayers, startDate } = req.body;

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

export default BATTLE_API