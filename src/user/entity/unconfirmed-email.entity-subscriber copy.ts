import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm"
import { decryptEntity, encryptEntity } from "../../common/helper/entity-encrypter";
import { UnconfirmedEmailEntity } from "./unconfirmed_email.entity";

@EventSubscriber()
export class UnconfirmedEmailEntitySubscriber implements EntitySubscriberInterface<UnconfirmedEmailEntity> {
    private readonly encryptionColumns = ['email'];

    listenTo() {
        return UnconfirmedEmailEntity
    }

    beforeInsert(event: InsertEvent<UnconfirmedEmailEntity>): void | Promise<any> {
        encryptEntity(event.entity, this.encryptionColumns);
    }

    beforeUpdate(event: UpdateEvent<UnconfirmedEmailEntity>): void | Promise<any> {
        encryptEntity(event.entity, this.encryptionColumns);
    }

    afterLoad(entity: UnconfirmedEmailEntity) {
        decryptEntity(entity, this.encryptionColumns);
    }
}