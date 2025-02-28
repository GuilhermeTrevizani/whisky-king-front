export interface CreateSaleRequest {
  merchandises: CreateSaleRequestMerchandise[];
  paymentMethods: CreateSaleRequestPaymentMethod[];
};

export interface CreateSaleRequestMerchandise {
  merchandiseId: string;
  quantity: number;
  detail?: string;
  discount: number;
}

export interface CreateSaleRequestPaymentMethod {
  paymentMethodId: string;
  value: number;
}