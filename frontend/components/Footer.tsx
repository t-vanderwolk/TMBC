import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-tmCharcoal text-tmIvory">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <div className="font-script text-3xl text-tmMauve">Taylor-Made</div>
          <div className="font-serif text-sm uppercase tracking-[0.4em]">Baby Co.</div>
          <p className="mt-4 text-sm text-tmIvory/80">
            Curated mentorship, modern registry, and a community that keeps you grounded through every trimester.
          </p>
        </div>
        <div>
          <h3 className="font-semibold uppercase tracking-wide text-tmGold">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm text-tmIvory/80">
            {['/how-it-works', '/membership', '/blog', '/requestinvite'].map((link) => (
              <li key={link}>
                <Link href={link} className="transition hover:text-tmIvory">
                  {link.replace('/', '').replace('-', ' ') || 'home'}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold uppercase tracking-wide text-tmGold">Stay in Touch</h3>
          <p className="mt-4 text-sm text-tmIvory/80">
            Follow @taylormadebabyco on your favorite platforms. Social handles launching soon.
          </p>
          <div className="mt-6 flex gap-4 text-sm text-tmIvory/60">
            <span className="rounded-full border border-tmIvory/30 px-4 py-2">Instagram</span>
            <span className="rounded-full border border-tmIvory/30 px-4 py-2">Pinterest</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs uppercase tracking-wide text-tmIvory/60">
        © {new Date().getFullYear()} Taylor-Made Baby Co. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
