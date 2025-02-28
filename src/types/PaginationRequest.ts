export default interface PaginationRequest {
  search?: string;
  skip?: Number;
  take: Number;
  orderColumn?: string;
  orderDescending?: boolean;
  onlyActive?: boolean;
};