import Link from 'next/link';

const links = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Membership', href: '/membership' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-tmIvory/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-b-3xl px-4 py-4 md:px-8">
        <Link href="/" className="leading-tight">
          <div className="font-script text-3xl text-tmMauve">Taylor-Made</div>
          <div className="font-serif text-xs uppercase tracking-[0.4em] text-tmCharcoal">
            Baby Co.
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-tmCharcoal/80 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-tmCharcoal">
              {link.label}
            </Link>
          ))}
          <Link
            href="/requestinvite"
            className="rounded-full bg-tmMauve px-4 py-2 text-white shadow-soft transition hover:bg-tmCharcoal"
          >
            Request Invite
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-tmMauve px-4 py-2 text-tmMauve transition hover:bg-tmMauve/10"
          >
            Login
          </Link>
        </nav>
        <div className="flex items-center gap-2 text-xs font-semibold text-tmCharcoal lg:hidden">
          <Link href="/requestinvite" className="rounded-full bg-tmMauve px-4 py-2 text-white">
            Request Invite
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
