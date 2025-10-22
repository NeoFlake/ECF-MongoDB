import { model, Schema } from "mongoose";

const avionSchema = new Schema({
    modele: {type: String, required: true},
    compagnie: {type: String, required: true},
    capacite: {type: Number, required: true, min: 0, max: 10},
    placeRestante: {type: Number, min: 0, max: 10, default: function () { return this.capacite } /* Permet d'éviter undefined à la création du paramètre */ },
    enService:{type: Boolean, default: true}
});

export default model("Avion", avionSchema);