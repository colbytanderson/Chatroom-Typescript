import { Claims, Client, Issuer } from "openid-client";

export class GoogleAuth {

  static async create(options: {
    clientSecret: string;
    clientId: string;
    callbackUrl: string;
  }): Promise<GoogleAuth> {
    const issuer = await Issuer.discover('https://accounts.google.com');
    const client = new issuer.Client({
      client_id: options.clientId,
      client_secret: options.clientSecret,
    });
    return new GoogleAuth(client, options.callbackUrl);
  }

  constructor(
    private readonly client: Client,
    private readonly callback: string
  ) { }

  getAuthUrl(scope: string): string {
    return this.client.authorizationUrl({
      redirect_uri: this.callback,
      scope,
    });
  }

  async getInfo(queryParam: {}): Promise<Claims> {
    const tokenset = await this.client.authorizationCallback(this.callback, queryParam);
    return tokenset.claims;
  }

}
