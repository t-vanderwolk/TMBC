import StyledButton from "@/components/tmbc/StyledButton";
import StyledInput from "@/components/tmbc/StyledInput";
import StyledTextArea from "@/components/tmbc/StyledTextArea";
import { createCapsule } from "@/app/(dashboard)/actions";

export default function TimeCapsuleNewPage() {
  return (
    <form
      action={createCapsule}
      className="space-y-6 rounded-[2.5rem] border border-[#E3C6D4] bg-white/90 p-8 shadow-[0_35px_60px_rgba(180,143,164,0.2)]"
    >
      <h2 className="font-serif text-3xl text-[#3E2F35]">New capsule</h2>
      <label className="space-y-2 text-sm text-[#3E2F35]">
        Capsule title
        <StyledInput name="title" placeholder="Love letter to future you" />
      </label>
      <label className="space-y-2 text-sm text-[#3E2F35]">
        Type
        <select
          name="type"
          className="w-full rounded-2xl border border-[#E3C6D4] bg-white px-4 py-3 text-sm text-[#3E2F35]"
        >
          <option value="letter">Letter</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
          <option value="photo">Photo</option>
          <option value="journal">Journal</option>
        </select>
      </label>
      <label className="space-y-2 text-sm text-[#3E2F35]">
        Capture
        <StyledTextArea name="content" rows={5} placeholder="Type your note or describe the memory." />
      </label>
      <StyledButton type="submit" fullWidth>
        Save to vault
      </StyledButton>
    </form>
  );
}
