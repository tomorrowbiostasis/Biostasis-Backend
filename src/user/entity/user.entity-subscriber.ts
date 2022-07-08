import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm"
import { decryptEntity, encryptEntity } from "../../common/helper/entity-encrypter";
import { UserEntity } from "./user.entity";

@EventSubscriber()
export class UserEntitySubscriber implements EntitySubscriberInterface<UserEntity> {
    private readonly encryptionColumns = ['email'];

    listenTo() {
        return UserEntity
    }

    beforeInsert(event: InsertEvent<UserEntity>): void | Promise<any> {
        encryptEntity(event.entity, this.encryptionColumns);
    }

    beforeUpdate(event: UpdateEvent<UserEntity>): void | Promise<any> {
        encryptEntity(event.entity, this.encryptionColumns);
    }

    afterLoad(entity: UserEntity) {
        decryptEntity(entity, this.encryptionColumns);
    }
}