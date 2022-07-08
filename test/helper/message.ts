import { addUser } from "../entity/user.mock";
import { addContact } from "../entity/contact.mock";
import { addProfile } from "../entity/profile.mock";
import { UserEntity } from "../../src/user/entity/user.entity";
import { ContactEntity } from "../../src/contact/entity/contact.entity";
import * as faker from "faker";

export const initializeDataset = async (): Promise<{
  user: UserEntity;
  contacts: ContactEntity[];
}> => {
  const user = await addUser();
  user.profile = await addProfile({
    userId: user.id,
    seriousMedicalIssues: false,
    mostRecentDiagnosis: null,
    lastHospitalVisit: null,
    emergencyEmailAndSms: true,
    locationAccess: true,
    automatedEmergency: false,
    readManual: false,
    location: faker.internet.url(),
  });
  const contacts = await Promise.all([
    addContact({
      userId: user.id,
      active: true,
    }),
    addContact({
      userId: user.id,
      active: false,
    }),
  ]);

  return {
    user,
    contacts,
  };
};
