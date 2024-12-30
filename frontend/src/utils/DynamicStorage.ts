class DynamicStorage {
  private storage: Storage | null = null;

  constructor() {
    this.checkRememberMe();
  }

  private checkRememberMe() {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe === "true") {
      this.useLocalStorage();
    } else {
      this.useSessionStorage();
    }
  }

  setItem(key: string, value: string) {
    if (this.storage) {
      this.storage.setItem(key, value);
    }
  }

  getItem(key: string): string | null {
    return this.storage ? this.storage.getItem(key) : null;
  }

  removeItem(key: string) {
    if (this.storage) {
      this.storage.removeItem(key);
    }
  }

  clear() {
    if (this.storage) {
      this.storage.clear();
    }
  }

  setRememberMe(value: boolean) {
    localStorage.setItem("rememberMe", String(value));
    this.checkRememberMe();
  }

  clearAll() {
    localStorage.clear();
    sessionStorage.clear();
  }

  useLocalStorage() {
    this.storage = localStorage;
  }

  useSessionStorage() {
    this.storage = sessionStorage;
  }
}

export const dynamicStorage = new DynamicStorage();
