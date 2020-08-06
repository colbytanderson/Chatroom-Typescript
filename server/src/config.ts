import fs from "fs";

const config: Config = JSON.parse(fs.readFileSync('./config.json').toString());

interface Config {
  oauth: {
    clientId: string,
    clientSecret: string,
    callback: string,
  },
  port: number,
}

export default config;
