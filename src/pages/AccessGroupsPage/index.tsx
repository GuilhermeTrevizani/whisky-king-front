import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks/useApi';
import { useEffect, useState } from 'react';
import { Table, Button, Row, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import type AccessGroupPaginationResponse from '../../types/AccessGroupPaginationResponse';
import { type ColumnsType } from 'antd/es/table';
import LayoutPage from '../LayoutPage';
import useAuth from '../../hooks/useAuth';
import { Permission } from '../../types/Permission';
import { useNotification } from '../../hooks/useNotification';

const AccessGroupsPage = () => {
  const { t } = useTranslation();
  const api = useApi();
  const [accessGroups, setAccessGroups] = useState<AccessGroupPaginationResponse[]>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const notification = useNotification();

  const columns: ColumnsType<AccessGroupPaginationResponse> = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <a onClick={() => navigate(`/access-group/${id}`)}>{id}</a>,
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
    api.getAccessGroupsByPagination({ pageNumber: 1, pageSize: 1000, orderAsc: false })
      .then(res => {
        setAccessGroups(res.data);
      })
      .catch((ex: any) => {
        notification.alert('error', ex);
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
            <Button type='primary' onClick={() => navigate('/access-group')}>{t('new')}</Button>
          </Row>
        }
        <Table
          columns={columns}
          dataSource={accessGroups}
          loading={loading}
          pagination={false}
        />
      </Space>
    </LayoutPage>
  )
};

export default AccessGroupsPage;