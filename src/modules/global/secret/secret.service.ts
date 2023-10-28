import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from 'src/types/env';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';

@Injectable()
export class SecretService {
  private readonly algorithm = 'aes-192-cbc';
  private key: Buffer;

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {
    const secretKey = this.configService.get('SECRET_KEY', {
      infer: true,
    });

    const secretSalt = this.configService.get('SECRET_SALT', {
      infer: true,
    });

    this.key = scryptSync(secretKey, secretSalt, 24);
  }

  encrypt(text: string): string {
    try {
      const iv = randomBytes(16);
      const cipher = createCipheriv(this.algorithm, this.key, iv);
      const encrypted = cipher.update(text, 'utf8', 'hex');
      return [
        encrypted + cipher.final('hex'),
        Buffer.from(iv).toString('hex'),
      ].join('|');
    } catch (error) {
      throw new Error('Can not encrypt');
    }
  }

  decrypt(encryptedText: string): string {
    try {
      const [encrypted, iv] = encryptedText.split('|');
      if (!iv) throw new Error('IV not found');
      if (!encrypted) throw new Error('Encrypted not found');

      const decipher = createDecipheriv(
        this.algorithm,
        this.key,
        Buffer.from(iv, 'hex'),
      );
      return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    } catch (error) {
      throw new Error('Can not decrypt');
    }
  }
}
