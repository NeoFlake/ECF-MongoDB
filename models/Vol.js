import { model, Schema } from "mongoose";
import Avion from "./Avion.js";
import STATUT_VOL from "../public/enums/StatutVol.js";
import ERRORS from "../public/constantes/errors.js";

const volSchema = new Schema({
    numeroVol: { type: String },
    origine: { type: String },
    destination: { type: String },
    dateDepart: { type: Date },
    dateArrivee: {
        type: Date,
        validate: { // Validator permettant de respecter la logique qu'une date d'arrivé doit être postérieure à une date de départ
            validator: function (dateArrivee) {
                return dateArrivee > this.dateDepart;
            },
            message: ERRORS.DATE_ARRIVE_IMPOSSIBLE
        }
    },
    avion: {
        type: Schema.Types.ObjectId, ref: "Avion",
        validate: { // Validator permettant de prouver que l'avion existe pour ce vol
            validator: async function (avion) {
                return await Avion.exists({ _id: avion });
            },
            message: ERRORS.AVION_INEXISTANT
        }
    },
    statut: { type: String, enum: Object.values(STATUT_VOL), default: STATUT_VOL.PREVU }
});

export default model("Vol", volSchema);