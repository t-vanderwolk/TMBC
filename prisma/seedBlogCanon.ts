/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEFAULT_DESTINATION_URL = 'https://www.taylormadebaby.co';
const SUPPORTED_NETWORKS = new Set(['CJ', 'IMPACT', 'AWIN', 'SHAREASALE', 'MYREGISTRY', 'DIRECT']);

const blogCanon = [
  {
    slug: 'baby-and-pet-safety-guidelines',
    title: 'Baby & Pet Safety Guidelines',
    excerpt: 'A calm, realistic approach to keeping baby and pets safe—without panic, guilt, or impossible rules.',
    authorName: 'Taylor-Made Baby Co. Mentors',
    authorRoleSnapshot: 'MENTOR',
    tags: ['safety', 'transitions', 'routines', 'intro'],
    publishedAt: '2025-09-01T10:00:00.000Z',
    content: [
      {
        type: 'paragraph',
        text: 'A calm, realistic approach to keeping baby and pets safe—without panic, guilt, or impossible rules.',
      },
      { type: 'heading', level: 2, text: 'Intro' },
      {
        type: 'paragraph',
        text: 'Babies and pets can absolutely coexist—and often beautifully.',
      },
      {
        type: 'paragraph',
        text: 'But bringing a baby into a home with pets introduces a layer of responsibility that is new for everyone.',
      },
      {
        type: 'paragraph',
        text: 'Safety here isn’t about fear. It’s about awareness, boundaries, and support.',
      },
      {
        type: 'paragraph',
        text: 'These guidelines are meant to help you prepare calmly, observe confidently, and adjust as your family grows—without turning your home into a rulebook.',
      },
      { type: 'heading', level: 2, text: 'Why This Matters' },
      {
        type: 'paragraph',
        text: 'Pets don’t understand babies. Babies don’t understand pets.',
      },
      {
        type: 'paragraph',
        text: 'What keeps everyone safe is predictability, supervision, and thoughtful setup.',
      },
      {
        type: 'paragraph',
        text: 'Most baby–pet incidents happen because of overstimulation, missed body-language cues, fatigue, and assumptions that “it’ll be fine.”',
      },
      { type: 'paragraph', text: 'The goal isn’t perfection—it’s prevention through structure.' },
      { type: 'heading', level: 2, text: 'Core Safety Principles' },
      {
        type: 'list',
        items: [
          'Supervision is non-negotiable—babies and pets should never interact without an adult present.',
          'Boundaries protect everyone—safe zones help pets retreat and help babies explore without risk.',
          'Behavior beats intention—a “good dog” or “gentle cat” can still react when startled, cornered, or overwhelmed.',
          'Preparation matters more than reaction—set up your home before baby arrives to reduce stress later.',
        ],
      },
      { type: 'heading', level: 2, text: 'Before Baby Arrives' },
      { type: 'heading', level: 3, text: 'Set Up Physical Boundaries' },
      {
        type: 'list',
        items: [
          'Install baby gates early so pets don’t associate them with the baby.',
          'Create pet-only spaces—beds, crates, and quiet rooms where pets can reset.',
          'Establish baby-only zones like the nursery and play areas so the new spaces stay clear.',
        ],
      },
      { type: 'heading', level: 3, text: 'Adjust Routines Gradually' },
      {
        type: 'list',
        items: [
          'Shift feeding, walking, or play schedules in advance so pets already expect new rhythms.',
          'Practice shorter attention windows if you anticipate limited energy after the baby arrives.',
        ],
      },
      { type: 'heading', level: 3, text: 'Introduce Baby Sounds & Smells' },
      {
        type: 'list',
        items: [
          'Play recordings of baby noises at low volume and gradually raise the sound.',
          'Bring home baby-scented items before the hospital return so the house already smells new.',
        ],
      },
      { type: 'heading', level: 2, text: 'The First Weeks Home' },
      { type: 'heading', level: 3, text: 'Introductions Should Be Calm & Controlled' },
      {
        type: 'list',
        items: [
          'One adult handles the baby while one handles the pet to keep both grounded.',
          'Keep interactions brief and positive—think seconds, not minutes.',
          'Allow curiosity without forcing closeness; let pets approach at their own pace.',
        ],
      },
      { type: 'heading', level: 3, text: 'Watch Body Language Closely' },
      {
        type: 'list',
        items: [
          'Turning away or avoiding eye contact.',
          'Lip licking, yawning, or stiff posture.',
          'Growling, hissing, or tail flicking.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Stress signals are communication—not misbehavior.',
      },
      { type: 'heading', level: 2, text: 'Ongoing Daily Safety Habits' },
      { type: 'heading', level: 3, text: 'Always Separate When' },
      {
        type: 'list',
        items: [
          'You leave the room.',
          'Your pet is eating or resting.',
          'Your baby is on the floor exploring.',
        ],
      },
      { type: 'heading', level: 3, text: 'Teach Gentle Interaction Early' },
      {
        type: 'list',
        items: [
          'Model gentle touch.',
          'Redirect grabbing immediately.',
          'Narrate calmly: “We touch softly.”',
        ],
      },
      { type: 'heading', level: 3, text: 'Protect Pet Resources' },
      {
        type: 'list',
        items: [
          'Never allow babies to climb on pets.',
          'Keep hands off tails, ears, or fur.',
          'Keep babies away from food bowls, toys, and litter boxes.',
        ],
      },
      { type: 'heading', level: 2, text: 'Special Notes by Pet Type' },
      { type: 'heading', level: 3, text: 'Dogs' },
      {
        type: 'list',
        items: [
          'Never leave a dog alone with a sleeping baby.',
          'Supervise all floor play.',
          'Use a leash or gate if their energy is high.',
        ],
      },
      { type: 'heading', level: 3, text: 'Cats' },
      {
        type: 'list',
        items: [
          'Keep cats out of sleep spaces.',
          'Secure bassinet and crib areas.',
          'Monitor climbing and jumping behavior.',
        ],
      },
      { type: 'heading', level: 3, text: 'Small Pets (Rabbits, Reptiles, Birds)' },
      {
        type: 'list',
        items: [
          'Keep enclosures baby-proofed.',
          'Supervise all viewing and interactions.',
          'Wash hands after any contact.',
        ],
      },
      { type: 'heading', level: 2, text: 'Mentor Notes' },
      {
        type: 'paragraph',
        text: 'Safety isn’t about assuming the worst—it’s about respecting unpredictability.',
      },
      {
        type: 'paragraph',
        text: 'Pets are family, but they’re still animals. Babies are curious, but they’re still learning control.',
      },
      { type: 'heading', level: 2, text: 'Things No One Tells You (But We Will)' },
      {
        type: 'list',
        items: [
          'Most issues happen during “just a second” moments.',
          'A calm pet still needs boundaries.',
          'A loving home can still have accidents.',
          'Asking for help—trainers, vets, mentors—is a strength.',
        ],
      },
      { type: 'heading', level: 2, text: 'Final Thought' },
      {
        type: 'paragraph',
        text: 'Babies and pets can grow up together safely, lovingly, and joyfully.',
      },
      {
        type: 'paragraph',
        text: 'The foundation isn’t trust alone—it’s structure, supervision, and patience.',
      },
      {
        type: 'paragraph',
        text: 'If you ever feel unsure, overwhelmed, or second-guessing yourself, that’s normal—and it’s why you don’t have to figure this out alone.',
      },
      { type: 'heading', level: 2, text: 'END_CARD' },
      {
        type: 'paragraph',
        text: 'Your mentor is here to help you think through safety—calmly and without judgment.',
      },
    ],
    isAffiliate: false,
  },
  {
    slug: 'bringing-baby-home-with-pets',
    title: 'Bringing Baby Home When You Already Have Pets',
    excerpt: 'How to prepare your home, your pets, and yourself for a calm transition.',
    authorName: 'Taylor-Made Baby Co.',
    authorRoleSnapshot: 'ADMIN',
    tags: ['pets', 'nursery', 'safety'],
    content: [
      { type: 'paragraph', text: 'Bringing a baby home is a big transition for everyone, including the pets who already call your home theirs.' },
      { type: 'heading', level: 2, text: 'Start with scent and sound' },
      { type: 'paragraph', text: 'Introduce baby sounds and scents before the first in-person meeting to reduce surprise and build familiarity.' },
      { type: 'heading', level: 2, text: 'Create clear boundaries' },
      { type: 'paragraph', text: 'Define pet-free zones and baby-free zones so everyone has a safe place to reset.' },
      { type: 'heading', level: 2, text: 'First introductions should be calm and brief' },
      { type: 'paragraph', text: 'Short, supervised meetings help you read body language and set the tone for the weeks ahead.' },
      { type: 'heading', level: 2, text: 'END_CARD' },
      { type: 'paragraph', text: 'Pet-friendly baby safety essentials and calming accessories.' },
      { type: 'paragraph', text: 'Affiliate disclosure: We may earn a small commission at no extra cost to you.' },
    ],
    affiliatePartners: [
      { partnerName: 'Albee Baby', network: 'CJ' },
      { partnerName: 'MacroBaby', network: 'DIRECT' },
    ],
    affiliateCTAs: [
      'Browse nursery safety essentials',
      'Shop pet-safe baby gates and room dividers',
    ],
  },
  {
    slug: 'newborn-sleep-foundations',
    title: 'Newborn Sleep Foundations: A Gentle Start',
    excerpt: 'A calm, practical approach to sleep that supports newborn rhythms and parental rest.',
    authorName: 'Taylor-Made Baby Co. Mentors',
    authorRoleSnapshot: 'MENTOR',
    tags: ['sleep', 'newborn', 'routine'],
    content: [
      { type: 'paragraph', text: 'Sleep in the early weeks is unpredictable, but small cues can build a steady rhythm.' },
      { type: 'heading', level: 2, text: 'Follow the wake window, not the clock' },
      { type: 'paragraph', text: 'Newborns tire quickly. A short awake period often keeps fussiness low.' },
      { type: 'heading', level: 2, text: 'Daylight and darkness matter' },
      { type: 'paragraph', text: 'Morning light and dim evenings help the body sort day from night.' },
      { type: 'heading', level: 2, text: 'Soothing is a skill, not a personality' },
      { type: 'paragraph', text: 'Gentle movement, a consistent sound, and a calm cue can become reliable anchors.' },
      { type: 'heading', level: 2, text: 'END_CARD' },
      { type: 'paragraph', text: 'Sleep-safe basics and calming tools families lean on.' },
      { type: 'paragraph', text: 'Affiliate disclosure: We may earn a small commission at no extra cost to you.' },
    ],
    affiliatePartners: [
      { partnerName: 'Nuna', network: 'IMPACT' },
      { partnerName: 'Babylist', network: 'DIRECT' },
    ],
    affiliateCTAs: [
      'Explore sleep-safe bassinet options',
      'Find white-noise and swaddle essentials',
    ],
  },
  {
    slug: 'building-a-calm-feeding-station',
    title: 'Building a Calm Feeding Station',
    excerpt: 'Simple, supportive setup ideas to make feeding feel steady in the early months.',
    authorName: 'Taylor-Made Baby Co. Mentors',
    authorRoleSnapshot: 'MENTOR',
    tags: ['feeding', 'postpartum', 'nursery'],
    content: [
      { type: 'paragraph', text: 'A feeding station is less about equipment and more about comfort and access.' },
      { type: 'heading', level: 2, text: 'Start with posture support' },
      { type: 'paragraph', text: 'Pillows, arm support, and foot placement reduce strain over long sessions.' },
      { type: 'heading', level: 2, text: 'Keep essentials within arm reach' },
      { type: 'paragraph', text: 'Water, snacks, a burp cloth, and an extra onesie can save a midnight trek.' },
      { type: 'heading', level: 2, text: 'Create a low-light mood' },
      { type: 'paragraph', text: 'Soft, warm light keeps baby sleepy while protecting your eyes.' },
      { type: 'heading', level: 2, text: 'END_CARD' },
      { type: 'paragraph', text: 'Feeding comfort essentials and storage solutions.' },
      { type: 'paragraph', text: 'Affiliate disclosure: We may earn a small commission at no extra cost to you.' },
    ],
    affiliatePartners: [
      { partnerName: 'Target', network: 'IMPACT' },
    ],
    affiliateCTAs: [
      'Shop feeding pillows and lighting essentials',
    ],
  },
  {
    slug: 'car-seat-checklist-for-first-ride',
    title: 'Car Seat Checklist for the First Ride Home',
    excerpt: 'A clear, step-by-step list to make sure the first drive is safe and calm.',
    authorName: 'Taylor-Made Baby Co. Mentors',
    authorRoleSnapshot: 'MENTOR',
    tags: ['safety', 'car-seat', 'checklist'],
    content: [
      { type: 'paragraph', text: 'Your first ride home is a milestone. A short checklist can keep it stress-free.' },
      { type: 'heading', level: 2, text: 'Install early and verify' },
      { type: 'paragraph', text: 'Install the seat ahead of time and check for tightness at the belt path.' },
      { type: 'heading', level: 2, text: 'Harness fit basics' },
      { type: 'paragraph', text: 'Straps should pass the pinch test and sit at or below the shoulder for rear-facing.' },
      { type: 'heading', level: 2, text: 'Plan for weather' },
      { type: 'paragraph', text: 'Use thin layers and a blanket over the harness instead of bulky coats.' },
      { type: 'heading', level: 2, text: 'END_CARD' },
      { type: 'paragraph', text: 'Seat covers, mirrors, and travel-ready extras.' },
      { type: 'paragraph', text: 'Affiliate disclosure: We may earn a small commission at no extra cost to you.' },
    ],
    affiliatePartners: [
      { partnerName: 'Nordstrom', network: 'IMPACT' },
    ],
    affiliateCTAs: [
      'Explore travel accessories for safer rides',
    ],
  },
  {
    slug: 'registry-priorities-for-small-spaces',
    title: 'Registry Priorities for Small Spaces',
    excerpt: 'How to choose flexible gear that fits apartments, shared rooms, and tight footprints.',
    authorName: 'Taylor-Made Baby Co.',
    authorRoleSnapshot: 'ADMIN',
    tags: ['registry', 'small-space', 'gear'],
    content: [
      { type: 'paragraph', text: 'Small spaces can be beautifully functional when you prioritize flexible gear.' },
      { type: 'heading', level: 2, text: 'Choose multi-use items' },
      { type: 'paragraph', text: 'Look for pieces that grow with baby and do more than one job.' },
      { type: 'heading', level: 2, text: 'Fold and store with intention' },
      { type: 'paragraph', text: 'Stackable bins, vertical storage, and compact folds reduce clutter quickly.' },
      { type: 'heading', level: 2, text: 'Leave room for daily flow' },
      { type: 'paragraph', text: 'Think about path of travel and where you will actually use each item.' },
      { type: 'heading', level: 2, text: 'END_CARD' },
      { type: 'paragraph', text: 'Compact registry staples and space-saving favorites.' },
      { type: 'paragraph', text: 'Affiliate disclosure: We may earn a small commission at no extra cost to you.' },
    ],
    affiliatePartners: [
      { partnerName: 'Crate and Kids', network: 'CJ' },
      { partnerName: 'Amazon', network: 'AMAZON' },
    ],
    affiliateCTAs: [
      'Shop compact nursery furniture',
      'Browse small-space organizers',
    ],
  },
  {
    slug: 'postpartum-recovery-at-home',
    title: 'Postpartum Recovery at Home: A Gentle Plan',
    excerpt: 'A compassionate approach to healing, rest, and support in the early weeks.',
    authorName: 'Taylor-Made Baby Co. Mentors',
    authorRoleSnapshot: 'MENTOR',
    tags: ['postpartum', 'healing', 'support'],
    content: [
      { type: 'paragraph', text: 'Recovery is not a race. Small supports can make the early weeks softer.' },
      { type: 'heading', level: 2, text: 'Prepare a rest-first routine' },
      { type: 'paragraph', text: 'Plan for naps, easy meals, and a small circle of help.' },
      { type: 'heading', level: 2, text: 'Build a comfort kit' },
      { type: 'paragraph', text: 'Cooling pads, gentle hygiene, and soft clothing can reduce friction.' },
      { type: 'heading', level: 2, text: 'Normalize asking for help' },
      { type: 'paragraph', text: 'Let trusted people support you with meals, laundry, and errands.' },
      { type: 'heading', level: 2, text: 'END_CARD' },
      { type: 'paragraph', text: 'Recovery and comfort essentials curated for calm.' },
      { type: 'paragraph', text: 'Affiliate disclosure: We may earn a small commission at no extra cost to you.' },
    ],
    affiliatePartners: [
      { partnerName: 'Target', network: 'IMPACT' },
    ],
    affiliateCTAs: [
      'Shop postpartum comfort essentials',
    ],
  },
  {
    slug: 'diapering-station-that-actually-works',
    title: 'A Diapering Station That Actually Works',
    excerpt: 'Design a setup that keeps changes calm, fast, and mess-friendly.',
    authorName: 'Taylor-Made Baby Co.',
    authorRoleSnapshot: 'ADMIN',
    tags: ['diapering', 'nursery', 'organization'],
    content: [
      { type: 'paragraph', text: 'The best diapering stations reduce steps and keep supplies in one place.' },
      { type: 'heading', level: 2, text: 'Create a three-zone layout' },
      { type: 'paragraph', text: 'Clean diapers, cleanup supplies, and disposal should each have a clear home.' },
      { type: 'heading', level: 2, text: 'Stock for the night shift' },
      { type: 'paragraph', text: 'A small bin with refills prevents late-night runs to the closet.' },
      { type: 'heading', level: 2, text: 'Plan for growth' },
      { type: 'paragraph', text: 'Space for larger sizes and extra wipes keeps the station useful longer.' },
      { type: 'heading', level: 2, text: 'END_CARD' },
      { type: 'paragraph', text: 'Diapering essentials and storage upgrades.' },
      { type: 'paragraph', text: 'Affiliate disclosure: We may earn a small commission at no extra cost to you.' },
    ],
    affiliatePartners: [
      { partnerName: 'Amazon', network: 'AMAZON' },
      { partnerName: 'Babylist', network: 'DIRECT' },
    ],
    affiliateCTAs: [
      'Shop diapering station must-haves',
      'Find refill organizers and caddies',
    ],
  },
  {
    slug: 'first-month-mentor-checklist',
    title: 'A Mentor Checklist for the First Month',
    excerpt: 'A supportive, realistic checklist that keeps the first month focused and steady.',
    authorName: 'Taylor-Made Baby Co. Mentors',
    authorRoleSnapshot: 'MENTOR',
    tags: ['newborn', 'support', 'checklist'],
    content: [
      { type: 'paragraph', text: 'The first month is about meeting needs, not perfection. A short checklist can keep priorities clear.' },
      { type: 'heading', level: 2, text: 'Daily anchors' },
      { type: 'paragraph', text: 'Aim for feeding, sleep, and a brief fresh-air moment when possible.' },
      { type: 'heading', level: 2, text: 'Weekly check-ins' },
      { type: 'paragraph', text: 'Track growth, rest, and emotional well-being for both parent and baby.' },
      { type: 'heading', level: 2, text: 'Connection over completion' },
      { type: 'paragraph', text: 'Prioritize bonding and comfort over a perfect schedule.' },
      { type: 'heading', level: 2, text: 'END_CARD' },
      { type: 'paragraph', text: 'Notebook tools and gentle planning aids.' },
      { type: 'paragraph', text: 'Affiliate disclosure: We may earn a small commission at no extra cost to you.' },
    ],
    affiliatePartners: [
      { partnerName: 'Paper Source', network: 'DIRECT' },
    ],
    affiliateCTAs: [
      'Browse journals and planning essentials',
    ],
  },
  {
    slug: 'sibling-prep-and-big-feelings',
    title: 'Sibling Prep and Big Feelings',
    excerpt: 'Helping older siblings feel secure, seen, and involved before baby arrives.',
    authorName: 'Taylor-Made Baby Co. Mentors',
    authorRoleSnapshot: 'MENTOR',
    tags: ['siblings', 'family', 'transition'],
    content: [
      { type: 'paragraph', text: 'Big feelings are normal. Preparation can help siblings feel included and safe.' },
      { type: 'heading', level: 2, text: 'Tell the story early' },
      { type: 'paragraph', text: 'Simple conversations and books help children build a clear picture.' },
      { type: 'heading', level: 2, text: 'Give them a role' },
      { type: 'paragraph', text: 'Small tasks like choosing a blanket or helping with a song build connection.' },
      { type: 'heading', level: 2, text: 'Protect one-on-one time' },
      { type: 'paragraph', text: 'Short, consistent moments together reduce rivalry and reassure your child.' },
      { type: 'heading', level: 2, text: 'END_CARD' },
      { type: 'paragraph', text: 'Sibling prep tools and storytime picks.' },
      { type: 'paragraph', text: 'Affiliate disclosure: We may earn a small commission at no extra cost to you.' },
    ],
    affiliatePartners: [
      { partnerName: 'Barnes and Noble', network: 'CJ' },
    ],
    affiliateCTAs: [
      'Browse sibling storytime favorites',
    ],
  },
  {
    slug: 'hospital-bag-essentials',
    title: 'Hospital Bag Essentials: What You Actually Need',
    excerpt: 'A focused list that covers comfort, recovery, and the first 24 hours with baby.',
    authorName: 'Taylor-Made Baby Co.',
    authorRoleSnapshot: 'ADMIN',
    tags: ['birth', 'hospital-bag', 'checklist'],
    content: [
      { type: 'paragraph', text: 'A hospital bag should feel like support, not a move. Focus on comfort and function.' },
      { type: 'heading', level: 2, text: 'Comfort for labor and rest' },
      { type: 'paragraph', text: 'Soft layers, lip balm, and a phone charger are the quiet heroes.' },
      { type: 'heading', level: 2, text: 'Postpartum basics' },
      { type: 'paragraph', text: 'Bring a simple change of clothes and gentle toiletries for the first shower.' },
      { type: 'heading', level: 2, text: 'Baby basics' },
      { type: 'paragraph', text: 'A going-home outfit and a swaddle are often enough.' },
      { type: 'heading', level: 2, text: 'END_CARD' },
      { type: 'paragraph', text: 'Hospital bag staples and comfort upgrades.' },
      { type: 'paragraph', text: 'Affiliate disclosure: We may earn a small commission at no extra cost to you.' },
    ],
    affiliatePartners: [
      { partnerName: 'Target', network: 'IMPACT' },
      { partnerName: 'Amazon', network: 'AMAZON' },
    ],
    affiliateCTAs: [
      'Shop hospital bag basics',
      'Find travel-size toiletries and chargers',
    ],
  },
  {
    slug: 'gentle-registry-audit',
    title: 'A Gentle Registry Audit Before Baby Arrives',
    excerpt: 'A calm review process to make sure your registry matches your real life.',
    authorName: 'Taylor-Made Baby Co. Mentors',
    authorRoleSnapshot: 'MENTOR',
    tags: ['registry', 'planning', 'checklist'],
    content: [
      { type: 'paragraph', text: 'A final registry review can remove stress and keep your list aligned with daily needs.' },
      { type: 'heading', level: 2, text: 'Check for duplicates and overlaps' },
      { type: 'paragraph', text: 'Remove items that solve the same problem and keep the most versatile option.' },
      { type: 'heading', level: 2, text: 'Confirm season and size timing' },
      { type: 'paragraph', text: 'Make sure sizes match the season your baby will reach them.' },
      { type: 'heading', level: 2, text: 'Prioritize safety and daily use' },
      { type: 'paragraph', text: 'Focus on items you will use every day over occasional extras.' },
      { type: 'heading', level: 2, text: 'END_CARD' },
      { type: 'paragraph', text: 'Registry refresh tools and organizational helpers.' },
      { type: 'paragraph', text: 'Affiliate disclosure: We may earn a small commission at no extra cost to you.' },
    ],
    affiliatePartners: [
      { partnerName: 'Babylist', network: 'DIRECT' },
    ],
    affiliateCTAs: [
      'Browse registry organization essentials',
    ],
  },
];

type AffiliatePartner = {
  partnerName: string;
  network: string;
};

type AffiliatePost = {
  slug: string;
  affiliatePartners?: AffiliatePartner[];
  affiliateCTAs?: string[];
};

type AffiliateLink = {
  partnerName: string;
  network: string;
  label: string;
  position: string;
  destinationUrl: string;
  isPrimary: boolean;
};

const buildAffiliateLinks = (post: AffiliatePost) => {
  const partners = post.affiliatePartners || [];
  const ctas = post.affiliateCTAs || [];
  const links: AffiliateLink[] = [];

  if (partners.length !== ctas.length) {
    console.warn(
      `[warn] affiliate mapping mismatch for ${post.slug}: partners=${partners.length} ctas=${ctas.length}`,
    );
  }

  partners.forEach((partner, index) => {
    const label = ctas[index];
    if (!label) {
      console.warn(`[warn] missing CTA label for ${post.slug} partner ${partner.partnerName}`);
      return;
    }

    let network = partner.network;
    if (!SUPPORTED_NETWORKS.has(network)) {
      console.warn(
        `[warn] unsupported affiliate network "${network}" for ${post.slug} partner ${partner.partnerName}, defaulting to DIRECT`,
      );
      network = 'DIRECT';
    }

    links.push({
      partnerName: partner.partnerName,
      network,
      label,
      position: 'END_CARD',
      destinationUrl: DEFAULT_DESTINATION_URL,
      isPrimary: index === 0,
    });
  });

  if (!links.length) {
    console.warn(`[warn] no affiliate links prepared for ${post.slug}`);
  }

  return links;
};

const seed = async () => {
  let createdPosts = 0;
  let skippedPosts = 0;
  let createdLinks = 0;

  type SeedAuthor = {
    id: string;
    role: 'ADMIN' | 'MENTOR';
  };

  const seedAuthors = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'MENTOR'] } },
    select: { id: true, role: true },
  }) as SeedAuthor[];

  const fallbackAdminAuthorId = seedAuthors.find((user) => user.role === 'ADMIN')?.id ?? null;
  const fallbackMentorAuthorId = seedAuthors.find((user) => user.role === 'MENTOR')?.id ?? null;

  if (!fallbackAdminAuthorId && !fallbackMentorAuthorId) {
    throw new Error('seedBlogCanon requires at least one ADMIN or MENTOR user to assign blog authors.');
  }

  for (const post of blogCanon) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (existing) {
      skippedPosts += 1;
      console.log(`[skip] ${post.slug} exists`);
      continue;
    }

    const authorId =
      post.authorRoleSnapshot === 'MENTOR'
        ? fallbackMentorAuthorId ?? fallbackAdminAuthorId
        : fallbackAdminAuthorId ?? fallbackMentorAuthorId;

    if (!authorId) {
      throw new Error(`Unable to resolve authorId for ${post.slug}`);
    }

    const created = await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        heroImage: null,
        status: 'PUBLISHED',
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        authorId,
        authorName: post.authorName,
        authorRoleSnapshot: post.authorRoleSnapshot,
        tags: post.tags,
        isAffiliate: post.isAffiliate ?? true,
      },
      select: { id: true },
    });

    createdPosts += 1;
    console.log(`[create] blog post ${post.slug}`);

    const affiliateLinks = buildAffiliateLinks(post);
    if (affiliateLinks.length) {
      const result = await prisma.blogAffiliateLink.createMany({
        data: affiliateLinks.map((link) => ({
          blogPostId: created.id,
          partnerName: link.partnerName,
          network: link.network,
          label: link.label,
          position: link.position,
          destinationUrl: link.destinationUrl,
          isPrimary: link.isPrimary,
        })),
      });

      createdLinks += result.count;
      console.log(`[create] ${result.count} affiliate links for ${post.slug}`);
    }
  }

  console.log(`[done] posts created: ${createdPosts}`);
  console.log(`[done] posts skipped: ${skippedPosts}`);
  console.log(`[done] affiliate links created: ${createdLinks}`);
};

seed()
  .catch((error) => {
    console.error('[error] seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
