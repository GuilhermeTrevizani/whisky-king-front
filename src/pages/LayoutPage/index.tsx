import React, { type ReactElement } from 'react';
import { Layout, Menu, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import type { MenuProps } from 'antd';
import { Permission } from '../../types/Permission';
import {
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  UnorderedListOutlined,
  DropboxOutlined,
  CreditCardOutlined,
  ShoppingCartOutlined,
  LockOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  key: string,
  label: string,
  icon: React.ReactNode,
) => {
  return {
    key,
    icon,
    label,
  } as MenuItem;
}

function LayoutPage({ children }: { children: ReactElement }) {
  const { token: { colorBgContainer } } = theme.useToken();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'exit') {
      logout();
      navigate('/login');
      return;
    }

    navigate(`/${e.key}`);
  };

  const items: MenuItem[] = [
    getItem('', t('home'), <HomeOutlined />),
  ];

  if (user?.permissions.includes(Permission.ViewAccessGroups))
    items.push(getItem('accessgroups', t('accessGroups'), <TeamOutlined />));

  if (user?.permissions.includes(Permission.ViewUsers))
    items.push(getItem('users', t('users'), <UserOutlined />));

  if (user?.permissions.includes(Permission.ViewCategories))
    items.push(getItem('categories', t('categories'), <UnorderedListOutlined />));

  if (user?.permissions.includes(Permission.ViewMerchandises))
    items.push(getItem('merchandises', t('merchandises'), <DropboxOutlined />));

  if (user?.permissions.includes(Permission.ViewPaymentMethods))
    items.push(getItem('paymentmethods', t('paymentMethods'), <CreditCardOutlined />));

  if (user?.permissions.includes(Permission.ViewSales))
    items.push(getItem('sales', t('sales'), <ShoppingCartOutlined />));

  items.push(getItem('changepassword', t('changePassword'), <LockOutlined />));
  items.push(getItem('exit', t('exit'), <LogoutOutlined />));

  const routesItems: Record<string, string> = {
    'category': 'categories',
  };

  const currentRoute = location.pathname.replace('/', '').split('/')[0];
  const selectedItem = items.find(x => x?.key?.toString().startsWith(currentRoute) || x?.key == currentRoute || x?.key == routesItems[currentRoute])?.key?.toString() ?? '';

  return (
    <>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Sider collapsible>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedItem]}
            items={items}
            onClick={onClick}
          />
        </Sider>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content" style={{ background: colorBgContainer, padding: 10, margin: '10px 0' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </>
  );
}

export default LayoutPage;