import { Permission } from './Permission';

export default interface LoginResponse {
  name: string,
  token: string,
  permissions: Permission[],
};