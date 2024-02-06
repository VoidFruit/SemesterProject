import express from 'express';
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";

const SCORE_API = express.Router();
SCORE_API.use(express.json());


SCORE_API.get('/', (req, res) => {
    //List all user high-scores
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(scores);
});

SCORE_API.get('/:id', (req, res) => {
    //get individual user high-score
    const scoreId = req.params.id;
    const score = scores.find(u => u.id === scoreId);

  
});

SCORE_API.put('/:id', (req, res) => {
    //Update the high-score
    const scoreId = req.params.id;
    const { name, pswHash } = req.body;

    const userIndex = users.findIndex(u => u.id === userId);
});

SCORE_API.get('/:battleid', (req, res) => {
    //Show battle result, rank players from 1st to last and display scores.
  
});



export default SCORE_API;