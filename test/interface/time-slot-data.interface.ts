import { DateImported } from 'aws-sdk/clients/transfer';

export interface ITimeSlotData {
  id?: number;
  active?: boolean;
  from?: Date;
  to?: Date;
  userId: string;
  days: {
    day: number;
  }[];
}
