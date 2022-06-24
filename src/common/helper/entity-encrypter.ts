import { Encrypter } from "./encrypter";

export const encryptEntity = (entity: any, columns: string[]) => {
    columns.forEach((column: string) => {
        entity[column] = Encrypter.encrypt(`${entity[column]}`);
    });
}

export const decryptEntity = (entity: any, columns: string[]) => {
    columns.forEach((column: string) => {
        entity[column] = Encrypter.decrypt(entity[column]);
    });
}