"use server";

import StyledButton from "@/components/tmbc/StyledButton";
import RegistryItemCard from "@/components/tmbc/RegistryItemCard";
import { fetchCategoryItems } from "@/lib/api/placeholders";
import {
  addRegistryItem,
  removeRegistryItem,
  updateRegistryItem,
  syncWithRegistry,
} from "@/app/(dashboard)/actions";

export default async function CategoryRegistryPage({ params }: { params: { category: string } }) {
  const items = await fetchCategoryItems(params.category);

  return (
    <div className="space-y-6">
      <header className="space-y-2 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">Registry · {params.category}</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">{params.category} picks</h1>
        <form action={syncWithRegistry} className="mt-2">
          <StyledButton variant="secondary">Sync with my registry</StyledButton>
        </form>
      </header>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="space-y-3">
            <RegistryItemCard
              image={item.image}
              title={item.title}
              price={item.price}
              reason={item.reason}
              affiliateUrl="https://example.com"
              notes="Mentor note: Loved this for its neutral glow."
            />
            <div className="flex flex-wrap gap-3">
              <form action={addRegistryItem} className="flex">
                <input type="hidden" name="category" value={params.category} />
                <input type="hidden" name="title" value={item.title} />
                <StyledButton variant="ghost">Add item</StyledButton>
              </form>
              <form action={removeRegistryItem} className="flex">
                <input type="hidden" name="itemId" value={item.id} />
                <StyledButton variant="secondary">Remove</StyledButton>
              </form>
              <form action={updateRegistryItem} className="flex">
                <input type="hidden" name="itemId" value={item.id} />
                <input type="hidden" name="mentorNotes" value="Pantry ready for gentle feedings." />
                <StyledButton variant="ghost">Update notes</StyledButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
