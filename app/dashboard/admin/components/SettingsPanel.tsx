'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

import { useAdminSettings } from '@/hooks/useAdminSettings';

export default function SettingsPanel() {
  const { settings, loading, error, update } = useAdminSettings();
  const [localInviteOnly, setLocalInviteOnly] = useState(settings.inviteOnly);
  const [defaultMentor, setDefaultMentor] = useState(settings.defaultMentorId);
  const [pinterestId, setPinterestId] = useState(settings.pinterestClientId);
  const [pinterestSecret, setPinterestSecret] = useState(settings.pinterestClientSecret);
  const [merchantId, setMerchantId] = useState(settings.myRegistryMerchantId);
  const [affiliateNetwork, setAffiliateNetwork] = useState(settings.affiliateNetwork);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLocalInviteOnly(settings.inviteOnly);
    setDefaultMentor(settings.defaultMentorId);
    setPinterestId(settings.pinterestClientId);
    setPinterestSecret(settings.pinterestClientSecret);
    setMerchantId(settings.myRegistryMerchantId);
    setAffiliateNetwork(settings.affiliateNetwork);
  }, [settings]);

  const {
    inviteOnly: settingsInviteOnly,
    defaultMentorId: settingsDefaultMentorId,
    pinterestClientId: settingsPinterestClientId,
    pinterestClientSecret: settingsPinterestClientSecret,
    myRegistryMerchantId: settingsMyRegistryMerchantId,
    affiliateNetwork: settingsAffiliateNetwork,
  } = settings;

  const formReady = useMemo(
    () =>
      !loading &&
      (localInviteOnly !== settingsInviteOnly ||
        defaultMentor !== settingsDefaultMentorId ||
        pinterestId !== settingsPinterestClientId ||
        pinterestSecret !== settingsPinterestClientSecret ||
        merchantId !== settingsMyRegistryMerchantId ||
        affiliateNetwork !== settingsAffiliateNetwork),
    [
      affiliateNetwork,
      defaultMentor,
      localInviteOnly,
      merchantId,
      pinterestId,
      pinterestSecret,
      loading,
      settingsAffiliateNetwork,
      settingsDefaultMentorId,
      settingsInviteOnly,
      settingsMyRegistryMerchantId,
      settingsPinterestClientId,
      settingsPinterestClientSecret,
    ],
  );

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await update({
        inviteOnly: localInviteOnly,
        defaultMentorId: defaultMentor,
        pinterestClientId: pinterestId,
        pinterestClientSecret: pinterestSecret,
        myRegistryMerchantId: merchantId,
        affiliateNetwork,
      });
      setMessage('Saved credentials');
    } catch (err) {
      setMessage('Unable to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="space-y-5 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">System Settings</p>
          <h3 className="text-2xl font-serif text-tmCharcoal">Invite mode & credentials</h3>
        </div>
        <span className="text-xs text-tmCharcoal/60">{loading ? 'Refreshing…' : 'Live'}</span>
      </div>
      <div className="space-y-3">
        <label className="flex items-center gap-3 text-sm font-semibold text-tmCharcoal">
          <input
            type="checkbox"
            checked={localInviteOnly}
            onChange={(event) => setLocalInviteOnly(event.target.checked)}
            className="h-5 w-5 rounded border-tmBlush focus:ring-0"
          />
          Toggle invite-only access
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/60">
          Default mentor
          <input
            value={defaultMentor}
            onChange={(event) => setDefaultMentor(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/70 bg-tmIvory px-3 py-2 text-sm text-tmCharcoal focus:border-tmCharcoal focus:outline-none"
            placeholder="Mentor id"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/60">
          Affiliate network
          <input
            value={affiliateNetwork}
            onChange={(event) => setAffiliateNetwork(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/70 bg-tmIvory px-3 py-2 text-sm text-tmCharcoal focus:border-tmCharcoal focus:outline-none"
            placeholder="Network name"
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/60">
          Pinterest client ID
          <input
            value={pinterestId}
            onChange={(event) => setPinterestId(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/70 bg-tmIvory px-3 py-2 text-sm text-tmCharcoal focus:border-tmCharcoal focus:outline-none"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/60">
          Pinterest client secret
          <input
            value={pinterestSecret}
            onChange={(event) => setPinterestSecret(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/70 bg-tmIvory px-3 py-2 text-sm text-tmCharcoal focus:border-tmCharcoal focus:outline-none"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/60">
          MyRegistry merchant ID
          <input
            value={merchantId}
            onChange={(event) => setMerchantId(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/70 bg-tmIvory px-3 py-2 text-sm text-tmCharcoal focus:border-tmCharcoal focus:outline-none"
          />
        </label>
      </div>
      {message && <p className="text-xs text-tmCharcoal/60">{message}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={!formReady || saving}
          className="rounded-full border border-tmCharcoal/30 bg-tmCharcoal/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-tmCharcoal"
        >
          {saving ? 'Saving…' : 'Save & Push'}
        </button>
        <button
          type="button"
          onClick={() => update(settings)}
          className="rounded-full border border-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-tmCharcoal transition hover:bg-tmBlush/60"
        >
          Test Connection
        </button>
      </div>
    </form>
  );
}
