import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-tmIvory text-tmCharcoal">
      <div className="section-wrap grid gap-10 py-16 md:grid-cols-3">
        <div>
          <div className="font-script text-3xl text-tmMauve">Taylor-Made</div>
          <div className="font-serif text-xs uppercase tracking-[0.3em] text-tmCharcoal">Baby Co.</div>
          <p className="mt-4 text-sm text-tmCharcoal/80">
            Curated mentorship, modern registry, and a community that keeps you grounded through every trimester.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-lg text-tmCharcoal">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm text-tmCharcoal/80">
            {['/how-it-works', '/membership', '/blog', '/requestinvite'].map((link) => (
              <li key={link}>
                <Link href={link} className="transition hover:text-tmMauve">
                  {link.replace('/', '').replace('-', ' ') || 'home'}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-lg text-tmCharcoal">Stay in Touch</h3>
          <p className="mt-4 text-sm text-tmCharcoal/80">
            Follow @taylormadebabyco on your favorite platforms. Social handles launching soon.
          </p>
          <div className="mt-6 flex gap-4 text-sm text-tmCharcoal/70">
            <span className="rounded-full border border-tmDust px-4 py-2">Instagram</span>
            <span className="rounded-full border border-tmDust px-4 py-2">Pinterest</span>
          </div>
        </div>
      </div>
      <div className="border-t border-tmDust py-6 text-center text-xs uppercase tracking-wide text-tmCharcoal/70">
        © {new Date().getFullYear()} Taylor-Made Baby Co. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
