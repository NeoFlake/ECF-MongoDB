import express from "express";
import { connect } from "mongoose";
import { ROADS } from "./public/constantes/roads.js";
import avionRoute from "./routes/avionRoute.js";
import volRoute from "./routes/volRoute.js";
import passagerRoute from "./routes/passagerRoute.js";
import billetRoute from "./routes/billetRoute.js";

const app = express();

app.use(express.json());

app.use(`${ROADS.BASE_API_URL}${ROADS.AVIONS_URL}`, avionRoute);
app.use(`${ROADS.BASE_API_URL}${ROADS.VOLS_URL}`, volRoute);
app.use(`${ROADS.BASE_API_URL}${ROADS.PASSAGERS_URL}`, passagerRoute);
app.use(`${ROADS.BASE_API_URL}${ROADS.BILLETS_URL}`, billetRoute);

connect("mongodb://127.0.0.1:27017/")
    .then( () => console.log("Connexion à la base de données réussit"))
    .catch( () => console.log("Échec de la connexion à la base de donnée"));


app.listen(3000, () => console.log("port 3000"));