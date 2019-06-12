interface Env {
  giphy_api_key: string;
}

let env: Env = null;

export async function getEnv(): Promise<Env> {
  if (!env) {
    env = await import("../env.json");
  }

  return env;
}
