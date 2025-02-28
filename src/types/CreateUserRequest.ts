export default interface CreateUserRequest {
  name: string;
  login: string;
  accessGroups: string[];
};