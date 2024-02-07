import Session from "../modules/session.mjs";
import express from "express";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";

const SESSION_API = express.Router();
SESSION_API.use(express.json());


let sessions = []


export default SESSION_API