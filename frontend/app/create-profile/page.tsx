"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Auth } from "@/lib/auth";
import { inviteFlowApi } from "@/lib/api";

const CreateProfilePage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [form, setForm] = useState({
    password: "",
    city: "",
    dueDate: "",
    partner: "",
    experience: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField =
    (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    setError("");
    try {
      setLoading(true);
      const response = await inviteFlowApi.createProfile({
        token,
        password: form.password,
        city: form.city || undefined,
        dueDate: form.dueDate || undefined,
        partner: form.partner || undefined,
        experience: form.experience || undefined,
      });

      const jwt = response.data?.token;
      const user = response.data?.user;

      if (jwt) {
        Auth.save(jwt);
      }

      if (user && typeof window !== "undefined") {
        localStorage.setItem("tm_user", JSON.stringify(user));
      }

      router.push("/dashboard");
    } catch (err: any) {
      const message = err?.response?.data?.error || "Unable to complete your profile";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="onboarding">
        <div className="max-w-lg mx-auto p-10 space-y-4 text-center">
          <h1 className="font-serif text-3xl text-[#3E2F35]">Token missing</h1>
          <p className="text-sm text-[#3E2F35]/80">
            We&apos;re missing the verification token. Head back to the verification page and enter the code from your email.
          </p>
          <Link href="/verify" className="btn-primary inline-flex justify-center">
            Verify invitation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding">
      <div className="max-w-lg mx-auto p-10 space-y-6">
        <h1 className="font-serif text-3xl text-[#3E2F35]">Create Your Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={updateField("password")}
            required
          />
          <input className="input" placeholder="City" value={form.city} onChange={updateField("city")} />
          <input className="input" type="date" placeholder="Due date" value={form.dueDate} onChange={updateField("dueDate")} />
          <input className="input" placeholder="Partner name" value={form.partner} onChange={updateField("partner")} />
          <input className="input" placeholder="Experience / notes" value={form.experience} onChange={updateField("experience")} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="btn-primary w-full text-center" type="submit" disabled={loading}>
            {loading ? "Completing profile..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfilePage;
