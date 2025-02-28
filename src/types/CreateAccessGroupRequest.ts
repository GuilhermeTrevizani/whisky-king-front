import { Permission } from './Permission';

export default interface CreateAccessGroupRequest {
  name: string;
  permissions: Permission[];
};