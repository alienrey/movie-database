class CustomStorage {
    getItem(key: string) {
      return window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
    }
  
    setItem(key: string, value: string, rememberMe: boolean) {
      if (rememberMe) {
        window.localStorage.setItem(key, value);
      } else {
        window.sessionStorage.setItem(key, value);
      }
    }
  
    removeItem(key: string) {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    }
  }
  
export const storage = new CustomStorage();