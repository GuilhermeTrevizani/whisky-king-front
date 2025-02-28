export default interface PaginationResponse<T> {
  data: T[];
  recordsTotal: Number;
};