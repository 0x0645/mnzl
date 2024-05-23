require('dotenv').config();

import express from "express";
import config from "config";
import cors from 'cors';
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";
import deserializeUser from "./middleware/deserializeUser";

const app = express();
app.use(cors());

app.use(express.json());
app.use(deserializeUser)

app.use(router);

const port = config.get<number>("port");

app.listen(port, async () => {
  const asciiArt = `
  __  __ _   _ _______        __  __            _           
 |  \\/  | \\ | |___  / |      |  \\/  |          (_)          
 | \\  / |  \\| |  / /| |      | \\  / | _____   ___  ___  ___ 
 | |\\/| | . \` | / / | |      | |\\/| |/ _ \\ \\ / / |/ _ \\/ __|
 | |  | | |\\  |/ /__| |____  | |  | | (_) \\ V /| |  __/\\__ \\
 |_|  |_|_| \\_/_____|______| |_|  |_|\\___/ \\_/ |_|\\___||___/                                                   
    `;
  log.info(asciiArt);
  log.info(`Server is started at http://localhost:${port}`);
  await connectToDb();
});
