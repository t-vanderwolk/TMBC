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
    <header className="fixed left-0 right-0 top-6 z-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 rounded-3xl border border-tmDust bg-white/85 px-5 py-3 shadow-sm backdrop-blur-md lg:flex-row lg:items-center lg:justify-between lg:rounded-full lg:px-6">
        <Link href="/" className="leading-tight">
          <div className="font-script text-3xl text-tmMauve">Taylor-Made</div>
          <div className="font-serif text-xs uppercase tracking-[0.2em] text-tmCharcoal">
            Baby Co.
          </div>
        </Link>
        <nav className="flex flex-1 items-center justify-between gap-4 text-sm tracking-wide text-tmCharcoal">
          <div className="flex flex-1 items-center gap-4 overflow-x-auto text-sm lg:justify-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap font-sans transition hover:text-tmMauve"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Link href="/requestinvite" className="btn-primary px-6 py-2 text-xs lg:text-sm">
              Request Invite
            </Link>
            <Link href="/login" className="btn-secondary px-5 py-2 text-xs lg:text-sm">
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
