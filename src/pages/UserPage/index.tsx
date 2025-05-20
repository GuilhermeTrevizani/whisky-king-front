import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { Button, Input, Form, Checkbox, Select, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import type AccessGroupPaginationResponse from '../../types/AccessGroupPaginationResponse';
import type UserResponse from '../../types/UserResponse';
import LayoutPage from '../LayoutPage';
import useAuth from '../../hooks/useAuth';
import { Permission } from '../../types/Permission';
import { useNotification } from '../../hooks/useNotification';

const UserPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const [accessGroups, setAccessGroups] = useState<AccessGroupPaginationResponse[]>();
  const [user, setUser] = useState<UserResponse>(null!);
  const authenticatedUser = useAuth().user;
  const notification = useNotification();

  const handleSubmit = async () => {
    try {
      if (user?.id) {
        await api.updateUser(user);
        notification.alert('success', t('recordSaveSuccess'));
        return;
      }

      await api.createUser({ ...user });
      navigate('/users');
    } catch (ex: any) {
      notification.alert('error', ex);
    }
  };

  useEffect(() => {
    api.getAccessGroupsByPagination({ take: 1000, orderColumn: 'name', onlyActive: true })
      .then((res) => {
        setAccessGroups(res.data);
      });

    if (id)
      api.getUserById(id)
        .then((res) => {
          setUser(res);
        })
        .catch((res) => {
          notification.alert('error', res);
          navigate('/user');
        });
  }, [id]);

  return (
    <LayoutPage>
      <Form layout='vertical'>
        {!id &&
          <Form.Item>
            <Alert message={t('defaultPasswordNewUser')} type='warning' />
          </Form.Item>
        }
        <Form.Item label={t('name')}>
          <Input value={user?.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </Form.Item>
        <Form.Item label={t('login')}>
          <Input value={user?.login}
            onChange={(e) => setUser({ ...user, login: e.target.value })}
          />
        </Form.Item>
        <Form.Item label={t('accessGroups')}>
          <Select mode='multiple'
            allowClear
            showSearch
            optionFilterProp='children'
            value={user?.accessGroups}
            onChange={(value) => setUser({ ...user, accessGroups: value })}
          >
            {accessGroups?.map(x => <Select.Option key={x.id} value={x.id}>{x.name}</Select.Option>)}
          </Select>
        </Form.Item>
        {user?.id && <Form.Item>
          <Checkbox
            checked={user?.inactive}
            onChange={(e) => setUser({ ...user, inactive: e.target.checked })}
          >
            {t('inactive')}
          </Checkbox>
        </Form.Item>
        }
        {authenticatedUser?.permissions.includes(Permission.ManageUsers) &&
          <Form.Item>
            <Button type='primary' onClick={handleSubmit}>{t('save')}</Button>
          </Form.Item>
        }
      </Form>
    </LayoutPage>
  )
};

export default UserPage;