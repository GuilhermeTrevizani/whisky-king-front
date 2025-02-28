import axios from 'axios';
import PaginationRequest from '../types/PaginationRequest';
import PaginationResponse from '../types/PaginationResponse';
import AccessGroupPaginationResponse from '../types/AccessGroupPaginationResponse';
import LoginResponse from '../types/LoginResponse';
import ChangePasswordRequest from '../types/ChangePasswordRequest';
import UserPaginationResponse from '../types/UserPaginationResponse';
import UserResponse from '../types/UserResponse';
import CreateUserRequest from '../types/CreateUserRequest';
import UpdateUserRequest from '../types/UpdateUserRequest';
import CreateAccessGroupRequest from '../types/CreateAccessGroupRequest';
import UpdateAccessGroupRequest from '../types/UpdateAccessGroupRequest';
import PermissionResponse from '../types/PermissionResponse';
import AccessGroupResponse from '../types/AccessGroupResponse';
import CategoryPaginationResponse from '../types/CategoryPaginationResponse';
import CategoryResponse from '../types/CategoryResponse';
import CreateCategoryRequest from '../types/CreateCategoryRequest';
import UpdateCategoryRequest from '../types/UpdateCategoryRequest';
import MerchandisePaginationResponse from '../types/MerchandisePaginationResponse';
import MerchandiseResponse from '../types/MerchandiseResponse';
import CreateMerchandiseRequest from '../types/CreateMerchandiseRequest';
import UpdateMerchandiseRequest from '../types/UpdateMerchandiseRequest';
import PaymentMethodPaginationResponse from '../types/PaymentMethodPaginationResponse';
import PaymentMethodResponse from '../types/PaymentMethodResponse';
import CreatePaymentMethodRequest from '../types/CreatePaymentMethodRequest';
import UpdatePaymentMethodRequest from '../types/UpdatePaymentMethodRequest';
import SalePaginationResponse from '../types/SalePaginationResponse';
import SaleInvoiceResponse from '../types/SaleInvoiceResponse';
import { CreateSaleRequest } from '../types/CreateSaleRequest';
import ShiftResponse from '../types/ShiftResponse';
import ChartResponse from '../types/ChatResponse';

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

api.interceptors.request.use(
  (config) => {
    //nprogress.start();
    const token = localStorage.getItem('TOKEN');
    if (token)
      config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    //nprogress.done();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    //nprogress.done();
    return response;
  },
  (error) => {
    //nprogress.done();
    if (!error?.response)
      return Promise.reject('No connection with server.');

    if (error.response.status == 400)
      return Promise.reject(error.response.data.errors.join('<br/>'));

    if (error.response.status === 403)
      return Promise.reject('No authorized.'); // TODO: Retornar para o /home

    if (error.response.status === 401) {
      localStorage.clear();
      document.location.reload();
      return Promise.reject('No authenticated.');
    }

    return Promise.reject(`${error.response.status} - ${error.response.statusText}`);
  },
);

