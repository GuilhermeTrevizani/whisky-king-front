import { useEffect, useState } from 'react';
import LayoutPage from '../LayoutPage';
import { useApi } from '../../hooks/useApi';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import { Permission } from '../../types/Permission';
import ShiftResponse from '../../types/ShiftResponse';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Form, Select, Card, Row, Col } from 'antd';
import ChartResponse from '../../types/ChatResponse';
import moment from 'moment';
import { formatCurrency } from '../../services/format';

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const api = useApi();
  const [shiftId, setShiftId] = useState('');
  const [shifts, setShifts] = useState<ShiftResponse[]>();
  const hasPermission = user?.permissions.includes(Permission.ViewSales);
  const [categoriesChart, setCategoriesChart] = useState<ChartData<'doughnut', number[], string>>({
    labels: [],
    datasets: []
  });
  const [merchandisesChart, setMerchandisesChart] = useState<ChartData<'doughnut', number[], string>>({
    labels: [],
    datasets: []
  });
  const [paymentMethods, setPaymentMethods] = useState<ChartResponse[]>([]);
  const [paymentMethodsChat, setPaymentMethodsChart] = useState<ChartData<'doughnut', number[], string>>({
    labels: [],
    datasets: []
  });

  const chartOptions: ChartOptions<'doughnut'> = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (e) => `${t('amount')}: ${formatCurrency(e.parsed)}`,
        }
      }
    }
  }

  const generateRandomColor = () => {
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
  };

  useEffect(() => {
    if (!hasPermission)
      return;

    api.getShifts()
      .then((res) => {
        setShifts(res);
      });
  }, []);

  useEffect(() => {
    if (!hasPermission)
      return;

    api.get10CategoriesBestSellers(shiftId)
      .then((res) => {
        setCategoriesChart({
          labels: res.map(x => x.label),
          datasets: [{
            label: t('amount'),
            data: res.map(x => x.value),
            backgroundColor: res.map(x => generateRandomColor()),
          }],
        });
      });

    api.get10MerchandisesBestSellers(shiftId)
      .then((res) => {
        setMerchandisesChart({
          labels: res.map(x => x.label),
          datasets: [{
            label: t('amount'),
            data: res.map(x => x.value),
            backgroundColor: res.map(x => generateRandomColor()),
          }],
        });
      });

    api.get10PaymentMethodMostUsed(shiftId)
      .then((res) => {
        setPaymentMethods(res);
        setPaymentMethodsChart({
          labels: res.map(x => x.label),
          datasets: [{
            label: t('amount'),
            data: res.map(x => x.value),
            backgroundColor: res.map(x => generateRandomColor()),
          }],
        });
      });
  }, [shiftId]);

  if (!hasPermission)
    return (
      <LayoutPage>
        <>
        </>
      </LayoutPage>
    );

  return (
    <LayoutPage>
      <>
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col span={21}>
              <Form.Item label={t('shift')}>
                <Select
                  allowClear
                  showSearch
                  optionFilterProp='children'
                  value={shiftId}
                  onChange={(value) => setShiftId(value)}
                >
                  {shifts?.map(x => <Select.Option key={x.id.toString()} value={x.id}>{moment(x.registerDate).format('DD/MM/yyyy HH:mm:ss')}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label={t('amount')}>
                <strong>{formatCurrency(paymentMethods.reduce((sum, record) => sum + record.value, 0))}</strong>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {(paymentMethodsChat.labels?.length ?? 0) > 0 && <Row gutter={16} style={{ textAlign: 'center' }}>
          <Col span={8}>
            <Card>
              <h3>{t('10CategoriesBestSellersByValue')}</h3>
              <Doughnut
                data={categoriesChart}
                options={chartOptions}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <h3>{t('10MerchandisesBestSellersByValue')}</h3>
              <Doughnut
                data={merchandisesChart}
                options={chartOptions}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <h3>{t('10PaymentMethodsMostUsedByValue')}</h3>
              <Doughnut
                data={paymentMethodsChat}
                options={chartOptions}
              />
            </Card>
          </Col>
        </Row>}
      </>
    </LayoutPage>
  );
};

export default HomePage;