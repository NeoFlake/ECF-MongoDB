import { Router } from "express";
import Billet from "../models/Billet.js";
import Vol from "../models/Vol.js";
import Passager from "../models/Passager.js";

const router = Router();

// Route pour renvoyer tous les billets -> getAll()
router.get(`${ROADS.ROOT}`, async (req, res) => {
    try {
        const billets = await Billet.find();
        res.status(201).json(billets);
    } catch (err) {
        res.status(404).json({ erreur: err.message });
    }
});

// Route pour renvoyer un billet par son identifiant -> getById()
router.get(`${ROADS.ROOT}:id`, async (req, res) => {
    try {
        const billet = await Billet.findById(req.params.id);
        if (!billet) throw new Error(ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT);
        res.status(201).json(billet);
    } catch (err) {
        let codeErreur = 400;
        if (err.message === ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT) codeErreur = 404;
        res.status(codeErreur).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets par un identifiant de vol -> getBilletsByVolId()
router.get(`${ROADS.ROOT}${ROADS.VOLS_URL}/:id`, async (req, res) => {
    try {
        const billets = await Billet.find({ vol: req.params.id });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets par un numero de vol -> getBilletsByNumeroDeVol()
router.get(`${ROADS.ROOT}${ROADS.VOLS_URL}${ROADS.NUMERO_VOL}`, async (req, res) => {
    try {
        const billets = await Billet.find({ "vol.numeroVol": req.body.numeroVol });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets par un origine de vol -> getBilletsByOrigineDeVol()
router.get(`${ROADS.ROOT}${ROADS.VOLS_URL}${ROADS.ORIGINE}`, async (req, res) => {
    try {
        const billets = await Billet.find({ "vol.origine": req.body.origine });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets par un origine de vol -> getBilletsByDestinationDeVol()
router.get(`${ROADS.ROOT}${ROADS.VOLS_URL}${ROADS.DESTINATION}`, async (req, res) => {
    try {
        const billets = await Billet.find({ "vol.destination": req.body.destination });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets de vol déjà arrivé -> getBilletsByVolArrivé()
router.get(`${ROADS.ROOT}${ROADS.VOLS_URL}${ROADS.VOLS_TERMINES}`, async (req, res) => {
    try {
        const billets = await Billet.find({ "vol.dateArrive": { $lte: Date.now() } });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets de vol en cours -> getBilletsByVolEnCours()
router.get(`${ROADS.ROOT}${ROADS.VOLS_URL}${ROADS.VOLS_EN_COURS}`, async (req, res) => {
    try {
        const billets = await Billet.find({ "vol.dateDepart": { $lte: Date.now() }, "vol.dateArrivee": { $gte: Date.now() } });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets de vol futur -> getBilletsByVolFutur()
router.get(`${ROADS.ROOT}${ROADS.VOLS_URL}${ROADS.VOLS_FUTUR}`, async (req, res) => {
    try {
        const billets = await Billet.find({ "vol.dateDepart": { $gte: Date.now() } });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets pour un avion donnée -> getBilletsByAvionId()
router.get(`${ROADS.ROOT}${ROADS.VOLS_URL}${ROADS.AVIONS_URL}/:id`, async (req, res) => {
    try {
        const billets = await Billet.find({ "vol.avion": req.params.id });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets pour chaque avion d'un modèle -> getBilletsByAvionModele()
router.get(`${ROADS.ROOT}${ROADS.VOLS_URL}${ROADS.AVIONS_URL}${ROADS.MODELE}`, async (req, res) => {
    try {
        const billets = await Billet.find({ "vol.avion.modele": req.body.modele });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets pour chaque avion d'une compagnie -> getBilletsByAvionCompagnie()
router.get(`${ROADS.ROOT}${ROADS.VOLS_URL}${ROADS.AVIONS_URL}${ROADS.MODELE}`, async (req, res) => {
    try {
        const billets = await Billet.find({ "vol.avion.compagnie": req.body.compagnie });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets pour chaque avion en service ou non -> getBilletsByAvionEnService()
router.get(`${ROADS.ROOT}${ROADS.VOLS_URL}${ROADS.AVIONS_URL}${ROADS.EN_SERVICE}`, async (req, res) => {
    try {
        const billets = await Billet.find({ "vol.avion.enService": req.body.enService });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets par un identifiant de passager -> getBilletsByPassagerId()
router.get(`${ROADS.ROOT}${ROADS.PASSAGER_URL}/:id`, async (req, res) => {
    try {
        const billets = await Billet.find({ passager: req.params.id });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets de chaque passager avec ce nom -> getBilletsByNomPassager()
router.get(`${ROADS.ROOT}${ROADS.PASSAGER_URL}${ROADS.NOM}`, async (req, res) => {
    try {
        const billets = await Billet.find({ "passager.nom": req.body.nom });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets de chaque passager avec ce prenom -> getBilletsByPrenomPassager()
router.get(`${ROADS.ROOT}${ROADS.PASSAGER_URL}${ROADS.PRENOM}`, async (req, res) => {
    try {
        const billets = await Billet.find({ "passager.prenom": req.body.prenom });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets de chaque passager avec cet email -> getBilletsByEmailPassager()
router.get(`${ROADS.ROOT}${ROADS.PASSAGER_URL}${ROADS.EMAIL}`, async (req, res) => {
    try {
        const billets = await Billet.find({ "passager.email": req.body.email });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets de chaque passager d'un pays -> getBilletsByPaysPassager()
router.get(`${ROADS.ROOT}${ROADS.PASSAGER_URL}${ROADS.PAYS}`, async (req, res) => {
    try {
        const billets = await Billet.find({ "passager.pays": req.body.pays });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets par leur numero de siege -> getByNumeroDeSiege()
router.get(`${ROADS.ROOT}${ROADS.NUMERO_DE_SIEGE}`, async (req, res) => {
    try {
        const billets = await Billet.find({ numeroSiege: req.body.numeroSiege });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets par leur classe -> getByClasse()
router.get(`${ROADS.ROOT}${ROADS.CLASSE}`, async (req, res) => {
    try {
        const billets = await Billet.find({ classe: req.body.classe });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets par leur prix variable -> getByPrix()
router.get(`${ROADS.ROOT}${ROADS.PRIX}/:mode`, async (req, res) => {
    try {
        let query = {};
        if (req.params.mode === "inferieur") {
            query = { prix: { $lte: req.body.prix } };
        } else if (req.params.mode === "superieur") {
            query = { prix: { $gte: req.body.prix } };
        } else {
            query = { prix: req.body.prix };
        }
        const billets = await Billet.find(query);
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets par leur date de réservation variable -> getByDateReservation()
router.get(`${ROADS.ROOT}${ROADS.DATE_RESERVATION}/:temporalite`, async (req, res) => {
    try {
        let query = {};
        if (req.params.temporalite === "anterieur") {
            query = { dateReservation: { $lte: req.body.dateReservation } };
        } else if (req.params.temporalite === "posterieur") {
            query = { dateReservation: { $gte: req.body.dateReservation } };
        } else {
            query = { dateReservation: req.body.dateReservation };
        }
        const billets = await Billet.find(query);
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billets par leur mode de paiement -> getByModePaiement()
router.get(`${ROADS.ROOT}${ROADS.MODE_PAIEMENT}`, async (req, res) => {
    try {
        const billets = await Billet.find({ modePaiement: req.body.modePaiement });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les billet par leur statut -> getByStatut()
router.get(`${ROADS.ROOT}${ROADS.STATUT}`, async (req, res) => {
    try {
        const billets = await Billet.find({ statut: req.body.statut });
        res.status(201).json(billets);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour permettre de créer un nouveau billet
router.post(`${ROADS.ROOT}`, async (req, res) => {
    try {
        // Vérification de l'existence du vol lié à ce billet
        const vol = await Vol.findById(req.body.vol);
        if (!vol) throw new Error(ERRORS.VOL_INEXISTANT);

        if (vol.dateArrivee < Date.now()) throw new Error(ERRORS.AVION_DEJA_ARRIVE);
        if (vol.dateDepart < Date.now() && vol.dateArrivee > Date.now()) throw new Error(ERRORS.AVION_EN_VOL);
        if (vol.avion.placeRestante === 0) throw new Error(ERRORS.AVION_PLEIN);

        const billet = await Billet.create(req.body);

        vol.avion.placeRestante -= 1;

        await vol.avion.save();

        res.status(201).json({ message: VALIDATIONS.BILLET_CREE, billet });
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour mettre à jour un billet déjà existant
router.put(`${ROADS.ROOT}:id`, async (req, res) => {
    try {
        if (req.params.id != req.body.id) throw new Error(ERRORS.IDENTIFIANT_NON_CORRESPONDANT);
        const billet = await Billet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json({ message: VALIDATIONS.BILLET_MIS_A_JOUR, billet });
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour supprimer un billet
router.delete(`${ROADS.ROOT}:id`, async (req, res) => {

    try {

        const billetExistant = await Billet.findById(req.params.id);

        if (!billetExistant) {
            throw new Error(ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT);
        }

        const billetSupprime = await Billet.findByIdAndDelete(req.params.id);

        billetSupprime.vol.avion.placeRestante += 1;

        billetSupprime.vol.avion.save();

        res.status(201).json({ message: VALIDATIONS.BILLET_SUPPRIME, billet: billetSupprime });
    } catch (error) {
        res.status(400).json({ erreur: error.message });
    }
});

export default router;