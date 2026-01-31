import Button from "~/components/inputs/Button";
import TextInput from "~/components/inputs/TextInput";
import { SecretStorage } from "~/secret-storage";
import type { Route } from "./+types/relay";
import { useFetcher } from "react-router";
import { useToast } from "~/components/Toast";
import Toggle from "~/components/inputs/Toggle";
import { create } from "zustand";

type RelayConfig = {
  relayPublicKey: string;
  relayEndpoint: string;
  addressRange: string;
  privateKey: string;
  ipAddress: string;
};

type RelayStore = {
  storage: SecretStorage | null;
  config: RelayConfig | null;
  isConnected: boolean;
  load: (password: string) => Promise<RelayConfig>;
  save: (formData: FormData) => Promise<boolean>;
}

const useRelay = create<RelayStore>((set, get) => ({
  storage: null,
  config: null,
  isConnected: false,

  load: async (password) => {
    const storage = await SecretStorage.getOrInit(password);
    const config = (await storage.get<RelayConfig>(STORAGE_KEY)) as RelayConfig;
    set({ storage, config });
    return config;
  },

  save: async (formData) => {
    const { storage } = get();
    if (formData && storage) {
      const cfg = Object.fromEntries(formData.entries());
      await storage.insert(STORAGE_KEY, cfg);
      await storage.save();
      return true;
    }
    return false;
  },
}));

const STORAGE_KEY = "relay-config";
const password = "test";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const config = await useRelay.getState().load(password);
  return { config };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  if (formData) {
    const success = await useRelay.getState().save(formData);
    const showToast = useToast().show;
    if (success) {
      showToast("Saved", "success");
    } else {
      showToast("Failed to save settings", "error");
    }
    return success;
  }
}

export default function RelaySettings({ loaderData }: Route.ComponentProps) {
  const { config } = loaderData;
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post">
      <TextInput
        className="my-4"
        name="relayPublicKey"
        placeholder="Relay Public Key"
        value={config?.relayPublicKey}
      />
      <TextInput
        className="my-4"
        name="relayEndpoint"
        placeholder="Relay Endpoint"
        value={config?.relayEndpoint}
      />
      <TextInput
        className="my-4"
        name="addressRange"
        placeholder="Address Range"
        value={config?.addressRange}
      />
      <TextInput
        className="my-4"
        name="privateKey"
        placeholder="Private Key"
        value={config?.privateKey}
      />
      <TextInput
        className="my-4"
        name="ipAddress"
        placeholder="IP Address"
        value={config?.ipAddress}
      />
      <div className="flex justify-between">
        <Button type="submit" title="Save" />
        <div className="flex items-center">
          <label>Connect</label>
          <Toggle name="isConnected" className="ml-4" disabled={config == null} />
        </div>
      </div>
    </fetcher.Form>
  );
}
