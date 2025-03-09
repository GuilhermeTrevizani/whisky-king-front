import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { Button, Input, Form, Checkbox, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import MerchandiseResponse from '../../types/MerchandiseResponse';
import CategoryPaginationResponse from '../../types/CategoryPaginationResponse';
import LayoutPage from '../LayoutPage';
import useAuth from '../../hooks/useAuth';
import { Permission } from '../../types/Permission';
import { useNotification } from '../../hooks/useNotification';

const MerchandisePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const [merchandise, setMerchandise] = useState<MerchandiseResponse>(null!);
  const [categories, setCategories] = useState<CategoryPaginationResponse[]>();
  const { user } = useAuth();
  const notification = useNotification();

  const handleSubmit = async () => {
    try {
      if (merchandise?.id) {
        await api.updateMerchandise(merchandise);
        notification.alert('success', t('recordSaveSuccess'));
        return;
      }

      await api.createMerchandise({ ...merchandise });
      navigate('/merchandises');
    } catch (ex: any) {
      notification.alert('error', ex);
    }
  };

  useEffect(() => {
    api.getCategoriesByPagination({ take: 1000, orderColumn: 'name', onlyActive: true })
      .then((res) => {
        setCategories(res.data);
      });

    if (id)
      api.getMerchandiseById(id)
        .then((res) => {
          setMerchandise(res);
        })
        .catch((res) => {
          notification.alert('error', res);
          navigate('/merchandise');
        });
  }, [id]);

  return (
    <LayoutPage>
      <Form layout='vertical'>
        <Form.Item label={t('name')}>
          <Input value={merchandise?.name}
            onChange={(e) => setMerchandise({ ...merchandise, name: e.target.value })}
          />
        </Form.Item>
        <Form.Item label={t('price')}>
          <Input value={merchandise?.price}
            type='number'
            onChange={(e) => setMerchandise({ ...merchandise, price: Number(e.target.value) })}
          />
        </Form.Item>
        <Form.Item label={t('category')}>
          <Select
            allowClear
            showSearch
            optionFilterProp='children'
            value={merchandise?.categoryId}
            onChange={(value) => setMerchandise({ ...merchandise, categoryId: value })}
          >
            {categories?.map(x => <Select.Option key={x.id} value={x.id}>{x.name}</Select.Option>)}
          </Select>
        </Form.Item>
        {merchandise?.id && <Form.Item>
          <Checkbox
            checked={merchandise?.inactive}
            onChange={(e) => setMerchandise({ ...merchandise, inactive: e.target.checked })}
          >
            {t('inactive')}
          </Checkbox>
        </Form.Item>
        }
        {user?.permissions.includes(Permission.ManageMerchandises) &&
          <Form.Item>
            <Button type='primary' onClick={handleSubmit}>{t('save')}</Button>
          </Form.Item>
        }
      </Form>
    </LayoutPage>
  )
};

export default MerchandisePage;