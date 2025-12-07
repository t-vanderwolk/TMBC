"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecommendations = generateRecommendations;
const baseStrollers = [
    'UPPAbaby Vista',
    'Cybex Gazelle S',
    'Nuna TRVL',
    'Babyzen YOYO²',
    'Silver Cross Reef',
    'UPPAbaby Cruz V2',
    'Bugaboo Fox 5',
    'Libelle Compact',
];
const baseCarSeats = ['Nuna Pipa', 'Cybex Cloud Z', 'UPPAbaby MESA', 'Chicco KeyFit 30'];
const baseNursery = [
    'Convertible crib + organic mattress',
    'Smart bassinet with breathable liner',
    'Soft storage baskets',
    'Breathable sleep sacks',
];
const baseTravel = ['Car seat travel bag', 'Portable playard', 'Lightweight travel bassinet'];
const uniqueArray = (items) => Array.from(new Set(items));
function generateRecommendations(answers) {
    let strollers = [...baseStrollers];
    let carSeats = [...baseCarSeats];
    let nursery = [...baseNursery];
    let travel = [...baseTravel];
    const terrainValues = answers.terrain ?? [];
    const terrainNeedsRough = terrainValues.some((option) => /rough|uneven|gravel/i.test(option));
    if (terrainNeedsRough) {
        strollers = strollers.concat(['Bugaboo Fox 5', 'UPPAbaby Vista', 'Silver Cross Reef']);
    }
    const lightweightHandlers = new Set(['petite', 'grandparent', 'nanny']);
    if (answers.primaryHandler && lightweightHandlers.has(answers.primaryHandler)) {
        strollers = strollers.concat(['Nuna TRVL', 'Babyzen YOYO²', 'Libelle Compact']);
    }
    const stairsSensitive = answers.stairs === 'yes' || answers.stairs === true || answers.stairs === 'true';
    if (stairsSensitive) {
        nursery.push('Lightweight rolling bassinet');
    }
    const vehicleType = answers.vehicleType;
    if (vehicleType === 'small_sedan' || vehicleType === 'sedan') {
        strollers = strollers.filter((stroller) => stroller !== 'UPPAbaby Vista' && stroller !== 'Silver Cross Reef');
        strollers = strollers.concat(['UPPAbaby Cruz V2', 'Nuna TRVL']);
    }
    const travelFreq = Number(answers.travelFrequency ?? 0);
    if (!Number.isNaN(travelFreq) && travelFreq >= 2) {
        travel = travel.concat(['Babyzen YOYO² Travel Edition', 'Car seat travel bag', 'Doona Car Seat Stroller']);
        carSeats = carSeats.concat(['Car seat travel bag', 'Doona Car Seat']);
    }
    if (terrainNeedsRough && vehicleType === 'minivan') {
        travel.push('Cargo-ready travel organizer');
    }
    return {
        strollers: uniqueArray(strollers),
        carSeats: uniqueArray(carSeats),
        nursery: uniqueArray(nursery),
        travel: uniqueArray(travel),
    };
}
