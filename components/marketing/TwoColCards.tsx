type TwoColCardsProps = {
  receives: string[];
  who: {
    for: string[];
    notFor: string[];
  };
};

export default function TwoColCards({ receives, who }: TwoColCardsProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="mkt-card px-10 py-10 text-left">
        <p className="mkt-eyebrow">What members receive</p>
        <h2 className="mkt-h2 font-serif">Calm clarity + attentive support</h2>
        <ul className="mkt-bullet-list">
          {receives.map((item) => (
            <li key={item} className="mkt-bullet-item">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mkt-card px-10 py-10 text-left">
        <p className="mkt-eyebrow">Who this is for</p>
        <h2 className="mkt-h2 font-serif">Real families who crave clarity—not noise.</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
              For
            </p>
            <ul className="mt-3 space-y-3">
              {who.for.map((item) => (
                <li key={item} className="mkt-bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
            <div className="space-y-3 border-t border-[var(--tmbc-charcoal)]/10 pt-4 text-sm text-[var(--tmbc-charcoal)]/75 md:border-t-0 md:border-l md:pl-6 md:pt-0">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Not for
              </p>
              <ul className="mt-3 space-y-3">
                {who.notFor.map((item) => (
                  <li key={item} className="mkt-bullet-item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
        </div>
      </div>
    </div>
  );
}
