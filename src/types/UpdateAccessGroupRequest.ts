import { Permission } from './Permission';

export default interface UpdateAccessGroupRequest {
  id: string;
  name: string;
  permissions: Permission[];
  inactive: boolean;
};