export const useApi = () => ({
  login: async (login: string, password: string) => {
    const response = await api.post<LoginResponse>('/users/login', { login, password });
    return response.data;
  },
  changePassword: async (request: ChangePasswordRequest) => {
    await api.put('/users/change-password', request);
  },
  getUserByPagination: async (request: PaginationRequest) => {
    const response = await api.get<PaginationResponse<UserPaginationResponse>>('/users/pagination', { params: request });
    return response.data;
  },
  getUserById: async (id: string) => {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.data;
  },
  createUser: async (request: CreateUserRequest) => {
    const response = await api.post<string>('/users', request);
    return response.data;
  },
  updateUser: async (request: UpdateUserRequest) => {
    await api.put('/users', request);
  },
  getPermissions: async () => {
    const response = await api.get<PermissionResponse[]>('/permissions');
    return response.data;
  },
  getAccessGroupsByPagination: async (request: PaginationRequest) => {
    const response = await api.get<PaginationResponse<AccessGroupPaginationResponse>>('/access-groups/pagination', { params: request });
    return response.data;
  },
  getAccessGroupById: async (id: string) => {
    const response = await api.get<AccessGroupResponse>(`/access-groups/${id}`);
    return response.data;
  },
  createAccessGroup: async (request: CreateAccessGroupRequest) => {
    const response = await api.post<string>('/access-groups', request);
    return response.data;
  },
  updateAccessGroup: async (request: UpdateAccessGroupRequest) => {
    await api.put('/access-groups', request);
  },
  getCategoriesByPagination: async (request: PaginationRequest) => {
    const response = await api.get<PaginationResponse<CategoryPaginationResponse>>('/categories/pagination', { params: request });
    return response.data;
  },
  getCategoryById: async (id: string) => {
    const response = await api.get<CategoryResponse>(`/categories/${id}`);
    return response.data;
  },
  createCategory: async (request: CreateCategoryRequest) => {
    const response = await api.post<string>('/categories', request);
    return response.data;
  },
  updateCategory: async (request: UpdateCategoryRequest) => {
    await api.put('/categories', request);
  },
  getMerchandisesByPagination: async (request: PaginationRequest) => {
    const response = await api.get<PaginationResponse<MerchandisePaginationResponse>>('/merchandises/pagination', { params: request });
    return response.data;
  },
  getMerchandiseById: async (id: string) => {
    const response = await api.get<MerchandiseResponse>(`/merchandises/${id}`);
    return response.data;
  },
  createMerchandise: async (request: CreateMerchandiseRequest) => {
    const response = await api.post<string>('/merchandises', request);
    return response.data;
  },
  updateMerchandise: async (request: UpdateMerchandiseRequest) => {
    await api.put('/merchandises', request);
  },
  getPaymentMethodsByPagination: async (request: PaginationRequest) => {
    const response = await api.get<PaginationResponse<PaymentMethodPaginationResponse>>('/payment-methods/pagination', { params: request });
    return response.data;
  },
  getPaymentMethodById: async (id: string) => {
    const response = await api.get<PaymentMethodResponse>(`/payment-methods/${id}`);
    return response.data;
  },
  createPaymentMethod: async (request: CreatePaymentMethodRequest) => {
    const response = await api.post<string>('/payment-methods', request);
    return response.data;
  },
  updatePaymentMethod: async (request: UpdatePaymentMethodRequest) => {
    await api.put('/payment-methods', request);
  },
  getSalesByPagination: async (request: PaginationRequest) => {
    const response = await api.get<PaginationResponse<SalePaginationResponse>>('/sales/pagination', { params: request });
    return response.data;
  },
  getSaleInvoiceById: async (id: string) => {
    const response = await api.get<SaleInvoiceResponse>(`/sales/invoice/${id}`);
    return response.data;
  },
  createSale: async (request: CreateSaleRequest) => {
    const response = await api.post<string>('/sales', request);
    return response.data;
  },
  getCurrentShift: async () => {
    const response = await api.get<ShiftResponse>('/shifts/current');
    return response.data;
  },
  getShifts: async () => {
    const response = await api.get<ShiftResponse[]>('/shifts');
    return response.data;
  },
  startShift: async () => {
    const response = await api.post<ShiftResponse>('/shifts/start');
    return response.data;
  },
  endShift: async () => {
    await api.put<ShiftResponse>('/shifts/end');
  },
  get10CategoriesBestSellers: async (shiftId?: string) => {
    const response = await api.get<ChartResponse[]>(`/categories/10-best-sellers?shiftId=${shiftId}`);
    return response.data;
  },
  get10MerchandisesBestSellers: async (shiftId?: string) => {
    const response = await api.get<ChartResponse[]>(`/merchandises/10-best-sellers?shiftId=${shiftId}`);
    return response.data;
  },
  get10PaymentMethodMostUsed: async (shiftId?: string) => {
    const response = await api.get<ChartResponse[]>(`/payment-methods/10-most-used?shiftId=${shiftId}`);
    return response.data;
  },
});