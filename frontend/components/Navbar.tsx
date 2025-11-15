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
    <header className="fixed top-6 left-0 right-0 z-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-tmDust bg-white/80 px-6 py-3 shadow-sm backdrop-blur-md">
        <Link href="/" className="leading-tight">
          <div className="font-script text-3xl text-tmMauve">Taylor-Made</div>
          <div className="font-serif text-xs uppercase tracking-[0.2em] text-tmCharcoal">
            Baby Co.
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm tracking-wide text-tmCharcoal lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="font-sans transition hover:text-tmMauve">
              {link.label}
            </Link>
          ))}
          <Link href="/requestinvite" className="btn-primary px-6 py-2 text-sm">
            Request Invite
          </Link>
          <Link href="/login" className="btn-primary px-6 py-2 text-sm">
            Login
          </Link>
        </nav>
        <div className="flex items-center gap-2 text-xs font-semibold text-tmCharcoal lg:hidden">
          <Link href="/requestinvite" className="btn-primary px-6 py-2 text-xs">
            Request Invite
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
