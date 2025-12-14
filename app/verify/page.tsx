"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { inviteFlowApi } from "@/lib/api";

const VerifyPage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState(params.get("code") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      setLoading(true);
      const response = await inviteFlowApi.verifyInvite({ email, code });
      const token = response.data?.token;
      if (!token) throw new Error("Invite verification failed");
      router.push(`/create-profile?token=${encodeURIComponent(token)}`);
    } catch (err: any) {
      const message = err?.response?.data?.error || "Invalid email or invite code";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding">
      <div className="max-w-md mx-auto p-10 space-y-6">
        <h1 className="font-serif text-3xl text-[#3E2F35]">Verify Your Invitation</h1>

        <form onSubmit={submit} className="space-y-4">
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Invite code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="btn-primary w-full text-center" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
