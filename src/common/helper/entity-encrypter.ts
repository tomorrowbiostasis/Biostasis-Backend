import { Encrypter } from "./encrypter";

const falsyValues = [undefined, null, ''];

export const encryptEntity = (entity: any, columns: string[]) => {
    columns.forEach((column: string) => {
        if (!falsyValues.includes(entity[column])) {
            entity[column] = Encrypter.encrypt(`${entity[column]}`);
        }
    });
}

export const decryptEntity = (entity: any, columns: string[]) => {
    columns.forEach((column: string) => {
        if (!falsyValues.includes(entity[column])) {
            entity[column] = Encrypter.decrypt(entity[column]);
        }
    });
}