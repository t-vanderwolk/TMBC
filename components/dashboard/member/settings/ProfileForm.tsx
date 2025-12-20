"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { updateProfileInfo, uploadProfileImage } from "@/app/dashboard/settings/actions";

type ProfileFormProps = {
  user: {
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  profileImage?: string | null;
};

export default function ProfileForm({ user, profileImage }: ProfileFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [imageMessage, setImageMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(profileImage ?? null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setError(null);
    const formData = new FormData(event.currentTarget);

    try {
      await updateProfileInfo(formData);
      setStatus("saved");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to save your profile.");
    }
  };

  const handleImageUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setImageMessage("Uploading…");
    const formData = new FormData(event.currentTarget);
    try {
      const imageUrl = await uploadProfileImage(formData);
      setImageMessage("Profile image updated.");
      setImagePreview(imageUrl);
      router.refresh();
    } catch (err) {
      setImageMessage(err instanceof Error ? err.message : "Unable to upload image.");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <form
        onSubmit={handleSubmit}
        className="md:col-span-2 space-y-4 rounded-3xl border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_30px_90px_rgba(189,147,189,0.25)]"
      >
        <div className="space-y-1">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">First name</p>
          <input
            name="firstName"
            defaultValue={user.firstName ?? ""}
            placeholder="First name"
            className="w-full rounded-2xl border border-[#E3D0D7] px-4 py-3 text-sm"
          />
        </div>

        <div className="space-y-1">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Last name</p>
          <input
            name="lastName"
            defaultValue={user.lastName ?? ""}
            placeholder="Last name"
            className="w-full rounded-2xl border border-[#E3D0D7] px-4 py-3 text-sm"
          />
        </div>

        <div className="space-y-1">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Email</p>
          <input
            name="email"
            type="email"
            required
            defaultValue={user.email}
            className="w-full rounded-2xl border border-[#E3D0D7] px-4 py-3 text-sm"
          />
          <p className="text-xs text-[#3E2F35]/70">
            Changing your email updates your member login and notifies your mentor. This does not reset onboarding.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Save profile</p>
          <button
            type="submit"
            className="rounded-full bg-[#C29EB3] px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white"
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
        </div>

        {status === "saved" && <p className="text-xs text-emerald-600">Profile updated.</p>}
        {status === "error" && <p className="text-xs text-rose-600">{error}</p>}
      </form>

      <section className="space-y-3 rounded-3xl border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_30px_90px_rgba(189,147,189,0.25)]">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Profile image</p>
        {imagePreview ? (
          <div className="h-32 w-32 overflow-hidden rounded-2xl border border-[#E3D0D7]">
            <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
          </div>
        ) : (
          <p className="text-xs text-[#3E2F35]/60">No image yet</p>
        )}
        <form onSubmit={handleImageUpload} encType="multipart/form-data" className="space-y-2">
          <input
            type="file"
            name="image"
            accept="image/*"
            className="text-[0.75rem] text-[#3E2F35]/80"
          />
          <button
            type="submit"
            className="rounded-full border border-[#E3D0D7] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35]"
          >
            Upload
          </button>
        </form>
        {imageMessage && <p className="text-xs text-[#3E2F35]/70">{imageMessage}</p>}
        <p className="text-xs text-[#3E2F35]/70">
          This will not remove registry items. Mentors may see your updated profile picture.
        </p>
      </section>
    </div>
  );
}
