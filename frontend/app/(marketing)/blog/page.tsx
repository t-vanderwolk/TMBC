const posts = [
  {
    title: 'Stroller Guide',
    excerpt: 'Breaking down the strollers we actually push around Austin and beyond.',
  },
  {
    title: 'Car Seat Guide',
    excerpt: 'Clear answers on infant vs. convertible, installation tips, and registry picks.',
  },
];

const BlogPage = () => {
  return (
    <div className="section-wrap space-y-8">
      <header className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">Journal</p>
        <h1 className="text-4xl">Stories from the Nursery Floor</h1>
        <p className="text-sm text-tmCharcoal/80">
          Fresh posts coming soon. In the meantime, peek at the guides the community is buzzing about.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.title} className="card-surface">
            <p className="text-xs uppercase tracking-[0.3em] text-tmMauve">Placeholder</p>
            <h2 className="mt-2 text-2xl">{post.title}</h2>
            <p className="mt-2 text-sm text-tmCharcoal/80">{post.excerpt}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-tmMauve">Coming soon</span>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
