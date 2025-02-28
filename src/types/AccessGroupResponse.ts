import { Permission } from './Permission';

export default interface AccessGroupResponse {
  id: string;
  name: string;
  permissions: Permission[];
  inactive: boolean;
};