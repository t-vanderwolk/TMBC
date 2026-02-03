import { Metadata } from "next";
import { TmbcSeal } from "@/components/marketing/TmbcSeal";

export const metadata: Metadata = {
  title: "The Art of the Registry | Taylor-Made Baby Co.",
  description:
    "How to prepare for baby without overbuying — and without losing yourself in the process.",
};

export default function ArtOfTheRegistryPage() {
  return (
    <article className="bg-white">
      <header className="py-24 md:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            The Journal
          </p>

          <h1 className="text-4xl md:text-5xl leading-tight">
            The Art of the Registry
          </h1>

          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-[48ch]">
            How to prepare for baby without overbuying — or feeling like you’re
            doing it wrong.
          </p>
        </div>
      </header>

      <section className="pb-28">
        <div className="mx-auto max-w-2xl px-6 md:px-10 space-y-8 text-base leading-relaxed text-muted-foreground">
          <p>
            There’s a moment in early pregnancy (or adoption planning) when it hits you:
          </p>

          <p>
            Everyone is telling you to buy something — and none of them agree.
          </p>

          <p>
            One person swears you must have a wipe warmer. Another says they never used
            half their registry. Instagram shows perfectly styled nurseries. Your group
            chat is sending Amazon links at 11pm. And suddenly, preparing for your baby
            feels less like care… and more like consumer overwhelm.
          </p>

          <p>
            At Taylor-Made Baby Co., we believe baby prep isn’t about buying more.
            It’s about choosing intentionally — with support from someone who’s already
            been exactly where you are.
          </p>

          <p>
            <strong>This is the art of the registry.</strong>
          </p>

          <hr className="my-10 border-muted" />

          <h2 className="text-2xl text-foreground">
            Why registries get overwhelming (and why it’s not your fault)
          </h2>

          <p>
            Modern baby prep happens at the intersection of marketing algorithms,
            well-meaning advice, and a very real desire to “get it right.”
          </p>

          <p>
            Most registries fail not because parents don’t care — but because no one
            explains what products actually do, when you’ll need them, or whether your
            life even calls for them.
          </p>

          <p>
            So parents default to “just in case,” “everyone else has this,” or
            “I don’t want to forget something.”
          </p>

          <p>
            That’s not overbuying because you’re careless.
            That’s overbuying because you’re unsupported.
          </p>

          <hr className="my-10 border-muted" />

          <h2 className="text-2xl text-foreground">
            The Taylor-Made approach: Learn · Plan · Connect · Reflect
          </h2>

          <p>
            We built TMBC around a simple belief: you deserve clarity before you purchase.
          </p>

          <p>
            Here’s how our process works — in real, human terms.
          </p>

          <hr className="my-10 border-muted" />

          <h3 className="text-xl text-foreground">Learn</h3>

          <p>
            What does this actually do — and do I need it?
          </p>

          <p>
            Before anything touches your registry, you learn what each product is
            designed to solve, when it’s typically used, and which features actually
            matter for your home, lifestyle, and baby.
          </p>

          <p>
            No pressure. No brand bias. Just calm explanation.
          </p>

          <p>
            Because it’s a lot easier to say “no” to something once you actually
            understand it.
          </p>

          <hr className="my-10 border-muted" />

          <h3 className="text-xl text-foreground">Plan</h3>

          <p>
            Build your registry while you learn — with a mentor who’s done this before.
          </p>

          <p>
            Instead of building a registry all at once, you plan in layers: essentials
            versus nice-to-haves, buy now versus wait and see, borrow, rent, secondhand,
            or skip entirely.
          </p>

          <p>
            You don’t do this alone. You plan alongside a trusted mentor — someone who’s
            been through babyhood, gear decisions, and the emotional side of it all.
          </p>

          <p>
            This is where overbuying quietly disappears.
          </p>

          <hr className="my-10 border-muted" />

          <h3 className="text-xl text-foreground">Connect</h3>

          <p>
            You’re not the only one asking these questions.
          </p>

          <p>
            Inside TMBC, you connect with other parents at the same stage, mentors who
            guide conversations, and people asking the same things you’re wondering at
            2am.
          </p>

          <p>
            “Do I really need this?”
            <br />
            “Did anyone else skip this?”
            <br />
            “What actually mattered in the first month?”
          </p>

          <p>
            You’re not crowdsourcing chaos — you’re sharing clarity.
          </p>

          <hr className="my-10 border-muted" />

          <h3 className="text-xl text-foreground">Reflect</h3>

          <p>
            Turn preparation into something you’ll actually want to keep.
          </p>

          <p>
            Most baby prep disappears into receipts and boxes.
            We believe it should become a keepsake.
          </p>

          <p>
            Inside TMBC, you can reflect as you go: what you learned, what you chose
            (and why), and how your confidence grew.
          </p>

          <p>
            So one day, you can look back — not at how much you bought — but at how
            thoughtfully you prepared for your baby.
          </p>

          <hr className="my-10 border-muted" />

          <h2 className="text-2xl text-foreground">
            The member-to-mentor path (because wisdom compounds)
          </h2>

          <p>
            Some members eventually become mentors.
          </p>

          <p>
            Parents who once asked the questions become the ones helping others navigate
            them. It’s a cycle of lived experience passed forward — and it keeps the
            platform grounded, human, and real.
          </p>

          <hr className="my-10 border-muted" />

          <p>
            Preparing without overbuying isn’t about restraint — it’s about trust.
          </p>

          <p>
            Trust in yourself, your ability to learn, and the idea that you don’t need
            everything to be a great parent.
          </p>

          <p>
            You just need the right things — chosen with care.
          </p>

          <p>
            <strong>That’s the art of the registry.</strong>
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <TmbcSeal />
        </div>
      </section>
    </article>
  );
}
