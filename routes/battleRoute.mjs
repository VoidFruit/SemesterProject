import express from "express";
import Battle from "../modules/battle.mjs";
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


BATTLE_API.get('/', (req, res) => {
    // Log battles in console
    console.log("Existing battles:");
    console.log(battles);

    res.status(HTTPCodes.SuccesfullRespons.Ok).json(battles);
});

BATTLE_API.post('/', (req, res, next) => {
    console.log("Received request to create battle:");
    const { battleID, numberOfPlayers } = req.body;
    const battle = new Battle();
    battle.battleID = assignID(5);
    battle.numberOfPlayers = numberOfPlayers;
 
    battles.push(battle);
    res.status(HTTPCodes.SuccesfullRespons.Ok).end();
    console.log("Added battle:" + battle.id);
    battles.forEach(element => {
        console.log("battles array contains: " + element.id);
    });

});

BATTLE_API.put('/:id', (req, res) => {
    const battleId = req.params.id;
    const { battleID, numberOfPlayers, startDate, endDate } = req.body;
});

BATTLE_API.delete('/:id', (req, res) => {
    const battleId = req.params.id;
    const battleIndex = battles.findIndex(u => u.id === battleId);

    if (battleIndex !== -1) {
        // Remove battle if found
        battles.splice(battleIndex, 1);
        res.status(HTTPCodes.SuccesfullRespons.Ok).end();
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.NotFound).end();
    }
});




export default BATTLE_API