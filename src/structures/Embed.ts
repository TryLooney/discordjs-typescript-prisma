import { EmbedBuilder } from '@discordjs/builders';
import { User } from 'discord.js';

export enum Type {
  Error = 1,
  Info = 2,
  Success = 3,
  Warn = 4,
}

export class ExtendedEmbedBuilder extends EmbedBuilder {
  setUser(user: User) {
    return this.setAuthor({
      name: user.username,
      iconURL: user.avatarURL() || undefined,
    });
  }

  setType(type: Type) {
    return this.setColor(
      type === 1
        ? 0xe34439
        : type === 2
        ? 0x397ae3
        : type === 3
        ? 0x39e369
        : type === 4
        ? 0xe3ca39
        : 0x000000
    );
  }
}
