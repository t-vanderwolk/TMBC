const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const academyModules = [
  {
    id: "nursery-vision-lifestyle-foundations",
    slug: "nursery-vision-lifestyle-foundations",
    journey: "nursery",
    title: "Vision & Lifestyle Foundations",
    subtitle: "Anchor the room around how you live, rest, and celebrate.",
    description:
      "Translate emotions, rituals, and daily rhythm into a centered nursery plan so every decision feels grounded.",
    content: {
      lecture:
        "Before the gear, before the decor, before the registry - there's vision. This module is about slowing down and imagining how you want your home to feel when your baby arrives. Not Pinterest-perfect. Not influencer-polished. Just real life - softened, supported, and intentional. We'll talk about how your daily rhythm, your space, and your values intersect. Whether you're in a studio apartment or a five-bedroom house, the goal is the same: create a foundation that supports calm, function, and connection. There's no \\\"right\\\" aesthetic here. There is a right fit for you - and this is where we begin discovering it.",
      metadata: { category: "nursery", order: 1, estimatedTime: 40, isPublished: true },
      objectives: [
        "Frame your emotional goals for the nursery before selecting fixtures.",
        "Surface how midnight feeds, work, and community visits flow through the space.",
        "Balance practicality and design so the room feels calm yet functional from day one.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "What sensations signal home to you? How do your routines—late-night feeds, work calls, guests—slide through this room? Capture two or three rituals you want to protect and describe how they would feel in the space.",
        },
        {
          title: "Apply",
          content:
            "Compile inspiration (fabric swatches, lighting ideas, rituals) into a simple mood board, map where those rituals live, and share it with your partner or mentor for early alignment.",
        },
        {
          title: "Integrate",
          content:
            "Set a weekly check-in with yourself or a partner to note how the room is landing and adjust the mood board so the nursery stays tuned to your evolving rhythm.",
        },
      ],
    },
  },
  {
    id: "nursery-space-planning-room-flow",
    slug: "nursery-space-planning-room-flow",
    journey: "nursery",
    title: "Space Planning & Room Flow",
    subtitle: "Design the layout, not just the pieces.",
    description:
      "Translate your vision into zones, walkways, and storage that keep the nursery quiet even during busy hours.",
    content: {
      lecture:
        "Furniture choices shape how you move, rest, and care for your baby - often more than we realize. In this module, we focus on the pieces that truly matter: where baby sleeps, where you sit, and how you move through the room at 2 a.m. We'll walk through layout logic that prioritizes safety, ease, and comfort - not showroom styling. You'll learn how to think in zones instead of square footage, and how to choose pieces that grow with your family instead of boxing you into one phase. This is about building a room that works with you, even on the hardest days.",
      metadata: { category: "nursery", order: 2, estimatedTime: 35, isPublished: true },
      objectives: [
        "Sketch the pathways that keep parents and baby moving with ease.",
        "Define dedicated zones for sleep, diapering, and slow play.",
        "Layer storage and surfaces so nothing interrupts the calm flow.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "Walk through the nursery in your mind: from door to crib, from crib to changing table, and to storage. Where might you bump into furniture? Where does light and air move? Capture what you notice.",
        },
        {
          title: "Apply",
          content:
            "Use tape or a paper plan to block out furniture footprints, adjust as needed, and annotate where baskets, shelving, and textiles will live so every habit has a home.",
        },
        {
          title: "Integrate",
          content:
            "After living with the layout for a few nights, note any pinch points and schedule a quick review to tweak paths or storage so the flow still feels effortless.",
        },
      ],
    },
  },
  {
    id: "nursery-sleep-safety-environment",
    slug: "nursery-sleep-safety-environment",
    journey: "nursery",
    title: "Sleep Safety & Environment",
    subtitle: "Craft cues that whisper rest.",
    description:
      "Build a safe, soothing sleep zone that honors guidelines while feeling deeply personal.",
    content: {
      lecture:
        "Atmosphere isn't about decoration - it's about nervous system support. In this module, we explore how light, sound, airflow, and color quietly influence sleep, mood, and regulation - for both you and your baby. We'll also layer in safety essentials without fear-based overwhelm. You'll learn how to balance coziness with clarity, softness with function, and beauty with peace of mind. A calm room doesn't happen by accident. It's designed - gently and intentionally.",
      metadata: { category: "nursery", order: 3, estimatedTime: 38, isPublished: true },
      objectives: [
        "Understand safe-sleep positioning, surface, and temperature basics.",
        "Introduce light, sound, and scent cues that support day-night routines.",
        "Plan the sensory experience so rest feels familiar from night one.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "Which sensations signal nighttime for you—warm light, certain sounds, cooling air? How can you translate those cues into the room so baby learns the rhythm without extra effort?",
        },
        {
          title: "Apply",
          content:
            "Complete a safety checklist: position the crib away from cords, install a dimmable lamp, test white-noise levels, and secure monitors or sensors to match your comfort.",
        },
        {
          title: "Integrate",
          content:
            "Craft a simple evening ritual—lighting, texture, and sound cues—that you repeat nightly, then revisit after the first few weeks to tune what actually supports rest.",
        },
      ],
    },
  },
  {
    id: "nursery-furniture-essentials-layout",
    slug: "nursery-furniture-essentials-layout",
    journey: "nursery",
    title: "Furniture Essentials & Layout",
    subtitle: "Choose pieces that grow with you.",
    description:
      "Curate furniture that keeps caregivers comfortable, stays safe, and adapts as baby changes.",
    content: {
      lecture:
        "This is where personality lives. Once the foundation is set, details bring warmth and identity into the space. In this module, we talk about art, textiles, personalization, and keepsakes - without turning your nursery into a cluttered time capsule. We focus on meaningful choices over trends, and how to edit with intention so your space feels layered but never chaotic. Think: timeless, thoughtful, and flexible enough to grow alongside your child.",
      metadata: { category: "nursery", order: 4, estimatedTime: 42, isPublished: true },
      objectives: [
        "Select core pieces that keep ergonomics at the forefront.",
        "Design a layout where every seat, table, and surface feels intentional.",
        "Plan for transitions so the investment matches multiple stages.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "What furniture feels like home? What needs to be replaced? Consider your posture during feeds, the reach required for supplies, and how each item makes you feel at the end of a long day.",
        },
        {
          title: "Apply",
          content:
            "Measure each piece, sketch its placement, and confirm you have clear paths between the crib, door, and seating. Label the zones for storage, diapering, and calming so the flow becomes intuitive.",
        },
        {
          title: "Integrate",
          content:
            "Imagine the room a year from now: which pieces will still serve you? Schedule quarterly check-ins to reassess that the furniture and flow still match the life you are building.",
        },
      ],
    },
  },
  {
    id: "nursery-calm-comfort-atmosphere",
    slug: "nursery-calm-comfort-atmosphere",
    journey: "nursery",
    title: "Calm, Comfort & Atmosphere",
    subtitle: "Let your senses finish the story.",
    description:
      "Dial in texture, light, and sound so the nursery feels like a true sanctuary.",
    content: {
      lecture:
        "This module is about the final exhale. We'll walk through the last practical steps that turn a nursery from almost ready into ready enough. Laundry flow, storage logic, restocking habits, and mental checklists - all designed to reduce decision fatigue once baby arrives. You don't need perfection. You need readiness, reassurance, and room to adapt. This is about closing the loop - and trusting yourself.",
      metadata: { category: "nursery", order: 5, estimatedTime: 32, isPublished: true },
      objectives: [
        "Layer tactile, auditory, and visual elements that soothe the whole family.",
        "Balance color, texture, and scent so the room feels intentional yet effortless.",
        "Plan subtle cues that signal day versus night without extra effort.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "What color, smell, or feeling immediately puts you at ease? How can you bring that energy into the nursery without overwhelming the senses? Write down the three sensations that matter most.",
        },
        {
          title: "Apply",
          content:
            "Build a tactile palette board, select a lighting plan with at least three settings, and pick a simple sound ritual. Keep comforting textiles close to the glider and a small tray for nighttime essentials, keeping the vibe ritualized and calm.",
        },
        {
          title: "Integrate",
          content:
            "Notice how the room lands after the first few weeks, and rotate textures, scents, or lighting so the atmosphere continues to feel like the sanctuary you need.",
        },
      ],
    },
  },
  {
    id: "gear-gear-that-supports-your-body",
    slug: "gear-gear-that-supports-your-body",
    journey: "gear",
    title: "Gear That Supports Your Body",
    subtitle: "Comfort and recovery.",
    description:
      "Choose gear that eases tension and protects your body during feeding, carrying, and soothing.",
    content: {
      lecture:
        "Baby gear should support parents just as much as babies. This module focuses on ergonomics, posture, and physical recovery during feeding, carrying, and soothing.",
      metadata: { category: "gear", order: 6, estimatedTime: 30, isPublished: true },
      objectives: [
        "Reduce strain through gear choices",
        "Match gear to physical needs",
        "Support postpartum recovery",
      ],
      sections: [
        {
          title: "Reflect",
          content: "Where does your body tend to hold tension during daily care routines?",
        },
        {
          title: "Apply",
          content: "Evaluate one gear item for comfort, alignment, and ease of use.",
        },
        {
          title: "Integrate",
          content: "Create a short body check-in routine to use while caring for your baby.",
        },
      ],
    },
  },
  {
    id: "gear-gear-for-small-spaces",
    slug: "gear-gear-for-small-spaces",
    journey: "gear",
    title: "Gear for Small Spaces",
    subtitle: "Function in tight quarters.",
    description:
      "Select compact, foldable, and multi-use gear that keeps clutter down in smaller homes.",
    content: {
      lecture:
        "Limited space doesn’t mean limited function. This module explores compact, foldable, and multi-use gear strategies that preserve calm in smaller homes.",
      metadata: { category: "gear", order: 7, estimatedTime: 30, isPublished: true },
      objectives: [
        "Identify space-efficient gear",
        "Avoid unnecessary accumulation",
        "Prioritize flexibility",
      ],
      sections: [
        {
          title: "Reflect",
          content: "Where does clutter create the most stress in your home?",
        },
        {
          title: "Apply",
          content: "Remove or replace one bulky item that no longer serves you well.",
        },
        {
          title: "Integrate",
          content: "Describe your ideal minimal-but-prepared setup.",
        },
      ],
    },
  },
  {
    id: "gear-travel-mobility-confidence",
    slug: "gear-travel-mobility-confidence",
    journey: "gear",
    title: "Travel & Mobility Confidence",
    subtitle: "Ready for the world.",
    description:
      "Build reliable routines around outings so leaving home feels possible instead of exhausting.",
    content: {
      lecture:
        "Leaving the house can feel intimidating at first. This module builds confidence around strollers, carriers, and diaper bags so outings feel possible — not exhausting.",
      metadata: { category: "gear", order: 8, estimatedTime: 30, isPublished: true },
      objectives: [
        "Build a reliable travel system",
        "Reduce mental load when leaving home",
        "Prepare for short versus long outings",
      ],
      sections: [
        {
          title: "Reflect",
          content: "What makes leaving the house feel hardest right now?",
        },
        {
          title: "Apply",
          content: "Pack a simplified quick-exit kit you can rely on.",
        },
        {
          title: "Integrate",
          content: "Write a compassionate note to yourself about learning on the go.",
        },
      ],
    },
  },
  {
    id: "gear-gear-you-dont-need",
    slug: "gear-gear-you-dont-need",
    journey: "gear",
    title: "Gear You Don’t Actually Need",
    subtitle: "Let go of the pressure.",
    description:
      "Identify optional, trendy, or unnecessary gear and release the pressure to buy it all.",
    content: {
      lecture:
        "Not all gear adds value. This module helps you identify what’s optional, trendy, or unnecessary — and how to release pressure around having it all.",
      metadata: { category: "gear", order: 9, estimatedTime: 30, isPublished: true },
      objectives: [
        "Recognize marketing pressure",
        "Make intentional decisions",
        "Reduce clutter and guilt",
      ],
      sections: [
        {
          title: "Reflect",
          content: "Which items feel pressure-driven rather than need-driven?",
        },
        {
          title: "Apply",
          content: "Pause or remove one nonessential item.",
        },
        {
          title: "Integrate",
          content: "Write your personal definition of enough.",
        },
      ],
    },
  },
  {
    id: "gear-upgrade-or-let-go",
    slug: "gear-upgrade-or-let-go",
    journey: "gear",
    title: "When to Upgrade or Let Go",
    subtitle: "Transition with intention.",
    description:
      "Know when to adapt, replace, or release gear without guilt or sunk-cost stress.",
    content: {
      lecture:
        "Gear evolves as your baby grows. This module teaches when to adapt, replace, or release gear — without guilt or sunk-cost stress.",
      metadata: { category: "gear", order: 10, estimatedTime: 30, isPublished: true },
      objectives: [
        "Identify transition signals",
        "Avoid over-holding onto gear",
        "Plan intentional upgrades",
      ],
      sections: [
        {
          title: "Reflect",
          content: "What makes letting go of gear emotionally difficult?",
        },
        {
          title: "Apply",
          content: "Evaluate one item for its current usefulness.",
        },
        {
          title: "Integrate",
          content: "Create a simple gear transition checklist.",
        },
      ],
    },
  },
  {
    id: "nursery-atmosphere-sensory-calm",
    slug: "nursery-atmosphere-sensory-calm",
    journey: "nursery",
    title: "Atmosphere & Sensory Calm",
    subtitle: "Calm cues that soothe every sense.",
    description:
      "Layer light, sound, texture, and scent to keep the nursery grounded through night feeds and quiet mornings.",
    content: {
      lecture:
        "A nursery is not just a room — it’s a nervous system. Light, sound, texture, and scent all communicate safety or stress, often before we consciously register it. This module explores how to create a calming sensory environment that supports sleep, feeding, and emotional regulation for both baby and parent. We focus on subtle adjustments that make a powerful difference, especially during long nights.",
      metadata: { category: "nursery", order: 6, estimatedTime: 32, isPublished: true },
      objectives: [
        "Identify sensory inputs that affect calm and overstimulation",
        "Adjust lighting, sound, and texture intentionally",
        "Create a consistent sensory rhythm in the nursery",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "Notice the sensory tone of the room you imagine. Is it bright, quiet, echoing, cozy, or busy? How does your body respond to that space?",
        },
        {
          title: "Apply",
          content:
            "Choose one sensory element to adjust this week — lighting temperature, white noise placement, or textiles — and observe how it changes the feel of the room.",
        },
        {
          title: "Integrate",
          content: "Write a short description of how you want the nursery to feel at night versus during the day.",
        },
      ],
    },
  },
  {
    id: "nursery-storage-that-supports-real-life",
    slug: "nursery-storage-that-supports-real-life",
    journey: "nursery",
    title: "Storage That Supports Real Life",
    subtitle: "Placement that reduces friction.",
    description:
      "Design storage around actual habits so routines stay calm when life gets busy.",
    content: {
      lecture:
        "Storage is not about hiding things — it’s about supporting habits. This module reframes storage as an emotional tool that reduces friction, decision fatigue, and overwhelm. We focus on placement, visibility, and access so daily routines feel lighter and more intuitive.",
      metadata: { category: "nursery", order: 7, estimatedTime: 32, isPublished: true },
      objectives: [
        "Match storage systems to daily routines",
        "Reduce friction in high-use areas",
        "Build storage that evolves with baby",
      ],
      sections: [
        {
          title: "Reflect",
          content: "Where do things currently pile up when life gets busy? What does that tell you about your habits?",
        },
        {
          title: "Apply",
          content: "Redesign one storage zone (diapers, clothes, feeding) based on reach and frequency, not aesthetics.",
        },
        {
          title: "Integrate",
          content: "Sketch or list one storage system you want to maintain long-term — even during chaotic seasons.",
        },
      ],
    },
  },
  {
    id: "nursery-lighting-day-night-transition",
    slug: "nursery-lighting-day-night-transition",
    journey: "nursery",
    title: "Lighting for Day, Night & Transition",
    subtitle: "Light that cues calm.",
    description:
      "Layer lighting intentionally so play, care, and sleep feel anchored to rhythm.",
    content: {
      lecture:
        "Lighting affects sleep, mood, and recovery more than most parents expect. This module teaches how to layer lighting for daytime play, nighttime care, and early morning transitions without overstimulation.",
      metadata: { category: "nursery", order: 8, estimatedTime: 32, isPublished: true },
      objectives: [
        "Layer ambient, task, and night lighting",
        "Avoid sleep-disruptive brightness",
        "Use lighting to cue routines",
      ],
      sections: [
        {
          title: "Reflect",
          content: "How do you feel under bright light at night? What kind of light helps you stay calm but alert?",
        },
        {
          title: "Apply",
          content: "Adjust one lighting source to better support nighttime care (lamp, dimmer, bulb temperature).",
        },
        {
          title: "Integrate",
          content: "Describe your ideal nighttime lighting setup in one paragraph.",
        },
      ],
    },
  },
  {
    id: "nursery-safety-without-fear",
    slug: "nursery-safety-without-fear",
    journey: "nursery",
    title: "Safety Without Fear",
    subtitle: "Confidence, not panic.",
    description:
      "Plan safety with poise so the nursery feels prepared without increasing anxiety.",
    content: {
      lecture:
        "Safety planning doesn’t have to feel overwhelming or alarmist. This module focuses on creating a secure environment through thoughtful layout, anchoring, and awareness — without feeding anxiety or perfectionism.",
      metadata: { category: "nursery", order: 9, estimatedTime: 32, isPublished: true },
      objectives: [
        "Identify common nursery safety risks",
        "Apply preventative layout decisions",
        "Build confidence instead of fear",
      ],
      sections: [
        {
          title: "Reflect",
          content: "Which safety topics feel grounding, and which tend to increase anxiety for you?",
        },
        {
          title: "Apply",
          content: "Secure or reposition one item that could pose a future risk.",
        },
        {
          title: "Integrate",
          content: "Write a reminder to yourself about balanced, compassionate safety planning.",
        },
      ],
    },
  },
  {
    id: "nursery-room-that-grows",
    slug: "nursery-room-that-grows",
    journey: "nursery",
    title: "A Room That Grows With Your Child",
    subtitle: "Future-friendly design.",
    description:
      "Choose layouts and pieces that adapt through developmental shifts to reduce waste later.",
    content: {
      lecture:
        "The best nurseries don’t expire at 12 months. This module helps you choose layouts and pieces that adapt as your baby grows, reducing waste and emotional friction later.",
      metadata: { category: "nursery", order: 10, estimatedTime: 32, isPublished: true },
      objectives: [
        "Choose adaptable furniture",
        "Plan for developmental shifts",
        "Reduce future rework",
      ],
      sections: [
        {
          title: "Reflect",
          content: "Which items feel temporary, and which feel foundational to you?",
        },
        {
          title: "Apply",
          content: "Identify one piece you can choose now that will last across multiple stages.",
        },
        {
          title: "Integrate",
          content: "Write a short note to your future self about how you want the room to evolve.",
        },
      ],
    },
  },
  {
    id: "gear-strollers-car-seats-mobility-basics",
    slug: "gear-strollers-car-seats-mobility-basics",
    journey: "gear",
    title: "Strollers, Car Seats & Mobility Basics",
    subtitle: "Match mobility tools to your daily routes.",
    description:
      "Understand how to move your family through life with gear that fits your pace and spaces.",
    content: {
      lecture:
        "Mobility is freedom - but it's also bonding. In this module, we explore how strollers, carriers, and movement tools fit into your daily life, not just your outings. We'll talk about terrain, lifestyle, caregiver preferences, and realistic use - not feature overload. The goal isn't the best gear. It's the gear that supports closeness, confidence, and ease - whether you're navigating airports or neighborhood walks.",
      metadata: { category: "gear", order: 1, estimatedTime: 40, isPublished: true },
      objectives: [
        "Compare stroller, car seat, and carrier types through the lens of your lifestyle.",
        "Plan for safe installation and transitions between gear modes.",
        "Choose mobility tools that give you confidence on errands and adventures.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "What does your week look like? Grocery runs, walks, travel, or long commutes? Identify the surfaces, timing, and help you rely on so you can weigh comfort, maneuverability, and storage needs.",
        },
        {
          title: "Apply",
          content:
            "Practice installing the car seat, docking it into the stroller, and settling into a carrier. Keep a simple log of what felt smooth and what required extra effort, then adjust your shortlist accordingly.",
        },
        {
          title: "Integrate",
          content:
            "Plan a real outing this week, observe how the gear performs across terrain and timing, and lean into the combination that keeps movement easy and connected.",
        },
      ],
    },
  },
  {
    id: "gear-daily-gear-youll-actually-use",
    slug: "gear-daily-gear-youll-actually-use",
    journey: "gear",
    title: "Daily Gear You'll Actually Use",
    subtitle: "Focus on clarity, not clutter.",
    description:
      "Choose the handful of everyday essentials that show up in every routine and keep the rest stored away.",
    content: {
      lecture:
        "Feeding is one of the most intimate parts of early parenting - and the most variable. This module focuses on flexibility. We walk through feeding setups that support comfort, posture, and routine while honoring that plans may change. You'll learn how to choose seating and feeding gear that adapts across stages, supports caregivers, and fits your home flow - without locking you into one method or mindset. There's no single right way to feed a baby. There is a way that feels supported.",
      metadata: { category: "gear", order: 2, estimatedTime: 33, isPublished: true },
      objectives: [
        "Identify gear that earns space in your daily flow.",
        "Streamline storage so you can reach essentials without hunting.",
        "Plan for comfort through smart product pairings.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "Which gestures happen daily? How often do you reach for a swaddle, a carrier, or a pouch of wipes? What truly feels like a must-have versus something you can store away?",
        },
        {
          title: "Apply",
          content:
            "Create a checklist of the daily rituals and assign one item to each. Source those items, keep them together, and tuck duplicates away until you see a real need.",
        },
        {
          title: "Integrate",
          content:
            "Check in weekly: remove what you never touch, restock what is running low, and keep the kit limited so it always feels ready and calm.",
        },
      ],
    },
  },
  {
    id: "gear-feeding-essentials-bottle-breast-combo",
    slug: "gear-feeding-essentials-bottle-breast-combo",
    journey: "gear",
    title: "Feeding Essentials (Bottle, Breast, Combo)",
    subtitle: "Build a gentle, pressure-free feeding practice.",
    description:
      "Plan everything from prepping to cleanup so each feed feels calm and confident.",
    content: {
      lecture:
        "Feeding journeys are deeply personal - yet the rituals that surround them shape your days. In this module, we cover how to warm, stage, and clean bottles or pumping kits with calm intention. We'll talk through comfortable seating, flexible toolkits, and how to honor the emotional shifts that accompany each feeding choice.",
      metadata: { category: "gear", order: 3, estimatedTime: 45, isPublished: true },
      objectives: [
        "Outline tools for breastfeeding, pumping, bottle feeding, or hybrids.",
        "Create cleaning and storage rituals that stay manageable.",
        "Honor your emotional needs around each feeding decision.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "What emotions accompany your feeding plans? Where might you feel pressure or relief? Write down what you need emotionally, physically, and logistically so you can name it aloud.",
        },
        {
          title: "Apply",
          content:
            "Run through a full feeding cycle: prep, feed, and clean. Adjust your layout or supplies when you notice friction so the next time feels smoother.",
        },
        {
          title: "Integrate",
          content:
            "Share your log with a partner or mentor, revisit it after a week, and adjust the toolkit so the space you feed in always meets the feelings you noted.",
        },
      ],
    },
  },
  {
    id: "gear-bathing-changing-hygiene",
    slug: "gear-bathing-changing-hygiene",
    journey: "gear",
    title: "Bathing, Changing & Hygiene",
    subtitle: "Build routines that feel peaceful, not frantic.",
    description:
      "Establish safe, functional setups for daily care so you can move through each step calmly.",
    content: {
      lecture:
        "Care routines feel peaceful when the space is ready. This module walks through bathing, changing, and hygiene setups that keep you focused on the baby, not on hunting for towels. We'll layer storage, gentle products, and mindful rituals so each touchpoint feels steady and calm.",
      metadata: { category: "gear", order: 4, estimatedTime: 34, isPublished: true },
      objectives: [
        "Organize bath, change, and grooming stations for simplicity.",
        "Select gentle products that stay within reach.",
        "Create storage that keeps the essentials ready without clutter.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "How do you want the bathing and changing flow to feel? Quiet and meditative, fast and efficient, or playful? Write down the tone you crave and what would help you get there.",
        },
        {
          title: "Apply",
          content:
            "Gather a bathing tote, a diaper caddy, and grooming tools. Label the zones, place the tote near water, and run a trial routine to surface any shortages or adjustments.",
        },
        {
          title: "Integrate",
          content:
            "Flag two cues—supplies aligned and water ready—that signal the routine is ready, and review them weekly so the rituals stay calm and intentional.",
        },
      ],
    },
  },
  {
    id: "gear-longevity-storage-adaptability",
    slug: "gear-longevity-storage-adaptability",
    journey: "gear",
    title: "Gear Longevity, Storage & Adaptability",
    subtitle: "Keep gear useful through every season.",
    description:
      "Choose adaptable pieces and storage systems so gear feels intentional, not overwhelming.",
    content: {
      lecture:
        "Longevity means more than durability; it means flexibility. This module is about choosing gear that converts, nests, collapses, and storing the rest so your studio stays calm. We'll walk through rotation habits, labeled storage, and how to keep the daily essentials accessible while the seasonal pieces rest.",
      metadata: { category: "gear", order: 5, estimatedTime: 30, isPublished: true },
      objectives: [
        "Select pieces that grow with your child and reduce turnover.",
        "Design a storage plan that keeps the nursery tidy and accessible.",
        "Practice rotating or passing along gear responsibly.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "What will you still need in three months? What can be stored or let go? Knowing that future phase lets you inventory intentionally today.",
        },
        {
          title: "Apply",
          content:
            "Catalog gear into daily, weekly, and archive bins, label them, and reserve a shelf or closet for overflow. Schedule a quarterly review to pass along what no longer fits your life.",
        },
        {
          title: "Integrate",
          content:
            "Plan a monthly sweep to rotate seasonal bins, lighten the everyday zone, and pass along pieces that no longer match your routine so the room stays intentional.",
        },
      ],
    },
  },
  {
    id: "postpartum-physical-recovery-body-changes",
    slug: "postpartum-physical-recovery-body-changes",
    journey: "postpartum",
    title: "Physical Recovery & Body Changes",
    subtitle: "Gentle checkpoints for healing.",
    description:
      "Notice how your body is shifting and build rest, nourishment, and movement routines that feel supportive.",
    content: {
      lecture:
        "Your body doesn't bounce back. It heals forward. This module centers on recovery - physical, emotional, and mental - without timelines or comparison. We talk honestly about what healing looks like, what support actually helps, and how to listen to your body with compassion. You deserve care, rest, and understanding - not pressure.",
      metadata: { category: "postpartum", order: 1, estimatedTime: 40, isPublished: true },
      objectives: [
        "Track the physical milestones of the early postpartum weeks.",
        "Build nourishing rest and movement rituals with intention.",
        "Clear a plan for when to reach out to care providers.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "Where do you feel tightness, fatigue, or imbalance? What feels better after a short rest? Journal the little cues so you can take action sooner rather than later.",
        },
        {
          title: "Apply",
          content:
            "Gather snacks, water, pads, and a small guide for postpartum warnings. Share it with someone who can help you check in and remind you to pause when needed.",
        },
        {
          title: "Integrate",
          content:
            "Book a gentle weekly rest check—10 minutes to note shifts, update your plan, and call a provider if anything continues to feel off.",
        },
      ],
    },
  },
  {
    id: "postpartum-mental-health-identity-emotions",
    slug: "postpartum-mental-health-identity-emotions",
    journey: "postpartum",
    title: "Mental Health, Identity & Emotions",
    subtitle: "A candid space for honesty.",
    description:
      "Hold space for the emotional currents that arrive with a new identity and reshape expectations.",
    content: {
      lecture:
        "Babies change relationships - even the strong ones. In this module, we explore communication, identity shifts, intimacy, and emotional load with honesty and care. We normalize the messy middle and provide tools for staying connected - to yourself and others. You're not doing it wrong. You're adjusting.",
      metadata: { category: "postpartum", order: 2, estimatedTime: 40, isPublished: true },
      objectives: [
        "Name the identity shifts and emotional waves you are feeling.",
        "Spot early signs of overwhelm or isolation.",
        "Prototype coping rituals and compassionate self-talk.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "How has your identity shifted? What expectations felt manageable, and which ones felt heavy? Describe the tone you wish you could speak to yourself with over the coming weeks.",
        },
        {
          title: "Apply",
          content:
            "Schedule a weekly 10-minute check-in—journal, text a friend, or breathe with intent. Keep a list of phrases you can use when asking for help so conversations stay clear and kind.",
        },
        {
          title: "Integrate",
          content:
            "Use the scripts and check-ins you practiced to keep your partner or mentor looped in, then revisit them as your sense of self shifts.",
        },
      ],
    },
  },
  {
    id: "postpartum-feeding-support-expectations",
    slug: "postpartum-feeding-support-expectations",
    journey: "postpartum",
    title: "Feeding Support & Expectations",
    subtitle: "Practical, pressure-free guidance.",
    description:
      "Ground your feeding path in honest planning and compassionate support.",
    content: {
      lecture:
        "Feeding journeys are deeply personal, unpredictable, and emotionally rich. This module holds space for breastfeeding, pumping, formula, and combination feeding by grounding you in preparation without pressure. We share practical tools plus honest conversations so you can pivot with compassion when expectations shift.",
      metadata: { category: "postpartum", order: 3, estimatedTime: 35, isPublished: true },
      objectives: [
        "Compare the energy and tools each feeding path requires.",
        "Set realistic expectations for milk, bottles, and rhythm.",
        "Build a communication plan for partners or mentors.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "What feelings come up when you think about feeding? Pressure, curiosity, relief, or confusion? Write them down so you can share the most honest version with yourself and your tribe.",
        },
        {
          title: "Apply",
          content:
            "Start a simple feeding log with highs and challenges, then share it with someone who can hold space. Use it to celebrate what goes well and to guide where you need support next.",
        },
        {
          title: "Integrate",
          content:
            "Revisit your expectations log after two weeks, celebrate the wins, and adjust the scripts you use to ask for support so the help matches what you need.",
        },
      ],
    },
  },
  {
    id: "postpartum-sleep-deprivation-survival-rhythms",
    slug: "postpartum-sleep-deprivation-survival-rhythms",
    journey: "postpartum",
    title: "Sleep Deprivation & Survival Rhythms",
    subtitle: "Practical rituals for tired days.",
    description:
      "Trade myths for realistic survival plans that protect rest and focus on recovery.",
    content: {
      lecture:
        "Sleep deprivation blurs decision-making, so we lean on survival rhythms that protect rest. This module introduces short naps, shared night shifts, and hydration rituals alongside blackout curtains and gentle routines that cue your body for rest. The goal is to keep you steady, not heroic.",
      metadata: { category: "postpartum", order: 4, estimatedTime: 30, isPublished: true },
      objectives: [
        "Understand how sleep deprivation affects mood and cognition.",
        "Design survival rhythms that stack short rest with tasks.",
        "Create guardrails to protect pockets of recovery.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "When do you feel the fog lift and when does it deepen? Which micro rest tactics feel most life-giving? Take note so you can lean into the helpful habits more often.",
        },
        {
          title: "Apply",
          content:
            "Write the tasks that must happen and the tasks that can wait. Block short rest windows on the calendar and share them with your partner so they can cover what you need.",
        },
        {
          title: "Integrate",
          content:
            "Anchor one daily rhythm—a hydrated pause, a shared night shift, or a calm descent ritual—and keep that signal as a nonnegotiable rest window.",
        },
      ],
    },
  },
  {
    id: "postpartum-support-systems-boundaries-help",
    slug: "postpartum-support-systems-boundaries-help",
    journey: "postpartum",
    title: "Support Systems, Boundaries & Help",
    subtitle: "Design your team and your boundaries.",
    description:
      "Clarify who can help, how they can help, and how you want to protect your energy.",
    content: {
      lecture:
        "Parenting was never meant to be done alone. This module helps you think through support - professional, practical, and emotional. We'll explore how to identify what you need, when you need it, and how to ask for help without guilt. Support isn't a luxury. It's infrastructure.",
      metadata: { category: "postpartum", order: 5, estimatedTime: 35, isPublished: true },
      objectives: [
        "Map emotional, practical, and medical supporters.",
        "Set boundaries that preserve your energy.",
        "Craft scripts for asking for help without guilt.",
      ],
      sections: [
        {
          title: "Reflect",
          content:
            "What feels nourishing versus draining? Where do you need to say no so you can say yes to what matters? Write down the lines that keep your energy intact.",
        },
        {
          title: "Apply",
          content:
            "Draft the sentences you will use (e.g., \"Can you take the baby for 30 minutes so I can rest?\"). Keep them on your phone or share them with your closest person so the ask is clear when you need a pause.",
        },
        {
          title: "Integrate",
          content:
            "Set a monthly review of your support map, refresh who covers which task, and thank the people who show up so the boundaries and gratitude grow together.",
        },
      ],
    },
  },
  {
    id: "postpartum-emotional-recovery-identity",
    slug: "postpartum-emotional-recovery-identity",
    journey: "postpartum",
    title: "Emotional Recovery & Identity Shifts",
    subtitle: "Grief, growth, and compassion.",
    description:
      "Normalize identity change and hold space for emotional recovery in early postpartum.",
    content: {
      lecture:
        "Postpartum recovery includes grief, growth, and identity change. This module normalizes emotional transitions and offers grounding tools for self-compassion.",
      metadata: { category: "postpartum", order: 6, estimatedTime: 30, isPublished: true },
      objectives: ["Name emotional shifts", "Practice self-validation", "Reduce shame"],
      sections: [
        {
          title: "Reflect",
          content: "What feels different about you right now?",
        },
        {
          title: "Apply",
          content: "Practice one grounding or emotional check-in ritual.",
        },
        {
          title: "Integrate",
          content: "Write a compassionate letter to yourself.",
        },
      ],
    },
  },
  {
    id: "postpartum-asking-for-help",
    slug: "postpartum-asking-for-help",
    journey: "postpartum",
    title: "Asking for Help Without Guilt",
    subtitle: "Support as sustainability.",
    description:
      "Reframe asking for help as a shared practice that keeps you steady.",
    content: {
      lecture:
        "Support is not a failure — it’s a skill. This module reframes asking for help as sustainability and connection.",
      metadata: { category: "postpartum", order: 7, estimatedTime: 30, isPublished: true },
      objectives: ["Identify support needs", "Communicate boundaries", "Release guilt"],
      sections: [
        {
          title: "Reflect",
          content: "What makes asking for help difficult for you?",
        },
        {
          title: "Apply",
          content: "Draft one clear and specific help request.",
        },
        {
          title: "Integrate",
          content: "Write a reminder about shared care.",
        },
      ],
    },
  },
  {
    id: "postpartum-rest-sleep-permission",
    slug: "postpartum-rest-sleep-permission",
    journey: "postpartum",
    title: "Rest, Sleep & Permission",
    subtitle: "Permission-based recovery.",
    description:
      "Explore realistic rest strategies that honor your body’s needs.",
    content: {
      lecture:
        "Rest looks different postpartum. This module explores realistic rest strategies and permission-based recovery.",
      metadata: { category: "postpartum", order: 8, estimatedTime: 30, isPublished: true },
      objectives: ["Redefine rest", "Reduce productivity pressure", "Build recovery rhythms"],
      sections: [
        {
          title: "Reflect",
          content: "What messages do you hold about rest?",
        },
        {
          title: "Apply",
          content: "Create one protected rest window.",
        },
        {
          title: "Integrate",
          content: "Write your personal rest permission slip.",
        },
      ],
    },
  },
  {
    id: "postpartum-relationship-shifts",
    slug: "postpartum-relationship-shifts",
    journey: "postpartum",
    title: "Relationship Shifts & Communication",
    subtitle: "Honest connection.",
    description:
      "Support emotional partnerships by naming shifts and practicing empathy.",
    content: {
      lecture:
        "Partnerships shift after birth. This module supports honest communication, empathy, and realistic expectations.",
      metadata: { category: "postpartum", order: 9, estimatedTime: 30, isPublished: true },
      objectives: ["Normalize relationship changes", "Improve communication", "Reduce resentment"],
      sections: [
        {
          title: "Reflect",
          content: "What feels hardest to express right now?",
        },
        {
          title: "Apply",
          content: "Practice one low-stakes emotional check-in.",
        },
        {
          title: "Integrate",
          content: "Write a shared intention statement.",
        },
      ],
    },
  },
  {
    id: "postpartum-trusting-yourself",
    slug: "postpartum-trusting-yourself",
    journey: "postpartum",
    title: "Trusting Yourself as a Parent",
    subtitle: "Intuition over comparison.",
    description:
      "Reconnect with your instincts so confidence grows alongside experience.",
    content: {
      lecture:
        "Confidence grows through experience, not perfection. This module helps parents reconnect with intuition and self-trust.",
      metadata: { category: "postpartum", order: 10, estimatedTime: 30, isPublished: true },
      objectives: ["Reduce comparison", "Build confidence", "Strengthen intuition"],
      sections: [
        {
          title: "Reflect",
          content: "When have you trusted yourself successfully?",
        },
        {
          title: "Apply",
          content: "Follow your instinct in one small moment.",
        },
        {
          title: "Integrate",
          content: "Write a self-trust affirmation.",
        },
      ],
    },
  },
];

async function seedAcademyModules() {
  console.log("🌸 Seeding Academy Modules…");

  try {
    for (const mod of academyModules) {
      const metadata = mod.content?.metadata ?? {};
      const modulePayload = {
        ...mod,
        published: Boolean(metadata.isPublished),
        order: metadata.order ?? 0,
      };

      await prisma.academyModule.upsert({
        where: { id: mod.id },
        update: modulePayload,
        create: modulePayload,
      });

      console.log(`📘 Upserted: ${mod.slug}`);
    }

    console.log("✨ Academy modules seeded successfully!");
  } catch (err) {
    console.error("❌ Academy module seed failed", err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = seedAcademyModules;
