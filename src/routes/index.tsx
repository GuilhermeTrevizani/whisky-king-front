import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './../pages/LoginPage';
import HomePage from './../pages/HomePage';
import ChangePasswordPage from './../pages/ChangePasswordPage';
import AccessGroupPage from './../pages/AccessGroupPage';
import UsersPage from '../pages/UsersPage';
import useAuth from '../hooks/useAuth';
import UserPage from '../pages/UserPage';
import AccessGroupsPage from './../pages/AccessGroupsPage';
import CategoriesPage from './../pages/CategoriesPage';
import CategoryPage from './../pages/CategoryPage';
import MerchandisesPage from './../pages/MerchandisesPage';
import MerchandisePage from './../pages/MerchandisePage';
import PaymentMethodsPage from './../pages/PaymentMethodsPage';
import PaymentMethodPage from './../pages/PaymentMethodPage';
import SalesPage from './../pages/SalesPage';
import SalePage from './../pages/SalePage';
import SaleInvoicePage from './../pages/SaleInvoicePage';
import { Permission } from '../types/Permission';
import { type ReactElement } from 'react';

const RequireAuth = ({ children, permission }: { children: ReactElement, permission?: Permission }) => {
  const { user, loading } = useAuth();

  if (loading)
    return <div>...</div>;

  if (!user)
    return <Navigate to="/login" />

  if (permission !== undefined && !user.permissions.includes(permission))
    return <Navigate to="/" />

  return children;
};

const RequireNonAuth = ({ children }: { children: ReactElement }) => {
  const { user, loading } = useAuth();

  if (loading)
    return <div>...</div>;

  if (user)
    return <Navigate to="/" />

  return children;
};

const RoutesApp = () => {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route path='/login' element={<RequireNonAuth><LoginPage /></RequireNonAuth>}></Route>
      <Route path='/' element={<RequireAuth><HomePage /></RequireAuth>}></Route>
      <Route path='/change-password' element={<RequireAuth><ChangePasswordPage /></RequireAuth>}></Route>
      <Route path='/access-groups' element={<RequireAuth permission={Permission.ViewAccessGroups}><AccessGroupsPage /></RequireAuth>}></Route>
      <Route path='/access-group' element={<RequireAuth permission={Permission.ViewAccessGroups}><AccessGroupPage /></RequireAuth>}></Route>
      <Route path='/access-group/:id' element={<RequireAuth permission={Permission.ViewAccessGroups}><AccessGroupPage /></RequireAuth>}></Route>
      <Route path='/users' element={<RequireAuth permission={Permission.ViewUsers}><UsersPage /></RequireAuth>}></Route>
      <Route path='/user' element={<RequireAuth permission={Permission.ViewUsers}><UserPage /></RequireAuth>}></Route>
      <Route path='/user/:id' element={<RequireAuth permission={Permission.ViewUsers}><UserPage /></RequireAuth>}></Route>
      <Route path='/categories' element={<RequireAuth permission={Permission.ViewCategories}><CategoriesPage /></RequireAuth>}></Route>
      <Route path='/category' element={<RequireAuth permission={Permission.ViewCategories}><CategoryPage /></RequireAuth>}></Route>
      <Route path='/category/:id' element={<RequireAuth permission={Permission.ViewCategories}><CategoryPage /></RequireAuth>}></Route>
      <Route path='/merchandises' element={<RequireAuth permission={Permission.ViewMerchandises}><MerchandisesPage /></RequireAuth>}></Route>
      <Route path='/merchandise' element={<RequireAuth permission={Permission.ViewMerchandises}><MerchandisePage /></RequireAuth>}></Route>
      <Route path='/merchandise/:id' element={<RequireAuth permission={Permission.ViewMerchandises}><MerchandisePage /></RequireAuth>}></Route>
      <Route path='/payment-methods' element={<RequireAuth permission={Permission.ViewPaymentMethods}><PaymentMethodsPage /></RequireAuth>}></Route>
      <Route path='/payment-method' element={<RequireAuth permission={Permission.ViewPaymentMethods}><PaymentMethodPage /></RequireAuth>}></Route>
      <Route path='/payment-method/:id' element={<RequireAuth permission={Permission.ViewPaymentMethods}><PaymentMethodPage /></RequireAuth>}></Route>
      <Route path='/sales' element={<RequireAuth permission={Permission.ViewSales}><SalesPage /></RequireAuth>}></Route>
      <Route path='/sale' element={<RequireAuth permission={Permission.ManageSales}><SalePage /></RequireAuth>}></Route>
      <Route path='/sale/invoice/:id' element={<RequireAuth permission={Permission.ViewSales}><SaleInvoicePage /></RequireAuth>}></Route>
    </Routes>
  );
};

export default RoutesApp;