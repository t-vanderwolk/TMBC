"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModuleRecommendedProductsList = exports.getModuleRecommendations = exports.getModuleProducts = exports.getRecommendedModule = exports.getAcademyModules = exports.getAcademyTracks = exports.getAcademyJourneys = void 0;
const product_service_1 = require("./product.service");
const journeys = [
    { id: 'nursery', title: 'Nursery Journey', description: 'Design serene spaces with concierge-level detail.' },
    { id: 'gear', title: 'Gear Journey', description: 'Master mobility, feeding, and travel essentials.' },
    { id: 'postpartum', title: 'Postpartum Journey', description: 'Support healing, nourishment, and adjustment.' },
];
const tracks = [
    { id: 'nursery-foundations', journeyId: 'nursery', title: 'Vision & Foundations', summary: 'Mood boards, layouts, and rituals.' },
    { id: 'gear-mobility', journeyId: 'gear', title: 'Mobility & Bonding', summary: 'Strollers, carriers, and adventures.' },
    { id: 'postpartum-healing', journeyId: 'postpartum', title: 'Healing & Wellness', summary: 'Rest, nourishment, and mindset.' },
];
const modules = [
    {
        id: 'car-seat-masterclass',
        trackId: 'gear-mobility',
        title: 'Car Seat Masterclass',
        estTime: '35 min',
        status: 'in_progress',
        categories: ['infant-car-seat', 'convertible-car-seat', 'travel-car-seat'],
        recommendedProducts: ['nuna-pipa-rx', 'uppababy-mesa-max', 'cybex-cloud-g'],
        stage: '0-12 months',
        mentorNotes: 'Focus on compatibility with your stroller chassis + base installation.',
    },
    {
        id: 'safe-sleep-nursery',
        trackId: 'nursery-foundations',
        title: 'Safe Sleep & Nursery Setup',
        estTime: '28 min',
        status: 'not_started',
        categories: ['bedside-sleeper', 'sound-machine', 'swaddle', 'lounger'],
        recommendedProducts: ['hatch-rest-plus', 'snuggle-me-organic'],
        stage: '3rd trimester prep',
        mentorNotes: 'Layer soothing cues + dimmable lighting for easy overnight feeds.',
    },
    {
        id: 'feeding-essentials',
        trackId: 'postpartum-healing',
        title: 'Feeding Essentials Intensive',
        estTime: '30 min',
        status: 'not_started',
        categories: ['pumping', 'bottle', 'feeding-accessory'],
        recommendedProducts: ['elvie-stride'],
        stage: '0-6 months',
        mentorNotes: 'Keep a pumping cart near your nightstand for easier overnight sessions.',
    },
    {
        id: 'travel-system-lab',
        trackId: 'gear-mobility',
        title: 'Travel System Lab',
        estTime: '32 min',
        status: 'complete',
        categories: ['stroller', 'travel-car-seat'],
        recommendedProducts: ['nuna-pipa-rx'],
        stage: 'Weeks 20-32',
        mentorNotes: 'Compare fold + trunk fit before making the final call.',
    },
    {
        id: 'essentials-refresh',
        trackId: 'postpartum-healing',
        title: 'Fourth Trimester Essentials',
        estTime: '22 min',
        status: 'complete',
        categories: ['essentials', 'lounger'],
        recommendedProducts: ['snuggle-me-organic'],
        stage: 'Weeks 30-40',
        mentorNotes: 'Stock duplicate kits for primary + backup changing zones.',
    },
];
const getAcademyJourneys = async () => {
    // TODO: Replace with Prisma queries once academy tables are ready
    return journeys;
};
exports.getAcademyJourneys = getAcademyJourneys;
const getAcademyTracks = async () => {
    // TODO: Replace with Prisma track data and relationships
    return tracks;
};
exports.getAcademyTracks = getAcademyTracks;
const getAcademyModules = async () => {
    const hydrated = await Promise.all(modules.map(async (module) => {
        const recommended = await (0, product_service_1.getProductsByIds)(module.recommendedProducts);
        return {
            ...module,
            recommendedProducts: recommended,
        };
    }));
    return hydrated;
};
exports.getAcademyModules = getAcademyModules;
const getRecommendedModule = async () => {
    const [first] = await (0, exports.getAcademyModules)();
    return first;
};
exports.getRecommendedModule = getRecommendedModule;
const findModule = (moduleCode) => {
    const normalizedCode = moduleCode.toLowerCase();
    return modules.find((module) => module.id === normalizedCode);
};
const getModuleProducts = async (moduleCode) => {
    const module = findModule(moduleCode);
    if (!module) {
        throw new Error(`Module ${moduleCode} not found`);
    }
    const products = await (0, product_service_1.getProductsByModuleCode)(module.id);
    return {
        module,
        products,
    };
};
exports.getModuleProducts = getModuleProducts;
const dedupeProducts = (products) => {
    const seen = new Set();
    const ordered = [];
    for (const product of products) {
        if (seen.has(product.id))
            continue;
        seen.add(product.id);
        ordered.push(product);
    }
    return ordered;
};
const getModuleRecommendations = async (moduleCode) => {
    const module = findModule(moduleCode);
    if (!module) {
        throw new Error(`Module ${moduleCode} not found`);
    }
    const curated = await (0, product_service_1.getProductsByIds)(module.recommendedProducts);
    const categoryProducts = await (0, product_service_1.getProductsByCategories)(module.categories);
    const combined = dedupeProducts([...curated, ...categoryProducts]);
    const categoryGroups = module.categories.map((category) => ({
        category,
        products: categoryProducts.filter((product) => product.category === category),
    }));
    return {
        module,
        products: combined,
        categoryGroups,
    };
};
exports.getModuleRecommendations = getModuleRecommendations;
const getModuleRecommendedProductsList = async (moduleCode) => {
    const module = findModule(moduleCode);
    if (!module) {
        throw new Error(`Module ${moduleCode} not found`);
    }
    return (0, product_service_1.getProductsByIds)(module.recommendedProducts);
};
exports.getModuleRecommendedProductsList = getModuleRecommendedProductsList;
