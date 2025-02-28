export default interface MerchandisePaginationResponse {
  id: string;
  name: string;
  price: number;
  inactive: boolean;
  registerDate: Date;
  categoryId: string;
};