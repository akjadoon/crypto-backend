import { channel } from 'diagnostics_channel';
import {Client, Intents, TextChannel} from 'discord.js'
import config from './config';

enum Channels {
    ath
}

export class Discord {
    private client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    constructor(){
        this.client.on("ready", async () => {
            console.log(`Logged in as ${this.client?.user?.tag}!`)
          })
          
        this.client.on("message", msg => {
            if (msg.content === "ping") {
                msg.reply("pong");
            }
        })
        this.client.login(config.discord.token);
    }

    async msgChannel(name: string, msg: string) {
        (this.client.channels.cache.find(
            (channel) => (channel as TextChannel).name === name
        ) as TextChannel).send(msg);
    }
}