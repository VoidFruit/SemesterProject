import express from "express";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";

const SCORE_API = express.Router();
SCORE_API.use(express.json());

export default SCORE_API;