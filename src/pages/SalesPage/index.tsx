import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks/useApi';
import { useEffect, useState } from 'react';
import { Table, Button, Row, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import SalePaginationResponse from '../../types/SalePaginationResponse';
import { formatCurrency } from '../../services/format';
import { ColumnsType } from 'antd/es/table';
import LayoutPage from '../LayoutPage';
import useAuth from '../../hooks/useAuth';
import { Permission } from '../../types/Permission';
import { useNotification } from '../../hooks/useNotification';

const SalesPage = () => {
  const { t } = useTranslation();
  const api = useApi();
  const [sales, setSales] = useState<SalePaginationResponse[]>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const notification = useNotification();

  const columns: ColumnsType<SalePaginationResponse> = [
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <a onClick={() => window.open(`/sale/invoice/${id}`)}>{id}</a>,
    },
    {
      title: t('amount'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'end',
      render: (amount: Number) => formatCurrency(amount),
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
    api.getSalesByPagination({ take: 1000, orderColumn: 'registerDate', orderDescending: true })
      .then(res => {
        setSales(res.data);
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
        {user?.permissions.includes(Permission.ManageSales) &&
          <Row itemType='flex' justify='end' align='middle'>
            <Button type='primary' onClick={() => navigate('/sale')}>{t('new')}</Button>
          </Row>
        }
        <Table
          columns={columns}
          dataSource={sales}
          loading={loading}
          pagination={false}
        />
      </Space>
    </LayoutPage>
  )
};

export default SalesPage;