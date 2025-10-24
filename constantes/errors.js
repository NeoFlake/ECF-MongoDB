const ERRORS = {
    DATE_ARRIVE_IMPOSSIBLE: "Il est impossible qu'un vole arrive avant son départ",
    AVION_INEXISTANT: "L'avion prévu pour ce vol n'existe pas en base de donnée",
    VOL_INEXISTANT: "Le vol souhaité pour l'emission de ce billet n'existe pas",
    PASSAGER_INEXISTANT: "Le passager souhaité pour l'emission de ce billet n'existe pas",
    PRIX_IMPOSSIBLE: "Un prix ne peux pas être gratuit; il doit obligatoirement vous coûter quelque chose",
    NON_TROUVEE_AVEC_IDENTIFIANT: "Aucun résultat trouvé avec cet identifiant",
    AVION_INDESTRUCTIBLE_CAR_EN_VOL: "L'avion ne peut être supprimé car il est actuellement en vol",
    AVION_DEJA_BOOKE: "L'avion a déjà des places vendu pour de futur vol(s), il ne peut pas être supprimé",
    IDENTIFIANT_NON_CORRESPONDANT: "Erreur lors de la requête, veuillez réitérer",
    VOL_DEJA_BOOKE: "Le vol a déjà des places vendu, il ne peut pas être supprimé",
    AVION_DEJA_ARRIVE: "Le vol en question est déjà arrivé",
    AVION_EN_VOL: "Le vol en question est actuellement en cours",
    AVION_PLEIN: "L'avion ne peut plus accueillir de nouveau passager"
};