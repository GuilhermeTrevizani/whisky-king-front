import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { Button, Input, Form, Checkbox, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import CategoryResponse from '../../types/CategoryResponse';
import LayoutPage from '../LayoutPage';
import useAuth from '../../hooks/useAuth';
import { Permission } from '../../types/Permission';

const CategoryPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryResponse>(null!);
  const { user } = useAuth();

  const handleSubmit = async () => {
    try {
      if (category?.id) {
        await api.updateCategory(category);
        alert(t('recordSaveSuccess'));
        return;
      }

      await api.createCategory({ ...category });
      navigate('/categories');
    } catch (ex) {
      alert(ex);
    }
  };

  useEffect(() => {
    if (id)
      api.getCategoryById(id)
        .then((res) => {
          setCategory(res);
        })
        .catch((res) => {
          alert(res);
          navigate('/category');
        });
  }, [id]);

  return (
    <LayoutPage>
      <Form layout='vertical'>
        <Form.Item label={t('name')}>
          <Input value={category?.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
          />
        </Form.Item>
        <Form.Item label={t('details')}>
          <Select
            mode='tags'
            value={category?.details}
            onChange={(value) => setCategory({ ...category, details: value })}
          />
        </Form.Item>
        {category?.id && <Form.Item>
          <Checkbox
            checked={category?.inactive}
            onChange={(e) => setCategory({ ...category, inactive: e.target.checked })}
          >
            {t('inactive')}
          </Checkbox>
        </Form.Item>
        }
        {user?.permissions.includes(Permission.ManageCategories) &&
          <Form.Item>
            <Button type='primary' onClick={handleSubmit}>{t('save')}</Button>
          </Form.Item>
        }
      </Form>
    </LayoutPage>
  )
};

export default CategoryPage;