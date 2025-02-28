export default interface UpdateMerchandiseRequest {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  inactive: boolean;
};