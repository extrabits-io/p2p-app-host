import Button from "~/components/inputs/Button";
import TextInput from "~/components/inputs/TextInput";
import { SecretStorage } from "~/secret-storage";
import type { Route } from "./+types/relay";
import { useFetcher } from "react-router";
import { useToast } from "~/components/Toast";

type RelayConfig = {
  relayPublicKey: string;
  relayEndpoint: string;
  addressRange: string;
  privateKey: string;
  ipAddress: string;
};

const STORAGE_KEY = "relay-config";
const password = "test";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const storage = await SecretStorage.getOrInit(password);
  const config = (await storage.get<RelayConfig>(STORAGE_KEY)) as RelayConfig;
  return { storage, config };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const storage = await SecretStorage.getOrInit(password);
  if (formData && storage) {
    const cfg = Object.fromEntries(formData.entries()) as RelayConfig;
    await storage.insert(STORAGE_KEY, cfg);
    await storage.save();
    useToast.getState().show("Saved", "success");
    return true;
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
      <Button type="submit" title="Save" />
    </fetcher.Form>
  );
}
