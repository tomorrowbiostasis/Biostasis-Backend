import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm"
import { decryptEntity, encryptEntity } from "../../common/helper/entity-encrypter";
import { ProfileEntity } from "./profile.entity"

@EventSubscriber()
export class ProfileEntitySubscriber implements EntitySubscriberInterface<ProfileEntity> {
    private readonly encryptionColumns = [
        'name',
        'surname',
        'prefix',
        'phone',
        'address',
        'dateOfBirth',
        'primaryPhysician',
        'primaryPhysicianAddress',
        'seriousMedicalIssues',
        'mostRecentDiagnosis',
        'lastHospitalVisit',
        'emergencyMessage',
        'location',
    ];

    listenTo() {
        return ProfileEntity
    }

    beforeInsert(event: InsertEvent<ProfileEntity>): void | Promise<any> {
        encryptEntity(event.entity, this.encryptionColumns);
    }

    beforeUpdate(event: UpdateEvent<ProfileEntity>): void | Promise<any> {
        encryptEntity(event.entity, this.encryptionColumns);
    }

    afterLoad(entity: ProfileEntity) {
        decryptEntity(entity, this.encryptionColumns);

        const seriousMedicalIssues = (entity.seriousMedicalIssues as any);

        entity.seriousMedicalIssues = seriousMedicalIssues == 1 || seriousMedicalIssues == 'true';
        entity.prefix = parseInt(`${entity.prefix}`) || null;
        entity.lastHospitalVisit = entity.lastHospitalVisit ? new Date(entity.lastHospitalVisit) : null;
        entity.dateOfBirth = entity.dateOfBirth ? new Date(entity.dateOfBirth) : null;
    }
}