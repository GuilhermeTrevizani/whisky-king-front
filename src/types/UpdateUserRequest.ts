export default interface UpdateUserRequest {
  id: string;
  name: string;
  login: string;
  accessGroups: string[];
  inactive: boolean;
};