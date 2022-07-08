import * as crypto from 'crypto';
import configuration from '../../config/default';

export class Encrypter {
    private static readonly algorithm = 'aes-256-ctr';

    static encrypt(text: string, secretKey?: string, iv?: string): string {
        if (!text) return null;

        const cipher = crypto.createCipheriv(
            Encrypter.algorithm,
            secretKey || configuration()?.application?.encryptionKey,
            Buffer.from(iv || configuration()?.application?.encryptionIv, 'hex'),
        );

        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return encrypted.toString('hex');
    }

    static decrypt(hash: string, secretKey?: string, iv?: string): string {
        if (!hash) return null;

        const decipher = crypto.createDecipheriv(
            Encrypter.algorithm,
            secretKey || configuration()?.application?.encryptionKey,
            Buffer.from(iv || configuration()?.application?.encryptionIv, 'hex'),
        );

        const decrpyted = Buffer.concat([
            decipher.update(Buffer.from(hash, 'hex')),
            decipher.final(),
        ]);

        return decrpyted.toString();
    }
}
