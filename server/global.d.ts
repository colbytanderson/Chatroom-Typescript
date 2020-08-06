declare module 'openid-client' {

  interface ClientOptions {
    client_id: string;
    client_secret: string;
  }

  interface AuthorizationOptions {
    redirect_uri: string;
    scope: string;
  }

  interface Claims {
    sub: string;
    email?: string; // may not be unique
    name?: string;
    picture?: string;
    email_verified?: boolean;
  }

  interface TokenSet {
    claims: Claims;
  }

  class Client {
    constructor(opts: ClientOptions)

    authorizationUrl(opts: AuthorizationOptions): string;
    authorizationCallback(callback: string, query: {}): Promise<TokenSet>;
  }

  interface Issuer {
    Client: typeof Client;
  }

  let Issuer: {
    discover(url: string): Promise<Issuer>;
  };

}
