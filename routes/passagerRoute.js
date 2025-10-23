import { Router } from "express";
import Passager from "../models/Passager.js";
import { now } from "mongoose";

const router = Router();

// Route pour renvoyer tous les passagers -> getAll()
router.get(`${ROADS.ROOT}`, async (req, res) => {
    try {
        const passagers = await Passager.find();
        res.status(201).json(passagers);
    } catch (err) {
        res.status(404).json({ erreur: err.message });
    }
});

// Route pour renvoyer un passager par son identifiant -> getById()
router.get(`${ROADS.ROOT}:id`, async (req, res) => {
    try {
        const passager = await Passager.findById(req.params.id);
        if (!passager) throw new Error(ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT);
        res.status(201).json(passager);
    } catch (err) {
        let codeErreur = 400;
        if (err.message === ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT) codeErreur = 404;
        res.status(codeErreur).json({ erreur: err.message });
    }
});

// Route pour renvoyer les passagers par leur nom -> getByNom()
router.get(`${ROADS.NOM}`, async (req, res) => {
    try {
        const passagers = await Passager.find({ nom: req.body.nom });
        res.status(201).json(passagers);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les passagers par leur prénom -> getByPrenom()
router.get(`${ROADS.PRENOM}`, async (req, res) => {
    try {
        const passagers = await Passager.find({ prenom: req.body.prenom });
        res.status(201).json(passagers);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer le passager par son email -> getByEmail()
router.get(`${ROADS.EMAIL}/:email`, async (req, res) => {
    try {
        const passager = await Passager.find({ email: req.params.email });
        res.status(201).json(passager);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les passagers par pays -> getByPays()
router.get(`${ROADS.PAYS}`, async (req, res) => {
    try {
        const passagers = await Passager.find({ pays: req.body.pays });
        res.status(201).json(vols);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les passagers enregistrée ainsi que leur nombre total -> getByPassagerEnregistreeAndCount()
router.get(`${ROADS.ENREGISTRE}`, async (req, res) => {
    try {
        const passagers = await Passager.aggregate([
            {
                $match: {
                    dateInscription: { $lte: now }
                }
            },
            {
                $group: {
                    _id: null,
                    passagers: { $push: "$$ROOT" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    passagers: 1,
                    count: 1
                }
            }
        ]);
        res.status(201).json(passagers);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les passagers enregistrée dans le mois ainsi que leur nombre total -> getByPassagerEnregistreAndCount()
router.get(`${ROADS.ENREGISTRE}`, async (req, res) => {
    try {

        // On détermine le début du mois
        const debutDuMois = new Date(now.getFullYear(), now.getMonth(), 1);

        // Ainsi que la fin du mois (en oubliant pas d'exclure la dernière minute)
        const finDuMois = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const passagers = await Passager.aggregate([
            {
                $match: {
                    dateInscription: { $gte: debutDuMois, $lte: finDuMois }
                }
            },
            {
                $group: {
                    _id: null,
                    passagers: { $push: "$$ROOT" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    passagers: 1,
                    count: 1
                }
            }
        ]);
        res.status(201).json(passagers);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour connaître le nombre total de passager -> getCountOfPassager()
router.get(`${ROADS.TOTAL_PASSAGER}`, async (req, res) => {
    try {
        const comptePassager = await Passager.aggregate([
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    count: 1
                }
            }
        ]);
        res.status(201).json(comptePassager);
    } catch (err) {
        res.status(404).json({ erreur: err.message });
    }
});

// Route pour permettre de créer un nouveau passager
router.post(`${ROADS.ROOT}`, async (req, res) => {
    try {
        const passager = await Passager.create(req.body);
        res.status(201).json({ message: VALIDATIONS.PASSAGER_CREE, passager });
    } catch (err) {
        res.status(404).json({ erreur: err.message });
    }
});

// Route pour mettre à jour un passager déjà existant
router.put(`${ROADS.ROOT}:id`, async (req, res) => {
    try {
        if (req.params.id != req.body.id) throw new Error(ERRORS.IDENTIFIANT_NON_CORRESPONDANT);
        const passager = await Passager.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json({ message: VALIDATIONS.PASSAGER_MIS_A_JOUR, passager });
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour supprimer un passager
router.delete(`${ROADS.ROOT}:id`, async (req, res) => {

    try {

        const passagerExistant = await Passager.findById(req.params.id);

        if (!passagerExistant) {
            throw new Error(ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT);
        }

        const passagerSupprime = await Vol.findByIdAndDelete(req.params.id);

        res.status(201).json({ message: VALIDATIONS.PASSAGER_SUPPRIME, avion: passagerSupprime });
    } catch (error) {
        res.status(400).json({ erreur: error.message });
    }
});

export default router;