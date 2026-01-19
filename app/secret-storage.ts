import { Client, Stronghold } from "@tauri-apps/plugin-stronghold";
import { appDataDir } from "@tauri-apps/api/path";

export class SecretStorage {
  private static instance: SecretStorage;

  protected constructor(
    private client: Client,
    private stronghold: Stronghold,
  ) {}

  static async getOrInit(password: string) {
    if (!this.instance) {
      const vaultPath = `${await appDataDir()}/vault.hold`;
      const stronghold = await Stronghold.load(vaultPath, password);

      let client: Client;
      const clientName = "p2p-app-host";
      try {
        client = await stronghold.loadClient(clientName);
      } catch (e) {
        console.error("Error loading stronghold", e);
        client = await stronghold.createClient(clientName);
      }

      this.instance = new SecretStorage(client, stronghold);
    }

    return this.instance;
  }

  async insert<T>(key: string, value: T) {
    const s = JSON.stringify(value);
    const data = Array.from(new TextEncoder().encode(s));
    await this.client.getStore().insert(key, data);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.getStore().get(key);
    if (data) {
      const s = new TextDecoder().decode(new Uint8Array(data));
      return JSON.parse(s);
    }
    return null;
  }

  async save() {
    await this.stronghold.save();
  }

  async remove(key: string) {
    await this.client.getStore().remove(key);
  }
}
