import { useSyncExternalStore } from "react";
import { checkHealth } from "@/services/api";

export type ApiStatusValue = "checking" | "connected" | "offline";

// One shared status for the whole app, so the sidebar and the dashboard
// banner always agree with each other.
let status: ApiStatusValue = "checking";
const listeners = new Set<() => void>();
let inFlight: Promise<void> | null = null;
let timer: ReturnType<typeof setInterval> | null = null;

function setStatus(next: ApiStatusValue) {
  if (next !== status) {
    status = next;
    listeners.forEach((listener) => listener());
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function refreshApiStatus(showChecking = true): Promise<void> {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    if (showChecking) setStatus("checking");

    let ok = await checkHealth();

    // The free hosting plan puts the backend to sleep; give it time to wake up.
    for (let attempt = 0; !ok && attempt < 2; attempt++) {
      await wait(4000);
      ok = await checkHealth();
    }

    setStatus(ok ? "connected" : "offline");
  })().finally(() => {
    inFlight = null;
  });

  return inFlight;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (listeners.size === 1) {
    refreshApiStatus(true);
    timer = setInterval(() => refreshApiStatus(false), 30000);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot(): ApiStatusValue {
  return status;
}

export function useApiStatus() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { status: current, refresh: () => refreshApiStatus(true) };
}