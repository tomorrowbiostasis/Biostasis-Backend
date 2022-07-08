import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm"
import { decryptEntity, encryptEntity } from "../../common/helper/entity-encrypter";
import { ContactEntity } from "./contact.entity";

@EventSubscriber()
export class ContactEntitySubscriber implements EntitySubscriberInterface<ContactEntity> {
    private readonly encryptionColumns = [
        'email',
        'name',
        'surname',
        'prefix',
        'phone',
    ];

    listenTo() {
        return ContactEntity
    }

    beforeInsert(event: InsertEvent<ContactEntity>): void | Promise<any> {
        encryptEntity(event.entity, this.encryptionColumns);
    }

    beforeUpdate(event: UpdateEvent<ContactEntity>): void | Promise<any> {
        encryptEntity(event.entity, this.encryptionColumns);
    }

    afterLoad(entity: ContactEntity) {
        decryptEntity(entity, this.encryptionColumns);
    }
}