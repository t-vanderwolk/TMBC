import StyledButton from "@/components/tmbc/StyledButton";
import StyledInput from "@/components/tmbc/StyledInput";
import StyledTextArea from "@/components/tmbc/StyledTextArea";

export default function SupportRequestPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">Support request</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Share what you need</h1>
        <p className="text-sm text-[#3E2F35]/70">
          Our concierge team is standing by to craft a working session, styling moment, or gear refresh.
        </p>
      </header>
      <form className="space-y-4 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
        <StyledInput placeholder="Your name" name="name" />
        <StyledInput placeholder="Best email" name="email" />
        <StyledInput placeholder="Preferred timing" name="timing" />
        <StyledTextArea rows={4} placeholder="Tell us about your request" name="details" />
        <StyledButton type="submit" fullWidth>
          Submit request
        </StyledButton>
      </form>
    </div>
  );
}
