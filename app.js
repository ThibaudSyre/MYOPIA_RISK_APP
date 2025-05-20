// Ensure this script is set to type="text/babel" in CodePen's JS settings
// or that Babel is selected as the JS preprocessor.

// Polyfill for `global` if needed in some environments for libraries, though less common in modern browsers.
// window.global = window;

const { useState, useEffect, createContext, useContext, useMemo } = React; // [cite: 1]

// Icônes (Lucide React) - These are simple functional components
const ChevronRight = ({ className = "w-6 h-6" }) => ( // [cite: 3]
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const SettingsIcon = ({ className = "w-6 h-6" }) => ( // [cite: 4]
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /> 
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const InfoIcon = ({ className = "w-6 h-6" }) => ( // [cite: 6]
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
  </svg>
);
const DownloadIcon = ({ className = "w-6 h-6" }) => ( // [cite: 7]
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);
const EditIcon = ({ className = "w-4 h-4" }) => ( // [cite: 8]
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
);

const initialConfigData = {
    globalSectionWeights: {
        identification: 0.10,
        familyHistory: 0.15,
        visualHabits: 0.20,
        biometrics: 0.25,
        myopiaCharacteristics: 0.15,
        binocularVision: 0.15,
    },
    sections: [
        {
            id: 'identification',
            title: "Identification de l'Utilisateur",
            criteria: [
                { 
                  id: 'birthYear',
                  label: 'Année de naissance (obligatoire)', 
                  type: 'number',
                  weightInSection: 50, 
                  justification: 'L\'âge est un facteur de risque clé. Plus il est jeune, plus le risque de développer une myopie précoce et progressive est élevé.', 
                  note: "Entrez l'année de naissance complète (ex: 2015). L'âge sera calculé automatiquement.",
                  maxPoints: 10,
                },
                { id: 'gender', label: 'Sexe', type: 'select', weightInSection: 25, justification: 'Prévalence légèrement plus élevée chez les filles.', note: "Les études montrent que les filles sont légèrement plus susceptibles de développer une myopie, mais la différence reste modeste.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: 'female', text: 'Féminin', points: 5 }, { value: 'male', text: 'Masculin', points: 0 } ], maxPoints: 5},
                { id: 'ethnicity', label: 'Origine ethnique', type: 'select', weightInSection: 25, justification: 'Prévalence de la myopie plus élevée chez les populations asiatiques.', note: "Les populations asiatiques présentent les taux de myopie les plus élevés, suivies des populations caucasiennes. Les populations africaines et latino-américaines ont une prévalence plus faible.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: 'asian', text: 'Asiatique', points: 10 }, { value: 'caucasian', text: 'Caucasien', points: 5 }, { value: 'african_latino', text: 'Africain, Latino', points: 0 }, { value: 'other', text: 'Autre', points: 0 } ], maxPoints: 10},
            ]
        },
        {
            id: 'familyHistory',
            title: 'Antécédents Familiaux',
            criteria: [
                { id: 'myopicParents', label: 'Parents myopes', type: 'select', weightInSection: 40, justification: "L’hérédité est l’un des principaux facteurs de risque. Le risque pour l’enfant augmente de manière exponentielle avec le nombre de parents myopes.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: 'none', text: 'Aucun', points: 0 }, { value: 'one', text: 'Un parent myope', points: 10 }, { value: 'two', text: 'Deux parents myopes', points: 20 } ], maxPoints: 20},
                { id: 'familyHighMyopia', label: 'Antécédents de myopie forte dans la famille', type: 'radio', weightInSection: 30, justification: "Une myopie forte dans la famille (>-6 D) est un indicateur de risque accru.", options: [ { value: 'no', text: 'Non', points: 0 }, { value: 'yes', text: 'Oui', points: 10 } ], maxPoints: 10},
                { id: 'myopicSiblings', label: 'Frères et sœurs myopes', type: 'select', weightInSection: 20, justification: "La myopie est souvent partagée au sein de la fratrie.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: 'none', text: 'Aucun', points: 0 }, { value: 'one', text: 'Un frère ou une sœur', points: 5 }, { value: 'multiple', text: 'Plusieurs', points: 10 } ], maxPoints: 10},
                { id: 'familyEyeDiseases', label: 'Antécédents de pathologies oculaires familiales', type: 'checkbox', weightInSection: 10, justification: "Certaines pathologies (glaucome, dégénérescence maculaire) sont associées à une fragilité oculaire.", options: [ { value: 'glaucoma_cataract', text: 'Glaucome, cataracte précoce', points: 5 }, { value: 'macular_degeneration', text: 'Dégénérescence maculaire', points: 5 } ], maxPoints: 10},
            ]
        },
        {
            id: 'visualHabits',
            title: 'Habitudes Visuelles et Environnementales',
            criteria: [
                { id: 'timeOutdoor', label: 'Temps passé à l\'extérieur par jour', type: 'select', weightInSection: 30, justification: "La lumière naturelle est un facteur protecteur.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: '<1h', text: 'Moins de 1 heure', points: 15 }, { value: '1-2h', text: '1-2 heures', points: 10 }, { value: '2-3h', text: '2-3 heures', points: 5 }, { value: '>3h', text: 'Plus de 3 heures', points: 0 } ], maxPoints: 15},
                { id: 'timeNearVision', label: 'Temps passé en vision de près par jour', type: 'select', weightInSection: 30, justification: "Une utilisation excessive de la vision de près est associée à une augmentation du risque.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: '>3h', text: 'Plus de 3 heures', points: 15 }, { value: '2-3h', text: '2-3 heures', points: 10 }, { value: '<2h', text: 'Moins de 2 heures', points: 0 } ], maxPoints: 15},
                { id: 'nearVisionActivities', label: 'Type d\'activités en vision de près', type: 'checkbox', weightInSection: 20, justification: "Les activités qui sollicitent fortement la vision de près augmentent la fatigue accommodative.", options: [ { value: 'reading_screens_homework', text: 'Lecture, écrans, devoirs', points: 5 }, { value: 'video_games_gt1h', text: 'Jeux vidéo (>1h)', points: 5 } ], maxPoints: 10},
                { id: 'workingDistance', label: 'Distance de travail', type: 'select', weightInSection: 10, justification: "Une distance de travail très proche augmente l'effort accommodatif.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: '<20cm', text: 'Moins de 20 cm', points: 10 }, { value: '20-40cm', text: '20-40 cm', points: 5 }, { value: '>40cm', text: 'Plus de 40 cm', points: 0 } ], maxPoints: 10},
                { id: 'lightingType', label: 'Type d\'éclairage', type: 'select', weightInSection: 10, justification: "La lumière naturelle est protectrice.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: 'artificial', text: 'Artificiel uniquement', points: 5 }, { value: 'natural', text: 'Naturel uniquement', points: 0 }, { value: 'mixed', text: 'Mixte (naturel + artificiel)', points: 2 } ], maxPoints: 5},
            ]
        },
        {
            id: 'biometrics',
            title: 'Données Biométriques',
            criteria: [
                { 
                  id: 'cycloplegicRefraction', 
                  label: 'Réfraction cycloplégique (sphère équivalente)', 
                  type: 'select', 
                  weightInSection: 40, 
                  justification: "Une faible hypermétropie chez les jeunes enfants est un facteur prédictif de myopie. Les points varient avec l'âge.", 
                  note: "Sélectionnez la réfraction. Les points sont attribués en fonction de cette valeur et de l'âge renseigné précédemment.", 
                  options: [
                    { value: '', text: 'Sélectionnez la réfraction', points: 0},
                    { value: 'hyperopia_ge0.75', text: 'Hyperopie ≥ +0,75 D', points: 0 }, 
                    { value: 'hyperopia_eq0.50', text: 'Hyperopie = +0,50 D', points: 0 }, 
                    { value: 'hyperopia_eq0.25', text: 'Hyperopie = +0,25 D', points: 0 }, 
                    { value: 'myopia_0_or_less', text: 'Myopie (0 D ou plus négatif)', points: 20 },
                  ],
                  maxPoints: 20,
                },
                { 
                  id: 'axialLength', 
                  label: 'Longueur axiale (AL) en mm', 
                  type: 'number',
                  weightInSection: 30, 
                  justification: "Une longueur axiale excessive est directement corrélée au risque de myopie. Les seuils sont ajustés selon l’âge.",
                  note: "Entrez la longueur axiale. Les points sont attribués en fonction de cette valeur et de l'âge.",
                  maxPoints: 15,
                },
                { 
                  id: 'cornealRadius', // Changed from keratometry
                  label: 'Rayon cornéen moyen (en mm)', // Changed label
                  type: 'number', 
                  weightInSection: 20, 
                  justification: "Le ratio Longueur Axiale / Rayon Cornéen (AL/CR) est un indicateur clé. Un ratio élevé (≥ 3.0) augmente le risque.",
                  note: "Entrez le rayon cornéen moyen en mm (ex: 7.8). Le ratio AL/CR sera calculé avec la longueur axiale.", // Changed note
                  maxPoints: 10,
                },
                { id: 'iop', label: 'Pression intraoculaire (PIO)', type: 'select', weightInSection: 10, justification: "Une PIO élevée peut être un facteur de risque.", note: "Options et points basés sur une interprétation commune.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: 'normal', text: 'Normale (≤ 21 mmHg)', points: 0 }, { value: 'borderline', text: 'Limite (>21 et ≤24 mmHg)', points: 2 }, { value: 'high', text: 'Élevée (> 24 mmHg)', points: 5 } ], maxPoints: 5},
            ]
        },
        {
            id: 'myopiaCharacteristics',
            title: 'Caractéristiques de la Myopie (si déjà myope)',
            isConditional: true, 
            criteria: [
                { id: 'myopiaOnsetAge', label: 'Âge d’apparition de la myopie', type: 'select', weightInSection: 25, justification: "Plus la myopie apparaît jeune, plus elle a de chances de progresser rapidement.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: '<6', text: 'Avant 6 ans', points: 20 }, { value: '6-10', text: '6-10 ans', points: 15 }, { value: '11-12', text: '11-12 ans', points: 10 }, { value: '>12', text: 'Après 12 ans', points: 5 } ], maxPoints: 20},
                { id: 'currentMyopiaValue', label: 'Valeur de la myopie actuelle (sphère équivalente)', type: 'select', weightInSection: 25, justification: "Plus la myopie est élevée, plus le risque de progression et de complications augmente.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: '<-1D', text: 'Moins de -1,00 D', points: 5 }, { value: '-1to-3D', text: 'Entre -1,00 et -3,00 D', points: 10 }, { value: '-3to-6D', text: 'Entre -3,00 et -6,00 D', points: 15 }, { value: '>-6D', text: 'Plus de -6,00 D', points: 20 } ], maxPoints: 20},
                { id: 'progressionSpeed', label: 'Vitesse de progression récente', type: 'select', weightInSection: 25, justification: "Une progression rapide (> -1,00 D/an) est un signal d'alerte.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: '<-0.5Dpa', text: '< -0,50 D/an', points: 0 }, { value: '-0.5to-1Dpa', text: 'Entre -0,50 et -1,00 D/an', points: 10 }, { value: '>-1Dpa', text: '> -1,00 D/an', points: 20 } ], maxPoints: 20},
                { id: 'correctionType', label: 'Type de correction utilisée', type: 'select', weightInSection: 15, justification: "Les méthodes de contrôle comme l'orthokératologie et l'atropine sont reconnues pour ralentir la progression.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: 'glasses_unifocal', text: 'Lunettes (unifocales)', points: 5 }, { value: 'soft_lenses', text: 'Lentilles souples', points: 5 }, { value: 'orthok', text: 'Lentilles orthokératologiques', points: 0 }, { value: 'atropine', text: 'Traitement pharmacologique (Atropine)', points: 0 }, { value: 'other_control', text: 'Autre méthode de contrôle', points: 0} ], maxPoints: 5},
                { id: 'controlFrequency', label: 'Fréquence des contrôles', type: 'select', weightInSection: 10, justification: "Un suivi régulier permet de détecter et de contrôler la progression rapidement.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: '<1pa', text: 'Moins de 1 fois par an', points: 10 }, { value: '1pa', text: '1 fois par an', points: 5 }, { value: '>=2pa', text: '2 fois par an ou plus', points: 0 } ], maxPoints: 10},
            ]
        },
        {
            id: 'binocularVision',
            title: 'Vision Binoculaire',
            criteria: [
                { id: 'convergenceAmplitude', label: 'Amplitude de convergence', type: 'select', weightInSection: 20, justification: "Une faible amplitude de convergence est souvent associée à une fatigue visuelle.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: '>=15PD', text: '≥ 15 Δ (normal)', points: 0 }, { value: '10-15PD', text: '10-15 Δ (faible)', points: 5 }, { value: '<10PD', text: '< 10 Δ (insuffisance)', points: 10 } ], maxPoints: 10},
                { id: 'stereoscopy', label: 'Stéréoscopie (test de Lang ou TNO)', type: 'select', weightInSection: 15, justification: "Une mauvaise perception de la profondeur peut révéler une anomalie binoculaire.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: '<=60sac', text: '≤ 60 secondes d\'arc (normal)', points: 0 }, { value: '60-120sac', text: '60-120 secondes d\'arc (réduite)', points: 5 }, { value: '>120sac', text: '> 120 secondes d\'arc (absence)', points: 10 } ], maxPoints: 10},
                { id: 'phoriaFar', label: 'Phorie (vision de loin)', type: 'select', weightInSection: 15, justification: "Une ésophorie augmente l'effort accommodatif.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: 'ortho_exo<3', text: 'Ortho ou exophorie < 3 Δ', points: 0 }, { value: 'exo>3', text: 'Exophorie > 3 Δ', points: 5 }, { value: 'eso_any', text: 'Ésophorie (toute valeur)', points: 10 } ], maxPoints: 10},
                { id: 'phoriaNear', label: 'Phorie (vision de près)', type: 'select', weightInSection: 15, justification: "Une ésophorie augmente l'effort accommodatif.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: 'ortho_exo<6', text: 'Ortho ou exophorie < 6 Δ', points: 0 }, { value: 'exo>6', text: 'Exophorie > 6 Δ', points: 5 }, { value: 'eso_any', text: 'Ésophorie (toute valeur)', points: 10 } ], maxPoints: 10},
                { id: 'acARatio', label: 'Rapport AC/A (calculé ou estimé)', type: 'select', weightInSection: 20, justification: "Un rapport élevé signifie que la stimulation accommodative entraîne une convergence excessive.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: '3-5to1', text: '3:1 à 5:1 (normal)', points: 0 }, { value: '<3to1', text: '< 3:1 (faible)', points: 5 }, { value: '>5to1', text: '> 5:1 (élevé)', points: 10 } ], maxPoints: 10},
                { id: 'accommodativeLag', label: 'Lag accommodatif (MEM ou Nott)', type: 'select', weightInSection: 15, justification: "Un lag élevé (> +1,00 D) est un signe de sous-accommodation.", options: [ { value: '', text: 'Sélectionnez', points: 0}, { value: '<=0.75D', text: '≤ +0,75 D (normal)', points: 0 }, { value: '0.75-1D', text: '+0,75 D à +1,00 D', points: 5 }, { value: '>1D', text: '> +1,00 D', points: 10 } ], maxPoints: 10},
            ]
        }
    ],
    resultInterpretation: [
        { min: 0, max: 20, label: "Faible Risque", color: "text-green-600" },
        { min: 21, max: 40, label: "Risque Modéré", color: "text-yellow-600" },
        { min: 41, max: 70, label: "Risque Élevé", color: "text-orange-600" },
        { min: 71, max: 100, label: "Risque Très Élevé", color: "text-red-600" },
    ],
    scientificInfo: `
        Objectif de l'application : Évaluer le risque de développer ou de voir progresser une myopie chez l'enfant et l'adolescent.
        Enjeux de la myopie : La myopie est un trouble de la vision courant qui peut entraîner des complications oculaires graves si elle atteint des niveaux élevés.
        Facteurs de risque connus : Âge, origine ethnique, antécédents familiaux, habitudes visuelles (temps passé à l'extérieur, travail de près), données biométriques de l'œil.
        Références bibliographiques : (Seront ajoutées ici de manière plus formelle)
        - Tideman JWL, Snabel MCC, Tedja MS, et al. Association of Axial Length With Risk of Uncorrectable Visual Impairment for Europeans With Myopia. JAMA Ophthalmol. 2016;134(12):1355-1363.
        - Wolffsohn JS, Calossi A, Cho P, et al. IMI - Myopia Control Reports Overview and Introduction. Invest Ophthalmol Vis Sci. 2019;60(3):M1-M19.
        - Morgan IG, Ohno-Matsui K, Saw SM. Myopia. Lancet. 2012 May 5;379(9827):1739-48.
        - Flitcroft DI, He M, Jonas JB, et al. IMI – Defining and Classifying Myopia: A Proposed Set of Standards for Clinical and Research Operations. Invest Ophthalmol Vis Sci. 2019;60(3):M20-M30.
    `
};

const ConfigContext = createContext();

const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState(() => {
        const savedConfig = localStorage.getItem('myopiaConfigV4'); // Changed key for new version
        try {
            const parsed = savedConfig ? JSON.parse(savedConfig) : null;
            return parsed && parsed.globalSectionWeights ? parsed : initialConfigData;
        } catch (error) {
            console.error("Error parsing config from localStorage", error);
            return initialConfigData;
        }
    });

    useEffect(() => {
        localStorage.setItem('myopiaConfigV4', JSON.stringify(config));
    }, [config]);
    
    const updateConfig = (newConfig) => {
        setConfig(newConfig);
    };
    
    const resetConfig = () => {
        setConfig(initialConfigData);
        localStorage.setItem('myopiaConfigV4', JSON.stringify(initialConfigData));
    }

    return (
        <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

const useConfig = () => useContext(ConfigContext);

const Tooltip = ({ text, children }) => {
    const [visible, setVisible] = useState(false);
    if (!text) return <>{children}</>;
    return (
        <div className="relative inline-block">
            <span onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)} className="cursor-help">
                {children}
            </span>
            {visible && (
                <div className="absolute z-50 w-64 p-2 text-sm text-white bg-gray-800 rounded-md shadow-lg"
                     style={{bottom: '120%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'normal'}}>
                    {text}
                </div>
            )}
        </div>
    );
};

const CriterionInput = ({ criterion, value, onChange, sectionId }) => {
    const inputId = `${sectionId}-${criterion.id}`;

    const handleChange = (e) => {
        if (criterion.type === 'checkbox') {
            const { checked, value: optionValue } = e.target;
            const currentValues = Array.isArray(value) ? value : (value ? [value] : []);
            let newValues;
            if (checked) {
                newValues = [...currentValues, optionValue];
            } else {
                newValues = currentValues.filter(v => v !== optionValue);
            }
            onChange(criterion.id, newValues);
        } else {
             onChange(criterion.id, e.target.value);
        }
    };
    
    return (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                {criterion.label}
                {criterion.justification && (
                    <Tooltip text={criterion.justification}>
                        <InfoIcon className="inline w-4 h-4 ml-1 text-blue-500 align-middle" />
                    </Tooltip>
                )}
            </label>
            {criterion.note && <p className="text-xs text-gray-500 mb-2">{criterion.note}</p>}

            {criterion.type === 'select' && (
                <select id={inputId} value={value || ''} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {criterion.options.map(opt => (
                        <option key={opt.value} value={opt.value} disabled={opt.value === '' && criterion.label.includes('(obligatoire)')}>
                            {opt.text}
                        </option>
                    ))}
                </select>
            )}
            {criterion.type === 'radio' && (
                <div className="mt-2 space-y-2">
                    {criterion.options.map(opt => (
                        <label key={opt.value} className="flex items-center space-x-2">
                            <input type="radio" name={inputId} value={opt.value} checked={value === opt.value} onChange={handleChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                            <span>{opt.text}</span>
                        </label>
                    ))}
                </div>
            )}
            {criterion.type === 'checkbox' && (
                 <div className="mt-2 space-y-2">
                    {criterion.options.map(opt => (
                        <label key={opt.value} className="flex items-center space-x-2">
                            <input type="checkbox" value={opt.value} checked={Array.isArray(value) && value.includes(opt.value)} onChange={handleChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            <span>{opt.text}</span>
                        </label>
                    ))}
                </div>
            )}
            {criterion.type === 'number' && (
                 <input
                    type="number"
                    id={inputId}
                    value={value || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={criterion.id === 'birthYear' ? "AAAA" : "Entrez une valeur numérique"}
                    step={criterion.id === 'cornealRadius' ? "0.01" : (criterion.id === 'axialLength' ? "0.1" : "1")}
                    min={criterion.id === 'birthYear' ? "1900" : (criterion.id === 'cornealRadius' || criterion.id === 'axialLength' ? "0" : undefined)}
                    max={criterion.id === 'birthYear' ? new Date().getFullYear() : undefined}
                />
            )}
        </div>
    );
};

const EvaluationSection = ({ section, answers, onAnswerChange, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">{section.title}</h2>
            {section.criteria.map(criterion => (
                <CriterionInput 
                    key={criterion.id} 
                    criterion={criterion} 
                    value={answers[criterion.id]} 
                    onChange={onAnswerChange}
                    sectionId={section.id}
                />
            ))}
        </div>
    );
};

const HomeScreen = ({ onStart, onNavigate }) => (
    <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6">Évaluation du Risque de Myopie</h1>
        <p className="text-lg text-gray-700 mb-8">
            Cette application a pour objectif d'évaluer les facteurs de risque de développement ou de progression de la myopie.
            Elle est basée sur les connaissances scientifiques actuelles. Veuillez noter qu'elle ne remplace pas un avis médical professionnel.
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
            <button onClick={onStart} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2">
                <ChevronRight className="w-5 h-5" />
                <span>Commencer l'Évaluation</span>
            </button>
            <button onClick={() => onNavigate('settings')} className="w-full md:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center justify-center space-x-2">
                <SettingsIcon className="w-5 h-5" />
                <span>Paramètres</span>
            </button>
            <button onClick={() => onNavigate('scientific-info')} className="w-full md:w-auto bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-8 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center justify-center space-x-2">
                <InfoIcon className="w-5 h-5" />
                <span>Informations Scientifiques</span>
            </button>
        </div>
    </div>
);

const EvaluationScreen = ({ onFinish, onNavigate }) => {
    const { config } = useConfig();
    const [answers, setAnswers] = useState({});
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [isMyopic, setIsMyopic] = useState(null); 

    const sectionsToDisplay = React.useMemo(() => {
        return config.sections.filter(section => {
            if (section.id === 'myopiaCharacteristics') {
                return isMyopic === 'yes';
            }
            return true;
        });
    }, [config.sections, isMyopic]);

    const handleAnswerChange = (criterionId, value) => {
        setAnswers(prev => ({ ...prev, [criterionId]: value }));
    };

    const handleNextSection = () => {
        const currentSectionConfig = sectionsToDisplay[currentSectionIndex];
        if (currentSectionConfig && currentSectionConfig.id === 'identification') {
            const birthYearCriterion = currentSectionConfig.criteria.find(c => c.id === 'birthYear');
            if (birthYearCriterion && birthYearCriterion.label.includes('(obligatoire)')) {
                const birthYear = parseInt(answers.birthYear);
                if (!answers.birthYear || isNaN(birthYear) || birthYear < 1900 || birthYear > new Date().getFullYear()) {
                    alert("Veuillez renseigner une année de naissance valide pour continuer.");
                    return;
                }
            }
        }

        if (currentSectionIndex < sectionsToDisplay.length - 1) {
            setCurrentSectionIndex(currentSectionIndex + 1);
        } else {
            onFinish(answers, isMyopic);
        }
    };

    const handlePrevSection = () => {
        if (currentSectionIndex > 0) {
            setCurrentSectionIndex(currentSectionIndex - 1);
        }
    };
    
    const ProgressBar = () => {
        const progress = sectionsToDisplay.length > 0 ? ((currentSectionIndex + 1) / sectionsToDisplay.length) * 100 : 0;
        return (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 dark:bg-gray-700">
                <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
        );
    };

    if (isMyopic === null) {
        return (
            <div className="p-8 bg-white rounded-xl shadow-xl max-w-lg mx-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Question préliminaire :</h2>
                <p className="text-gray-700 mb-6">Êtes-vous (ou la personne concernée) déjà diagnostiqué(e) comme étant myope ?</p>
                <div className="flex space-x-4">
                    <button onClick={() => setIsMyopic('yes')} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg">Oui</button>
                    <button onClick={() => setIsMyopic('no')} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg">Non</button>
                </div>
                 <button onClick={() => onNavigate('home')} className="mt-6 w-full text-sm text-indigo-600 hover:text-indigo-800">&larr; Annuler et retourner à l'accueil</button>
            </div>
        );
    }
    
    if (sectionsToDisplay.length === 0 && isMyopic !== null) {
        setTimeout(() => onFinish(answers, isMyopic), 0);
        return (
            <div className="p-8 bg-white rounded-xl shadow-xl max-w-lg mx-auto text-center">
                <p className="text-gray-700 mb-4">Calcul des résultats...</p>
            </div>
        );
    }
    
    const safeCurrentSectionIndex = Math.min(currentSectionIndex, sectionsToDisplay.length - 1);
    if (safeCurrentSectionIndex < 0 && sectionsToDisplay.length > 0) {
      setCurrentSectionIndex(0);
      return <p>Chargement...</p>;
    }
    if (sectionsToDisplay.length === 0) {
        return (
             <div className="p-8 bg-white rounded-xl shadow-xl max-w-lg mx-auto text-center">
                <p className="text-gray-700 mb-4">Aucune section applicable. Redirection...</p>
                 <button onClick={() => onNavigate('home')} className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg">Retour à l'accueil</button>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            <button onClick={() => onNavigate('home')} className="mb-6 text-sm text-indigo-600 hover:text-indigo-800">&larr; Retour à l'accueil</button>
            <ProgressBar />
            <EvaluationSection 
                section={sectionsToDisplay[safeCurrentSectionIndex]} 
                answers={answers} 
                onAnswerChange={handleAnswerChange}
                isVisible={true} 
            />
            <div className="mt-8 flex justify-between items-center">
                <button 
                    onClick={handlePrevSection} 
                    disabled={safeCurrentSectionIndex === 0}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg disabled:opacity-50"
                >
                    Précédent
                </button>
                <div className="text-sm text-gray-600">
                    Section {safeCurrentSectionIndex + 1} sur {sectionsToDisplay.length}
                </div>
                <button 
                    onClick={handleNextSection} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg"
                >
                    {safeCurrentSectionIndex === sectionsToDisplay.length - 1 ? 'Voir les Résultats' : 'Suivant'}
                </button>
            </div>
        </div>
    );
};

const ResultsScreen = ({ results, onRestart, onNavigate }) => {
    const { config } = useConfig();

    if (!results) {
        return <div className="text-center p-8">Calcul des résultats... Un instant.</div>;
    }

    const { totalScore, riskCategory, sectionScores, detailedFactors } = results;

    const getRiskColor = (label) => {
        const category = config.resultInterpretation.find(cat => cat.label === label);
        return category ? category.color : 'text-gray-800';
    };
    
    const scoreColor = riskCategory ? getRiskColor(riskCategory.label) : 'text-gray-800';
    const riskLabel = riskCategory ? riskCategory.label : "Non déterminé";

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-10 bg-white rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Vos Résultats</h2>
            
            <div className="text-center mb-10">
                <p className="text-xl text-gray-700 mb-2">Score Global de Risque de Myopie :</p>
                <p className={`text-6xl font-extrabold ${scoreColor} mb-2`}>{totalScore.toFixed(0)} / 100</p>
                <p className={`text-2xl font-semibold ${scoreColor}`}>{riskLabel}</p>
            </div>

            {sectionScores && Object.keys(sectionScores).length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Détail des scores par section :</h3>
                    <ul className="space-y-2">
                        {Object.entries(sectionScores).map(([sectionId, scoreData]) => {
                            const sectionConfig = config.sections.find(s => s.id === sectionId);
                            if (!sectionConfig || !scoreData) return null; 
                             return (
                                <li key={sectionId} className="p-3 bg-gray-100 rounded-lg flex justify-between items-center">
                                    <span className="text-gray-700">{sectionConfig.title}:</span>
                                    <span className="font-semibold text-gray-800">
                                        {scoreData.weightedScore !== undefined ? scoreData.weightedScore.toFixed(1) : 'N/A'} pts 
                                        (sur { (config.globalSectionWeights[sectionId] * 100).toFixed(0) } pts max pour cette section dans le global)
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Explication des résultats :</h3>
                <p className="text-gray-700 leading-relaxed">
                    Votre score global indique un niveau de risque {riskLabel ? riskLabel.toLowerCase() : "non déterminé"}. 
                    Ce score est calculé en fonction des facteurs de risque que vous avez renseignés. 
                    Les sections ayant contribué le plus à votre score sont celles où les points pondérés sont les plus élevés.
                    Une attention particulière à ces facteurs pourrait être bénéfique.
                </p>
            </div>

            <div className="mb-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Recommandations personnalisées (Exemples) :</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 leading-relaxed">
                    {totalScore > 40 && <li>Consultez un professionnel de la vue (ophtalmologiste ou optométriste) pour un bilan complet et des conseils personnalisés.</li>}
                    {detailedFactors?.lowOutdoorTime && <li>Augmentez le temps passé à l'extérieur. Au moins 2 heures par jour de lumière naturelle sont recommandées pour les enfants.</li>}
                    {detailedFactors?.highNearWork && <li>Faites des pauses régulières lors du travail de près (lecture, écrans). Adoptez la règle des 20-20-20 : toutes les 20 minutes, regardez quelque chose à 20 pieds (environ 6 mètres) pendant 20 secondes.</li>}
                    {detailedFactors?.closeWorkingDistance && <li>Maintenez une distance de lecture et de travail adéquate (au moins la distance de Harmon, du coude au poing fermé, soit environ 30-40 cm).</li>}
                    {detailedFactors?.familyHistoryPositive && <li>En raison d'antécédents familiaux, une vigilance accrue et des contrôles réguliers sont d'autant plus importants.</li>}
                    {detailedFactors?.highAlCrRatio && <li>Un ratio Longueur Axiale / Rayon Cornéen élevé est un indicateur de risque. Discutez-en avec votre professionnel de la vue.</li>}
                    <li>Assurez un bon éclairage lors des activités de près, en privilégiant la lumière naturelle lorsque c'est possible.</li>
                    <li>Un suivi régulier par un professionnel de la vue est crucial pour tous les enfants, et particulièrement si des facteurs de risque élevés sont présents ou si une myopie est déjà installée.</li>
                </ul>
                <p className="mt-4 text-sm text-gray-600">Ces recommandations sont générales et ne remplacent pas un avis médical. Un professionnel pourra vous donner des conseils spécifiques à votre situation ou à celle de votre enfant.</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button onClick={onRestart} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150">
                    Recommencer une nouvelle évaluation
                </button>
                <button onClick={() => alert("La fonctionnalité d'export en PDF est une démonstration et n'est pas pleinement implémentée dans cette version.")} className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 flex items-center justify-center space-x-2">
                    <DownloadIcon className="w-5 h-5" />
                    <span>Exporter le Rapport (PDF)</span>
                </button>
                 <button onClick={() => onNavigate('home')} className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150">
                    Retour à l'accueil
                </button>
            </div>
        </div>
    );
};

const ScientificInfoScreen = ({ onNavigate }) => {
    const { config } = useConfig();
    return (
        <div className="max-w-3xl mx-auto p-6 md:p-10 bg-white rounded-xl shadow-xl">
            <button onClick={() => onNavigate('home')} className="mb-6 text-sm text-indigo-600 hover:text-indigo-800">&larr; Retour à l'accueil</button>
            <h2 className="text-3xl font-bold text-indigo-700 mb-6">Informations Scientifiques</h2>
            <div className="prose prose-indigo max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {config.scientificInfo}
            </div>
        </div>
    );
};

const SettingsScreen = ({ onNavigate }) => {
    const { config, updateConfig, resetConfig } = useConfig();
    const [editableConfig, setEditableConfig] = useState(JSON.parse(JSON.stringify(config))); 

    const handleGlobalWeightChange = (sectionId, newWeight) => {
        const weight = parseFloat(newWeight);
        if (!isNaN(weight) && weight >= 0 && weight <= 1) {
            setEditableConfig(prev => ({
                ...prev,
                globalSectionWeights: {
                    ...prev.globalSectionWeights,
                    [sectionId]: weight
                }
            }));
        } else if (newWeight === "") {
             setEditableConfig(prev => ({
                ...prev,
                globalSectionWeights: {
                    ...prev.globalSectionWeights,
                    [sectionId]: 0 
                }
            }));
        }
    };

    const handleCriterionWeightChange = (sectionIndex, criterionIndex, newWeight) => {
        const weight = parseInt(newWeight);
         if (!isNaN(weight) && weight >= 0 && weight <= 100) {
            const updatedSections = JSON.parse(JSON.stringify(editableConfig.sections));
            updatedSections[sectionIndex].criteria[criterionIndex].weightInSection = weight;
            setEditableConfig(prev => ({ ...prev, sections: updatedSections }));
        } else if (newWeight === "") {
            const updatedSections = JSON.parse(JSON.stringify(editableConfig.sections));
            updatedSections[sectionIndex].criteria[criterionIndex].weightInSection = 0;
            setEditableConfig(prev => ({ ...prev, sections: updatedSections }));
        }
    };
    
    const handleOptionPointsChange = (sectionIndex, criterionIndex, optionIndex, newPointsStr) => {
        const points = parseInt(newPointsStr);
        if (!isNaN(points)) {
            const updatedSections = JSON.parse(JSON.stringify(editableConfig.sections)); 
            if (updatedSections[sectionIndex]?.criteria[criterionIndex]?.options[optionIndex]) {
                 updatedSections[sectionIndex].criteria[criterionIndex].options[optionIndex].points = points;
                 setEditableConfig(prev => ({ ...prev, sections: updatedSections }));
            }
        } else if (newPointsStr === "" || newPointsStr === "-") { 
            const updatedSections = JSON.parse(JSON.stringify(editableConfig.sections));
             if (updatedSections[sectionIndex]?.criteria[criterionIndex]?.options[optionIndex]) {
                updatedSections[sectionIndex].criteria[criterionIndex].options[optionIndex].points = newPointsStr === "-" ? "-" : 0;
                setEditableConfig(prev => ({ ...prev, sections: updatedSections }));
             }
        }
    };

    const handleSave = () => {
        let tempConfig = JSON.parse(JSON.stringify(editableConfig));

        tempConfig.sections.forEach(section => {
            section.criteria.forEach(criterion => {
                if (criterion.options) {
                    criterion.options.forEach(option => {
                        if (option.points === "-") option.points = 0;
                        else if (typeof option.points === 'string') option.points = parseInt(option.points) || 0;
                    });
                }
            });
        });

        const totalGlobal = Object.values(tempConfig.globalSectionWeights).reduce((sum, w) => sum + Number(w || 0), 0);
        const activeSectionsWithWeights = tempConfig.sections.filter(s => s.criteria && s.criteria.length > 0 && (tempConfig.globalSectionWeights[s.id] || 0) > 0);
        
        if (activeSectionsWithWeights.length > 0 && Math.abs(totalGlobal - 1.0) > 0.01) {
             alert(`La somme des pondérations globales des sections actives doit être proche de 1.0 (actuellement ${totalGlobal.toFixed(2)}). Ajustez avant de sauvegarder.`);
             return;
        }

        for (const section of tempConfig.sections) {
            if (section.criteria && section.criteria.length > 0) { 
                const totalCritWeight = section.criteria.reduce((sum, c) => sum + Number(c.weightInSection || 0), 0);
                if (Math.abs(totalCritWeight - 100) > 0.1) { 
                     alert(`La somme des pondérations des critères dans la section "${section.title}" doit être de 100 (actuellement ${totalCritWeight}). Ajustez avant de sauvegarder.`);
                     return;
                }
            }
        }
        updateConfig(tempConfig);
        alert("Paramètres sauvegardés !");
        onNavigate('home');
    };
    
    const confirmAndReset = () => {
        if (window.confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres à leurs valeurs par défaut ? Cette action est irréversible.")) {
            resetConfig(); 
            setEditableConfig(JSON.parse(JSON.stringify(initialConfigData))); 
            alert("Paramètres réinitialisés aux valeurs par défaut.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white rounded-xl shadow-xl">
            <button onClick={() => onNavigate('home')} className="mb-6 text-sm text-indigo-600 hover:text-indigo-800">&larr; Retour à l'accueil</button>
            <h2 className="text-3xl font-bold text-indigo-700 mb-6">Paramètres de Calcul</h2>
            <p className="text-gray-600 mb-6">Modifiez ici les pondérations et les points pour chaque critère. Assurez-vous que les totaux de pondération sont cohérents. Les modifications sont sauvegardées localement sur votre navigateur.</p>

            <div className="mb-8 p-4 border rounded-lg bg-indigo-50">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Pondérations Globales des Sections</h3>
                {Object.keys(editableConfig.globalSectionWeights).map(sectionId => {
                    const sectionDetails = editableConfig.sections.find(s => s.id === sectionId);
                    return (
                        <div key={sectionId} className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded">
                            <label htmlFor={`globalWeight-${sectionId}`} className="text-gray-700 flex-1">{sectionDetails?.title || sectionId}:</label>
                            <input 
                                type="number" 
                                id={`globalWeight-${sectionId}`}
                                value={editableConfig.globalSectionWeights[sectionId]} 
                                onChange={(e) => handleGlobalWeightChange(sectionId, e.target.value)}
                                className="w-24 p-1 border rounded-md text-right focus:ring-indigo-500 focus:border-indigo-500"
                                step="0.01" min="0" max="1"
                            />
                        </div>
                    );
                })}
                 <p className="text-xs text-gray-500 mt-2">La somme des pondérations globales des sections actives (celles qui ont des critères et un poids {'>'} 0) devrait être 1.0 pour un score final sur 100.</p>
            </div>

            {editableConfig.sections.map((section, sectionIndex) => (
                <div key={section.id} className="mb-8 p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{section.title}</h3>
                    {section.criteria && section.criteria.length > 0 && <p className="text-xs text-gray-500 mb-3">La somme des pondérations des critères dans cette section doit être 100%.</p>}
                    
                    {section.criteria.map((criterion, criterionIndex) => (
                        <div key={criterion.id} className="mb-4 p-3 border rounded-md bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-gray-700 font-medium">{criterion.label}</label>
                                <div className="flex items-center">
                                     <span className="text-xs mr-1">Poids:</span>
                                    <input 
                                        type="number"
                                        value={criterion.weightInSection}
                                        onChange={(e) => handleCriterionWeightChange(sectionIndex, criterionIndex, e.target.value)}
                                        className="w-20 p-1 border rounded-md text-right focus:ring-indigo-500 focus:border-indigo-500"
                                        step="1" min="0" max="100"
                                    />
                                    <span className="text-xs ml-1">%</span>
                                </div>
                            </div>
                            {criterion.options && criterion.options.map((option, optionIndex) => (
                                 <div key={`${criterion.id}-${option.value}-${optionIndex}`} className="flex items-center justify-between ml-4 mb-1 py-1 border-b border-gray-200 last:border-b-0">
                                    <span className="text-sm text-gray-600 flex-1 truncate pr-2">{option.text || `Option ${optionIndex + 1}`}</span>
                                    <div className="flex items-center">
                                        <input 
                                            type="number"
                                            value={option.points}
                                            onChange={(e) => handleOptionPointsChange(sectionIndex, criterionIndex, optionIndex, e.target.value)}
                                            className="w-20 p-1 border rounded-md text-right focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <span className="text-xs ml-1">pts</span>
                                    </div>
                                </div>
                            ))}
                             {(criterion.id === 'birthYear' || criterion.id === 'axialLength' || criterion.id === 'cornealRadius' || (criterion.id === 'cycloplegicRefraction' && criterion.options)) && (
                                <p className="text-xs text-gray-500 ml-4 mt-1">
                                    {criterion.id === 'birthYear' && "Les points pour l'âge sont calculés dynamiquement."}
                                    {criterion.id === 'axialLength' && "Les points pour la longueur axiale sont calculés dynamiquement en fonction de l'âge."}
                                    {criterion.id === 'cornealRadius' && "Les points pour le ratio AL/CR sont calculés dynamiquement."}
                                    {criterion.id === 'cycloplegicRefraction' && "Les points pour la réfraction sont calculés dynamiquement en fonction de l'âge. Les points ici sont des valeurs de base."}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ))}
            
            <div className="mt-10 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button onClick={confirmAndReset} className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150">
                    Réinitialiser les Défauts
                </button>
                <button onClick={handleSave} className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150">
                    Sauvegarder les Paramètres
                </button>
            </div>
        </div>
    );
};

function MainApp() {
    const [currentPage, setCurrentPage] = useState('home');
    const [evaluationResults, setEvaluationResults] = useState(null);
    const { config } = useConfig();

    const calculateResults = (answers, isMyopic) => {
        let totalScore = 0;
        const sectionScores = {};
        let activeSectionsTotalWeight = 0; 
        const detailedFactorsForRecommendations = {};

        let calculatedAge = null;
        const birthYear = parseInt(answers.birthYear);
        if (!isNaN(birthYear) && birthYear > 1900 && birthYear <= new Date().getFullYear()) {
            calculatedAge = new Date().getFullYear() - birthYear;
        }
        answers.calculatedAge = calculatedAge;


        config.sections.forEach(section => {
            if (section.id === 'myopiaCharacteristics' && isMyopic !== 'yes') {
                return; 
            }

            let sectionRawPointsSum = 0; 
            let sectionCriteriaWeightSum = 0; 
            
            section.criteria.forEach(criterion => {
                const answerValue = answers[criterion.id];
                let criterionPoints = 0;
                let maxPointsForCriterion = criterion.maxPoints || 0; 

                if (criterion.id === 'birthYear') {
                    if (calculatedAge !== null) {
                        if (calculatedAge < 10) criterionPoints = 10;
                        else if (calculatedAge >= 10 && calculatedAge <= 12) criterionPoints = 5;
                        else criterionPoints = 0;
                    }
                } else if (criterion.id === 'cycloplegicRefraction') {
                    const refractionChoice = answers.cycloplegicRefraction;
                    if (calculatedAge !== null && refractionChoice) {
                        if (refractionChoice === 'myopia_0_or_less') {
                            criterionPoints = 20;
                        } else if (calculatedAge >= 6 && calculatedAge <= 8) {
                            if (refractionChoice === 'hyperopia_ge0.75') criterionPoints = 0;
                            else if (refractionChoice === 'hyperopia_eq0.50' || refractionChoice === 'hyperopia_eq0.25') criterionPoints = 5;
                        } else if (calculatedAge >= 9 && calculatedAge <= 10) {
                            if (refractionChoice === 'hyperopia_eq0.50' || refractionChoice === 'hyperopia_eq0.25') criterionPoints = 10;
                            else criterionPoints = 0;
                        } else if (calculatedAge >= 11 && calculatedAge <= 12) {
                            if (refractionChoice === 'hyperopia_eq0.25') criterionPoints = 15;
                            else criterionPoints = 0;
                        } else { 
                           criterionPoints = 0;
                        }
                    }
                } else if (criterion.id === 'axialLength') {
                    const alValue = parseFloat(answers.axialLength);
                    if (calculatedAge !== null && !isNaN(alValue)) {
                        if (calculatedAge < 10) { 
                            if (alValue > 23) criterionPoints = 5;
                        } else if (calculatedAge >= 10 && calculatedAge <= 12) {
                            if (alValue > 24) criterionPoints = 10;
                        } else if (calculatedAge > 12) { 
                            if (alValue > 26) criterionPoints = 15;
                        }
                    }
                    if (criterionPoints > 0) detailedFactorsForRecommendations.highAxialLength = true;
                } else if (criterion.id === 'cornealRadius') { // Changed from keratometry
                    const al = parseFloat(answers.axialLength);
                    const cornealRadiusMm = parseFloat(answers.cornealRadius); // Directly use the input as CR in mm
                    if (!isNaN(al) && al > 0 && !isNaN(cornealRadiusMm) && cornealRadiusMm > 0) {
                        const ratio = al / cornealRadiusMm;
                        if (ratio >= 3.0) {
                            criterionPoints = 10;
                            detailedFactorsForRecommendations.highAlCrRatio = true;
                        } else {
                            criterionPoints = 0;
                        }
                    }
                } else if (criterion.options && criterion.options.length > 0) { 
                    if (answerValue !== undefined && answerValue !== null && answerValue !== '') {
                        if (criterion.type === 'checkbox') {
                            const selectedOptions = Array.isArray(answerValue) ? answerValue : [answerValue];
                            selectedOptions.forEach(selectedValue => {
                                const option = criterion.options.find(opt => opt.value === selectedValue);
                                if (option) criterionPoints += option.points;
                            });
                        } else {
                            const option = criterion.options.find(opt => opt.value === answerValue);
                            if (option) criterionPoints = option.points;
                        }
                    }
                    if (criterionPoints > 0) { 
                        if (section.id === 'familyHistory') detailedFactorsForRecommendations.familyHistoryPositive = true;
                        if (criterion.id === 'timeOutdoor' && criterionPoints >= 10) detailedFactorsForRecommendations.lowOutdoorTime = true;
                        if (criterion.id === 'timeNearVision' && criterionPoints >= 10) detailedFactorsForRecommendations.highNearWork = true;
                        if (criterion.id === 'workingDistance' && criterionPoints >= 5) detailedFactorsForRecommendations.closeWorkingDistance = true;
                    }
                } else {
                    criterionPoints = 0;
                    maxPointsForCriterion = criterion.maxPoints || 0;
                }
                
                const normalizedCriterionScore = maxPointsForCriterion > 0 ? (criterionPoints / maxPointsForCriterion) : 0;
                
                sectionRawPointsSum += normalizedCriterionScore * (criterion.weightInSection || 0);
                sectionCriteriaWeightSum += (criterion.weightInSection || 0);
            });

            const currentSectionScore = sectionCriteriaWeightSum > 0 ? (sectionRawPointsSum / sectionCriteriaWeightSum) * 100 : 0;
            
            const sectionGlobalWeight = config.globalSectionWeights[section.id] || 0;
            sectionScores[section.id] = {
                rawScore: currentSectionScore, 
                weightedScore: currentSectionScore * sectionGlobalWeight
            };
            
            totalScore += sectionScores[section.id].weightedScore;
            if (sectionGlobalWeight > 0) {
                 activeSectionsTotalWeight += sectionGlobalWeight;
            }
        });
        
        let finalTotalScore = totalScore;

        const riskCategory = config.resultInterpretation.find(cat => finalTotalScore >= cat.min && finalTotalScore <= cat.max) || 
                             config.resultInterpretation[config.resultInterpretation.length -1] || 
                             { label: "Indéterminé", color: "text-gray-600" };

        setEvaluationResults({ totalScore: finalTotalScore, riskCategory, sectionScores, detailedFactors: detailedFactorsForRecommendations });
        setCurrentPage('results');
    };

    const handleStartEvaluation = () => {
        setEvaluationResults(null); 
        setCurrentPage('evaluation');
    };
    
    const handleFinishEvaluation = (finalAnswers, myopicStatus) => {
        calculateResults(finalAnswers, myopicStatus);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'evaluation':
                return <EvaluationScreen onFinish={handleFinishEvaluation} onNavigate={setCurrentPage} />;
            case 'results':
                return <ResultsScreen results={evaluationResults} onRestart={handleStartEvaluation} onNavigate={setCurrentPage} />;
            case 'settings':
                return <SettingsScreen onNavigate={setCurrentPage} />;
            case 'scientific-info':
                return <ScientificInfoScreen onNavigate={setCurrentPage} />;
            case 'home':
            default:
                return <HomeScreen onStart={handleStartEvaluation} onNavigate={setCurrentPage} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 py-6 sm:py-12 flex flex-col items-center justify-center font-inter">
            <div className="container mx-auto px-4 w-full">
                {renderPage()}
            </div>
            <footer className="mt-12 text-center text-sm text-gray-500 px-4">
                <p>&copy; {new Date().getFullYear()} - AlpesVision - Évaluation du Risque de Myopie. Simulation à des fins de démonstration.</p>
                <p>Cet outil ne fournit pas d'avis médical. Consultez toujours un professionnel de la santé qualifié.</p>
            </footer>
        </div>
    );
}

const DefaultApp = () => (
    <ConfigProvider>
        <MainApp />
    </ConfigProvider>
);


ReactDOM.render(
  <DefaultApp />,
  document.getElementById('root')
);