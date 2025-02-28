export default interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string; 
  repeatNewPassword: string;
};