import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks/useApi';
import { useEffect, useState } from 'react';
import { Table, Button, Row, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import type CategoryPaginationResponse from '../../types/CategoryPaginationResponse';
import { type ColumnsType } from 'antd/es/table';
import LayoutPage from '../LayoutPage';
import useAuth from '../../hooks/useAuth';
import { Permission } from '../../types/Permission';
import { useNotification } from '../../hooks/useNotification';

const CategoriesPage = () => {
  const { t } = useTranslation();
  const api = useApi();
  const [categories, setCategories] = useState<CategoryPaginationResponse[]>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const notification = useNotification();

  const columns: ColumnsType<CategoryPaginationResponse> = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <a onClick={() => navigate(`/category/${id}`)}>{id}</a>,
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('registerDate'),
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (registerDate: string) => moment(registerDate).format('DD/MM/yyyy HH:mm:ss'),
    },
    {
      title: t('status'),
      dataIndex: 'inactive',
      key: 'inactive',
      render: (inactive: boolean) => <Tag color={inactive ? 'red' : 'green'}>{inactive ? t('inactive') : t('active')}</Tag>,
    },
  ];

  useEffect(() => {
    setLoading(true);
    api.getCategoriesByPagination({ take: 1000, orderColumn: 'registerDate', orderDescending: true })
      .then(res => {
        setCategories(res.data);
      })
      .catch((ex) => {
        notification.alert('error', ex);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <LayoutPage>
      <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
        {user?.permissions.includes(Permission.ManageCategories) &&
          <Row itemType='flex' justify='end' align='middle'>
            <Button type='primary' onClick={() => navigate('/category')}>{t('new')}</Button>
          </Row>
        }
        <Table
          columns={columns}
          dataSource={categories}
          loading={loading}
          pagination={false}
        />
      </Space>
    </LayoutPage>
  )
};

export default CategoriesPage;