const NOTIFICATIONS_KEY = "fraudguard_notifications";

// Fraud alerts are on by default; the choice is remembered in this browser.
export function getNotificationsEnabled(): boolean {
  try {
    return localStorage.getItem(NOTIFICATIONS_KEY) !== "false";
  } catch {
    return true;
  }
}

export function setNotificationsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, String(enabled));
  } catch {
    // Storage can be unavailable (private mode); the setting just won't persist.
  }
}