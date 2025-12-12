import StyledButton from "@/components/tmbc/StyledButton";
import StyledInput from "@/components/tmbc/StyledInput";
import StyledTextArea from "@/components/tmbc/StyledTextArea";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">Profile</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Your family story</h1>
        <p className="text-sm text-[#3E2F35]/70">Update your details so your mentor knows you better.</p>
      </header>
      <form className="space-y-4 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
        <StyledInput placeholder="Partner name" />
        <StyledInput placeholder="Due date" type="date" />
        <StyledInput placeholder="Location" />
        <StyledTextArea rows={3} placeholder="Share a fun fact, your favorite ritual, or travel style." />
        <StyledButton type="submit" fullWidth>
          Save profile
        </StyledButton>
      </form>
    </div>
  );
}
