import { Router } from "express";
import Vol from "../models/Vol.js";
import ROADS from "../public/constantes/roads.js";

const router = Router();

// Route pour renvoyer tous les vols -> getAll()
router.get(`${ROADS.ROOT}`, async (req, res) => {
    try {
        const vols = await Vol.find();
        res.status(201).json(vols);
    } catch (err) {
        res.status(404).json({ erreur: err.message });
    }
});

// Route pour renvoyer un vol par son identifiant -> getById()
router.get(`${ROADS.ROOT}:id`, async (req, res) => {
    try {
        const vol = await Vol.findById(req.params.id);
        if (!vol) throw new Error(ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT);
        res.status(201).json(vol);
    } catch (err) {
        let codeErreur = 400;
        if (err.message === ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT) codeErreur = 404;
        res.status(codeErreur).json({ erreur: err.message });
    }
});

// Route pour renvoyer les avions par son numero de vol -> getByNumeroVOl()
router.get(`${ROADS.NUMERO_VOL}`, async (req, res) => {
    try {
        const vols = await Vol.find({ numeroVol: req.body.numeroVol });
        res.status(201).json(vols);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les avions par son origine -> getByOrigine()
router.get(`${ROADS.ORIGINE}`, async (req, res) => {
    try {
        const vols = await Vol.find({ origine: req.body.origine });
        res.status(201).json(vols);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les avions par son origine -> getByOrigine()
router.get(`${ROADS.DESTINATION}`, async (req, res) => {
    try {
        const vols = await Vol.find({ destination: req.body.destination });
        res.status(201).json(vols);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les vols terminé -> getVolsTermines()
router.get(`${ROADS.VOLS_TERMINES}`, async (req, res) => {
    try {
        const vols = await Vol.find({ dateArrivee: { $lt: Date.now() } });
        res.status(201).json(vols);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les vols en cours -> getVolsEnCours()
router.get(`${ROADS.VOLS_EN_COURS}`, async (req, res) => {
    try {
        const vols = await Vol.find({ dateDepart: { $lte: Date.now() }, dateArrivee: { $gte: Date.now() } });
        res.status(201).json(vols);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les vols qui ne sont pas encore partis -> getVolsFutur()
router.get(`${ROADS.VOLS_FUTUR}`, async (req, res) => {
    try {
        const vols = await Vol.find({ dateDepart: { $gte: Date.now() } });
        res.status(201).json(vols);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les vols selon leur statut -> getVolsFutur()
router.get(`${ROADS.STATUT}`, async (req, res) => {
    try {
        const vols = await Vol.find({ statut: req.body.statut });
        res.status(201).json(vols);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les vols trié par statuts ainsi que le décompte de vol par statut -> getVolsSortedByStatutAndCounted()
router.get(`${ROADS.STATUT}${ROADS.SORTED}`, async (req, res) => {
    try {
        const vols = await Vol.aggregate([{
            // On regroupe les vols par statut dans un premier temps
            $group: {
                _id: "$statut",
                vols: {
                    $push: "$$ROOT"
                },
                count: { $sum: 1 }
            }
        },
        { // On effectue ensuite une projection pour en supprimer l'_id et effectuer un pivot 
            // permettant de mettre en clé le type de statut (qui est un enum) et en valeur les vols qui y font référence
            $project: {
                _id: 0,
                statutObj: {
                    $arrayToObject: [[{
                        k: "$_id",
                        v: { count: "$count", vols: "$vols" }
                    }]]
                },
            }
        },
        { // On merge l'ensemble dans un seul sur-objet
            $group: {
                _id: null,
                result: { $mergeObjects: "$statutObj" }
            }
        },
        { // Puis on déplace la racine de l'objet renvoyé vers ce nouvel sur-objet créé (évite les _id object pas joli)
            $replaceRoot: { newRoot: "$result" }
        }
        ]);
        res.status(201).json(vols);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les vols répartit par compagnie aérienne ainsi que le décompte de vol par compagnie 
// -> getVolsSortedByCompagnieAerienneAndCounted()
router.get(`${ROADS.COMPAGNIE}${ROADS.SORTED}`, async (req, res) => {
    try {
        const vols = await Vol.aggregate([{
            // On regroupe les vols par compagnie aérienne dans un premier temps
            $group: {
                _id: "$avion.compagnie",
                vols: {
                    $push: "$$ROOT"
                },
                count: { $sum: 1 }
            }
        },
        {// On effectue ensuite une projection pour en supprimer l'_id et effectuer un pivot 
            // permettant de mettre en clé le type de statut (qui est un enum) et en valeur les vols qui y font référence
            $project: {
                _id: 0,
                compagnieObj: {
                    $arrayToObject: [
                        {
                            k: "$_id",
                            v: { count: "$count", vols: "$vols" }
                        }
                    ]
                }
            }
        },
        { // On merge l'ensemble dans un seul sur-objet
            $group: {
                _id: null,
                result: { $mergeObjects: "$compagnieObj" }
            }
        },
        { // Puis on déplace la racine de l'objet renvoyé vers ce nouvel sur-objet créé (évite les _id object pas joli)
            $replaceRoot: { newRoot: "$result" }
        }
        ]);
        res.status(201).json(vols);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour renvoyer les vols prévu ce mois-ci et le compte du nombre -> getVolOfThisMonthAndCounted()
router.get(`${ROADS.VOL_DU_MOIS}`, async (req, res) => {

    // On détermine le début du mois
    const debutDuMois = new Date(now.getFullYear(), now.getMonth(), 1);

    // Ainsi que la fin du mois (en oubliant pas d'exclure la dernière minute)
    const finDuMois = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    try {
        const vols = await Vol.aggregate([{
            $match: { // On applique ça a un tamis pour exclure ce qui ne respecte pas les conditions requises
                $or: [
                    { dateDepart: { $gte: debutDuMois, $lt: finDuMois } },
                    { dateArrivee: { $gte: debutDuMois, $lt: finDuMois } }
                ]
            }
        },
        { // Puis on effectue un groupement sur les vols pour pouvoir récolter le nombre de vol qui ont lieu durant ce mois
            $group: {
                _id: null,
                vols: {
                    $push: "$$ROOT"
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                vols: 1,
                count: 1
            }
        }
        ]);
        res.status(201).json(vols);
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour permettre de récupérer les vols actifs ainsi que leur nombre -> getVolActifAndCount()
router.get(`${ROADS.ACTIF}`, async (req, res) => {
    try {
        const vols = await Vol.aggregate([
            {
                $match: {
                    statut: { $nin: [ STATUT_VOL.ANNULE, STATUT_VOL.TERMINE ] }
                }
            },
            {
                $group: {
                    _id: null,
                    vols: { $push: "$$ROOT" },
                    count: { $sum: 1}
                }
            },
            {
                $project: {
                    _id: 0,
                    vols: 1,
                    count: 1
                }
            }
        ]);
        res.status(201).json(vols);
    } catch (err) {
        res.status(404).json({ erreur: err.message });
    }
});

// Route pour permettre de créer un nouveau vol
router.post(`${ROADS.ROOT}`, async (req, res) => {
    try {
        const vol = await Vol.create(req.body);
        res.status(201).json({ message: VALIDATIONS.VOL_CREE, vol });
    } catch (err) {
        res.status(404).json({ erreur: err.message });
    }
});

// Route pour mettre à jour un vol déjà existant
router.put(`${ROADS.ROOT}:id`, async (req, res) => {
    try {
        if (req.params.id != req.body.id) throw new Error(ERRORS.IDENTIFIANT_NON_CORRESPONDANT);
        const vol = await Vol.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json({ message: VALIDATIONS.VOL_MIS_A_JOUR, vol });
    } catch (err) {
        res.status(400).json({ erreur: err.message });
    }
});

// Route pour supprimer un avion 
router.delete(`${ROADS.ROOT}:id`, async (req, res) => {

    try {

        const volExistant = await Vol.findById(req.params.id);

        if (!volExistant) {
            throw new Error(ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT);
        }

        const billets = await Billet.find({ vol: req.params.id });

        // Ouch, des places sont vendu donc on ne peut pas le supprimer
        if (billets.length() > 0) {
            throw new Error(ERRORS.VOL_DEJA_BOOKE);
        }

        const volSupprime = await Vol.findByIdAndDelete(req.params.id);

        res.status(201).json({ message: VALIDATIONS.VOL_SUPPRIME, avion: volSupprime });
    } catch (error) {
        let codeErreur = 500;
        const messageErreur = error.message;
        if (messageErreur === ERRORS.VOL_DEJA_BOOKE) {
            codeErreur = 403;
        }
        if (messageErreur === ERRORS.ERRORS.NON_TROUVEE_AVEC_IDENTIFIANT) {
            codeErreur = 404;
        }
        res.status(codeErreur).json({ erreur: messageErreur });
    }
});

export default router;