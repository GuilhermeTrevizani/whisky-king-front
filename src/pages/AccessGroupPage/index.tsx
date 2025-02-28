import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { Button, Input, Form, Checkbox, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import PermissionResponse from '../../types/PermissionResponse';
import AccessGroupResponse from '../../types/AccessGroupResponse';
import LayoutPage from '../LayoutPage';
import useAuth from '../../hooks/useAuth';
import { Permission } from '../../types/Permission';

const AccessGroupPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<PermissionResponse[]>();
  const [accessGroup, setAccessGroup] = useState<AccessGroupResponse>(null!);
  const { user } = useAuth();

  const handleSubmit = async () => {
    try {
      if (accessGroup?.id) {
        await api.updateAccessGroup(accessGroup);
        alert(t('recordSaveSuccess'));
        return;
      }

      await api.createAccessGroup({ ...accessGroup });
      navigate('/accessgroups');
    } catch (ex) {
      alert(ex);
    }
  };

  useEffect(() => {
    api.getPermissions()
      .then((res) => {
        setPermissions(res);
      });

    if (id)
      api.getAccessGroupById(id)
        .then((res) => {
          setAccessGroup(res);
        })
        .catch((res) => {
          alert(res);
          navigate('/accessgroup');
        });
  }, [id]);

  return (
    <LayoutPage>
      <Form layout='vertical'>
        <Form.Item label={t('name')}>
          <Input value={accessGroup?.name}
            onChange={(e) => setAccessGroup({ ...accessGroup, name: e.target.value })}
          />
        </Form.Item>
        <Form.Item label={t('permissions')}>
          <Select mode='multiple'
            allowClear
            showSearch
            optionFilterProp='children'
            value={accessGroup?.permissions}
            onChange={(value) => setAccessGroup({ ...accessGroup, permissions: value })}
          >
            {permissions?.map(x => <Select.Option key={x.id.toString()} value={x.id}>{x.name}</Select.Option>)}
          </Select>
        </Form.Item>
        {accessGroup?.id && <Form.Item>
          <Checkbox
            checked={accessGroup?.inactive}
            onChange={(e) => setAccessGroup({ ...accessGroup, inactive: e.target.checked })}
          >
            {t('inactive')}
          </Checkbox>
        </Form.Item>
        }
        {user?.permissions.includes(Permission.ManageAccessGroups) &&
          <Form.Item>
            <Button type='primary' onClick={handleSubmit}>{t('save')}</Button>
          </Form.Item>
        }
      </Form>
    </LayoutPage>
  )
};

export default AccessGroupPage;