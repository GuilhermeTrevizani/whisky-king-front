import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { Button, Input, Form, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';
import type PaymentMethodResponse from '../../types/PaymentMethodResponse';
import LayoutPage from '../LayoutPage';
import useAuth from '../../hooks/useAuth';
import { Permission } from '../../types/Permission';
import { useNotification } from '../../hooks/useNotification';

const PaymentMethodPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodResponse>(null!);
  const { user } = useAuth();
  const notification = useNotification();

  const handleSubmit = async () => {
    try {
      if (paymentMethod?.id) {
        await api.updatePaymentMethod(paymentMethod);
        notification.alert('success', t('recordSaveSuccess'));
        return;
      }

      await api.createPaymentMethod({ ...paymentMethod });
      navigate('/payment-methods');
    } catch (ex: any) {
      notification.alert('error', ex);
    }
  };

  useEffect(() => {
    if (id)
      api.getPaymentMethodById(id)
        .then((res) => {
          setPaymentMethod(res);
        })
        .catch((res) => {
          notification.alert('error', res);
          navigate('/payment-methods');
        });
  }, [id]);

  return (
    <LayoutPage>
      <Form layout='vertical'>
        <Form.Item label={t('name')}>
          <Input value={paymentMethod?.name}
            onChange={(e) => setPaymentMethod({ ...paymentMethod, name: e.target.value })}
          />
        </Form.Item>
        {paymentMethod?.id && <Form.Item>
          <Checkbox
            checked={paymentMethod?.inactive}
            onChange={(e) => setPaymentMethod({ ...paymentMethod, inactive: e.target.checked })}
          >
            {t('inactive')}
          </Checkbox>
        </Form.Item>
        }
        {user?.permissions.includes(Permission.ManagePaymentMethods) &&
          <Form.Item>
            <Button type='primary' onClick={handleSubmit}>{t('save')}</Button>
          </Form.Item>
        }
      </Form>
    </LayoutPage>
  )
};

export default PaymentMethodPage;