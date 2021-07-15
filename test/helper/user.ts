import { addUser } from '../entity/user.mock';
import { addProfile } from '../entity/profile.mock';
import { UserEntity } from '../../src/user/entity/user.entity';

export const initializeDataset = async (): Promise<{
  user: UserEntity;
}> => {
  const user = await addUser();
  user.profile = await addProfile({
    userId: user.id,
    seriousMedicalIssues: true,
    mostRecentDiagnosis: null,
    lastHospitalVisit: null,
  });

  return {
    user,
  };
};
