export default interface CategoryPaginationResponse {
  id: string;
  name: string;
  inactive: boolean;
  registerDate: Date;
  details: string[];
};