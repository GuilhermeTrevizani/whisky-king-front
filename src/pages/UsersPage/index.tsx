import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks/useApi';
import { useEffect, useState } from 'react';
import { Table, Button, Row, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import UserPaginationResponse from '../../types/UserPaginationResponse';
import { ColumnsType } from 'antd/es/table';
import LayoutPage from '../LayoutPage';
import useAuth from '../../hooks/useAuth';
import { Permission } from '../../types/Permission';

const UsersPage = () => {
  const { t } = useTranslation();
  const api = useApi();
  const [users, setUsers] = useState<UserPaginationResponse[]>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const columns: ColumnsType<UserPaginationResponse> = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <a onClick={() => navigate(`/user/${id}`)}>{id}</a>,
    },
    {
      title: t('login'),
      dataIndex: 'login',
      key: 'login',
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
      align: 'center',
      render: (inactive: boolean) => <Tag color={inactive ? 'red' : 'green'}>{inactive ? t('inactive') : t('active')}</Tag>,
    },
  ];

  useEffect(() => {
    setLoading(true);
    api.getUserByPagination({ take: 1000, orderColumn: 'registerDate', orderDescending: true })
      .then(res => {
        setUsers(res.data);
      })
      .catch((ex) => {
        alert(ex);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <LayoutPage>
      <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
        {user?.permissions.includes(Permission.ManageAccessGroups) &&
          <Row itemType='flex' justify='end' align='middle'>
            <Button type='primary' onClick={() => navigate('/user')}>{t('new')}</Button>
          </Row>
        }
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={false}
        />
      </Space>
    </LayoutPage>
  )
};

export default UsersPage;