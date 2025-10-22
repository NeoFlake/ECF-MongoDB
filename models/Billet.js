import { model, Schema } from "mongoose";
import Vol from "../models/Vol.js";
import Passager from "../model/Passager.js";
import CLASSE_BILLET from "../public/enums/ClasseBillet.js";
import MODE_PAIEMENT_BILLET from "../public/enums/ModePaiementBillet.js";
import STATUT_BILLET from "../public/enums/StatutBillet.js";
import ERRORS from "../public/constantes/errors.js";

const volSchema = new Schema({
    vol: {
        type: Schema.Types.ObjectId, ref: "Vol",
        validate: { // Validator permettant de prouver que le vol existe pour ce billet
            validator: async function (billet) {
                return await Vol.exists({ _id: billet });
            },
            message: ERRORS.VOL_INEXISTANT
        }
    },
    passager: {
        type: Schema.Types.ObjectId, ref: "Passager",
        validate: { // Validator permettant de prouver que le passager existe pour ce billet
            validator: async function (passager) {
                return await Passager.exists({ _id: passager });
            },
            message: ERRORS.PASSAGER_INEXISTANT
        }
    },
    numero: { type: String },
    classe: {
        type: String,
        enum: Object.values(CLASSE_BILLET),
        default: CLASSE_BILLET.ECONOMIE
    },
    prix: {
        type: Number,
        validate: { // Permet de valider que le prix du billet est possible et qu'il n'est pas gratuit
            validator: function (prix) {
                return prix > 0;
            },
            message: ERRORS.PRIX_IMPOSSIBLE
        }
    },
    dateReservation: { type: Date, deafult: Date.now() },
    modePaiement: { type: String, enum: Object.values(MODE_PAIEMENT_BILLET) },
    statut: { type: String, enum: Object.values(STATUT_BILLET), default: STATUT_BILLET.CONFIRME }
});

export default model("Vol", volSchema);