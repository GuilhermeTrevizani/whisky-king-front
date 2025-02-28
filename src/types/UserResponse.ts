export default interface UserResponse {
  id: string;
  name: string;
  login: string;
  accessGroups: string[];
  inactive: boolean;
};