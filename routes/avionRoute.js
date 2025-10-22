import { Router } from "express";
import Avion from "../models/Avion.js";
import Vol from "../models/Vol.js";
import Billet from "../models/Billet.js";

const router = Router();

// Route pour renvoyer tous les avions -> getAll()
router.get(`${ROADS.ROOT}`, async (req, res) => {
    try {
        const avions = await Avion.find();
        res.status(201).json(avions);
    } catch (err) {
        res.status(404).json({ erreur: err.message });
    }
});

// Route pour renvoyer un avion par son identifiant -> getById()
router.get(`${ROADS.ROOT}:id`, async (req, res) => {
    try {
        const avion = await Avion.findById(req.params.id);
        if (!avion) throw new Error(ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT);
        res.status(201).json(avion);
    } catch (err) {
        let codeErreur = 404;
        if (err.message === ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT) codeErreur = 400;
        res.status(codeErreur).json({ erreur: err.message });
    }
});

// Route pour renvoyer les avions par son modèle -> getByModele()
router.get(`${ROADS.ROOT}${ROADS.MODELE}`, async (req, res) => {
    try {
        const avions = await Avion.find({ modele: req.body.modele });
        res.status(201).json(avions);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les avions par sa compagnie -> getByCompagnie()
router.get(`${ROADS.ROOT}${ROADS.COMPAGNIE}`, async (req, res) => {
    try {
        const avions = await Avion.find({ compagnie: req.body.compagnie });
        res.status(201).json(avions);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les avions vide -> getAvionVide()
router.get(`${ROADS.ROOT}${ROADS.AVION_VIDE}`, async (req, res) => {
    try {
        const avions = await Avion.find({ placeRestante: 0 });
        res.status(201).json(avions);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les avions plein -> getAvionPlein()
router.get(`${ROADS.ROOT}${ROADS.AVION_PLEIN}`, async (req, res) => {
    try {
        const avions = await Avion.find({ $expr: { $eq: ["$placeRestante", "$capacite"] } });
        res.status(201).json(avions);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les avions en service -> getByEnServiceOn()
router.get(`${ROADS.ROOT}${ROADS.En_SERVICE}`, async (req, res) => {
    try {
        const avions = await Avion.find({ enService: true });
        res.status(201).json(avions);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour permettre de créer un nouvel avion
router.post(`${ROADS.ROOT}`, async (req, res) => {
    try {
        const avion = await Avion.create(req.body);
        res.status(201).json({ message: VALIDATIONS.AVION_CREE, avion });
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour mettre à jour un avion déjà existant
router.put(`${ROADS.ROOT}:id`, async (req, res) => {
    try {
        if(req.params.id != req.body.id) throw new Error(ERRORS.IDENTIFIANT_NON_CORRESPONDANT);
        const avion = await Avion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json({ message: VALIDATIONS.AVION_MIS_A_JOUR, avion });
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour supprimer un avion 
router.delete(`${ROADS.ROOT}:id`, async (req, res) => {

    try {

        const avionExistant = await Avion.findById(req.params.id);

        if(!avionExistant) {
            throw new Error(ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT);
        }

        // Il faut absolument vérifier qu'aucun billet n'existe dans aucun vol prévu pour cet avion 
        // Donc déjà a t'il des vols prévu qui ne sont pas encore parti?
        const volsPrevu = await Vol.find({ avions: req.params.id, dateDepart: { $gte: Date.now() } });

        const volEnCours = (await Vol.find({ avions: req.params.id, dateDepart: { $lte: Date.now() }, dateArrivee: { $gt: Date.now() } })).length() > 0;

        // Le vol est en cours, il est impossible de supprimer l'avion (ça serait violent non?)
        if (volEnCours) {
            throw new Error(ERRORS.AVION_INDESTRUCTIBLE_CAR_EN_VOL);
        }

        // Si des vols sont prévus, alors on doit vérifier s'ils ont déjà vendu des places
        if (volsPrevu.length() > 0) {
            const billets = await Billet.find({ vol: { $in: vols.map(vol => vol._id) } });

            // Ouch, des places sont vendu donc on ne peut pas le supprimer
            if (billets.length() > 0) {
                throw new Error(ERRORS.AVION_DEJA_BOOKE);
            }
        }

        const avionSupprime = await Avion.findByIdAndDelete(req.params.id);

        res.status(201).json({ message: VALIDATIONS.AVION_SUPPRIME, avion: avionSupprime });
    } catch(error) {
        let codeErreur = 500;
        const messageErreur = error.message;
        if(messageErreur === ERRORS.AVION_INDESTRUCTIBLE_CAR_EN_VOL || messageErreur === ERRORS.AVION_DEJA_BOOKE){
            codeErreur = 403;
        }
        if(messageErreur === ERRORS.ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT){
            codeErreur = 404;
        }
        res.status(codeErreur).json({ erreur: messageErreur });
    }
});

export default router;