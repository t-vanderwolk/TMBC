import { useCallback, useMemo } from 'react';

export type AdminSettings = {
  inviteOnly: boolean;
  defaultMentorId: string;
  pinterestClientId: string;
  pinterestClientSecret: string;
  myRegistryMerchantId: string;
  affiliateNetwork: string;
};

const placeholderSettings: AdminSettings = {
  inviteOnly: true,
  defaultMentorId: 'm1',
  pinterestClientId: 'tm-pinterest-client',
  pinterestClientSecret: '••••••••',
  myRegistryMerchantId: 'MYREG-3220',
  affiliateNetwork: 'MacroPartner',
};

export const useAdminSettings = () => {
  const settings = useMemo(() => placeholderSettings, []);
  const refresh = useCallback(async () => placeholderSettings, []);
  const update = useCallback(async (payload: Partial<AdminSettings>) => {
    return { ...placeholderSettings, ...payload };
  }, []);

  return { settings, loading: false, error: null, refresh, update };
};
