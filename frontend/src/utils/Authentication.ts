import client from "./FeathersClient";

export class Authentication {
  static async login(email: string, password: string) {

    console.log(email, password)
    const response = await client?.authenticate({
      strategy: "local",
      email,
      password,
    });

    return response;
  }

  static async logout() {
    return client?.logout();
  }

  static async reauthenticate() {
    return client?.reAuthenticate()
  }

  static isAuthenticated() {
    return client?.authentication?.authenticated
  }
}