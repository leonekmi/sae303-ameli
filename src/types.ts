enum Civilité {
  Monsieur = 1,
  Madame = 2,
}
enum Convention {
  nc = 0,
  c1 = 1,
  c2 = 2,
  c3 = 3,
}
const professions = Object.freeze({
  AMBULANCEVEHICULE_SANITAIRE_LEGER: [1],
  ANATOMO_CYTO_PATHOLOGISTE: [2],
  ANESTHESISTE_REANIMATEUR: [3],
  CANCEROLOGUE_RADIOTHERAPEUTE: [4],
  CANCEROLOGUE_MEDICAL: [5],
  CARDIOLOGUE: [6],
  CHIRURGIEN_GENERAL: [7],
  CHIRURGIEN_INFANTILE: [8],
  CHIRURGIEN_MAXILLO_FACIAL: [9],
  CHIRURGIEN_MAXILLO_FACIAL_ET_STOMATOLOGISTE: [10],
  CHIRURGIEN_ORAL: [11],
  CHIRURGIEN_ORTHOPEDISTE_ET_TRAUMATOLOGUE: [12],
  CHIRURGIEN_PLASTICIEN: [13],
  CHIRURGIEN_THORACIQUE_ET_CARDIO_VASCULAIRE: [14],
  CHIRURGIEN_UROLOGUE: [15],
  CHIRURGIEN_VASCULAIRE: [16],
  CHIRURGIEN_VISCERAL: [17],
  CHIRURGIEN_DENTISTE: [18],
  CHIRURGIEN_DENTISTE_SPECIALISTE_EN_ORTHOPEDIE_DENTO_FACIALE: [19],
  CHIRURGIENS_DENTISTES_SPECIALISTE_EN_CHIRURGIE_ORALE: [20],
  CHIRURGIENS_DENTISTES_SPECIALISTE_EN_MEDECINE_BUCCO_DENTAIRE: [21],
  DERMATOLOGUE_ET_VENEROLOGUE: [22],
  ENDOCRINOLOGUE_DIABETOLOGUE: [23],
  FOURNISSEUR_DE_MATERIEL_MEDICAL_ET_PARA_MEDICAL: [24, 25, 26, 27, 28, 29, 30, 31, 32],
  GASTRO_ENTEROLOGUE_ET_HEPATOLOGUE: [33],
  GERIATRE: [34],
  GYNECOLOGUE_MEDICAL: [35],
  GYNECOLOGUE_MEDICAL_ET_OBSTETRICIEN: [36],
  GYNECOLOGUE_OBSTETRICIEN: [37],
  HEMATOLOGUE: [38],
  INFIRMIER: [39],
  LABORATOIRE: [40, 41],
  LABORATOIRE_DANATOMO_PATHOLOGIE: [42],
  MASSEUR_KINESITHERAPEUTE: [43],
  MEDECIN_BIOLOGISTE: [44],
  MEDECIN_GENERALISTE: [45, 46, 47],
  MEDECIN_GENETICIEN: [48],
  MEDECIN_SPECIALISTE_EN_MEDECINE_NUCLEAIRE: [49],
  MEDECIN_SPECIALISTE_EN_SANTE_PUBLIQUE_ET_MEDECINE_SOCIALE: [50],
  NEPHROLOGUE: [51],
  NEUROCHIRURGIEN: [52],
  NEUROLOGUE: [53],
  NEUROPSYCHIATRE: [54],
  OBSTETRICIEN: [55],
  OPHTALMOLOGISTE: [56],
  ORTHOPHONISTE: [57],
  ORTHOPTISTE: [58],
  OTO_RHINO_LARYNGOLOGUE_ORL_ET_CHIRURGIEN_CERVICO_FACIAL: [59],
  PEDIATRE: [60],
  PEDICURE_PODOLOGUE: [61],
  PHARMACIEN: [62, 63],
  PNEUMOLOGUE: [64],
  PSYCHIATRE: [65],
  PSYCHIATRE_DE_LENFANT_ET_DE_LADOLESCENT: [66],
  RADIOLOGUE: [67],
  RADIOTHERAPEUTE: [68],
  REANIMATEUR_MEDICAL: [69],
  RHUMATOLOGUE: [70],
  SAGE_FEMME: [71],
  SPECIALISTE_EN_MEDECINE_INTERNE: [72],
  SPECIALISTE_EN_MEDECINE_PHYSIQUE_ET_DE_READAPTATION: [73],
  STOMATOLOGISTE: [74],
});

export interface CNAMData {
  /**
   * Civilité - 1 = Monsieur | 2 = Madame
   */
  c: Civilité;
  nom: string;
  prenom: string;
  /**
   * Profession
   * @see {professions}
   */
  pro: number;
  exercice: number | null;
  /**
   * Nature d'exercice
   * 1 : N’exerce pas actuellement
   * 2 : Libéral activité salariée
   * 3 : Libéral intégral
   * 4 : Libéral temps partiel hospitalier
   * 5 : Libéral temps plein hospitalier
   * 6 : Pharmacie mutualiste
   * 7 : T. plein hosp. contrat mixte
   * 8 : T. plein hosp./mal. aut. med.
   */
  nature: number;
  /**
   * Convention
   */
  conv: Convention;
  place: {
    ville: string;
    cp: string;
    addr: string;
  }
  horaires: {
    /**
     * Type horaires
     * co : consultation
     * ca : horaires d'un cabinet
     */
    type: 'co' | 'ca';
    /**
     * Type de consultation
     */
    consult: 'non_r' | 'avc_rdv' | 'ss_rdv' | 'a_dom';
    /**
     * Format hh:mm
     */
    debut: string;
    /**
     * Format hh:mm
     */
    fin: string;
    /**
     * Jour de la semaine (lundi = 1)
     */
    jour: 1 | 2 | 3 | 4 | 5 | 6 | 7
  }[]
}
