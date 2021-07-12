import { SetMetadata } from '@nestjs/common';

export const Roles = (args: number[]) => SetMetadata('roles', args);
