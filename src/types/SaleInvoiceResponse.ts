export default interface SaleInvoiceResponse {
  id: string;
  registerDate: Date;
  amount: number;
  merchandises: SaleInvoiceResponseMerchandise[];
  paymentMethods: SaleInvoiceResponsePaymentMethod[];
};

export interface SaleInvoiceResponseMerchandise {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  detail?: string;
  discount: number;
}

export interface SaleInvoiceResponsePaymentMethod {
  name: string;
  value: number;
}