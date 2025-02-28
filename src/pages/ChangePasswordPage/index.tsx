import { Input, Button, Form } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks/useApi';
import LayoutPage from '../LayoutPage';

const ChangePasswordPage = () => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const api = useApi();

  const handleSubmit = async () => {
    try {
      await api.changePassword({ currentPassword, newPassword, repeatNewPassword });
      alert(t('changePasswordSuccess'));
    } catch (ex) {
      alert(ex);
    }
  };

  return (
    <LayoutPage>
      <Form layout='vertical'>
        <Form.Item label={t('currentPassword')}>
          <Input
            type='password'
            onChange={(e) => { setCurrentPassword(e.target.value) }}
          />
        </Form.Item>
        <Form.Item label={t('newPassword')}>
          <Input
            type='password'
            onChange={(e) => { setNewPassword(e.target.value) }}
          />
        </Form.Item>
        <Form.Item label={t('newPasswordConfirm')}>
          <Input
            type='password'
            onChange={(e) => { setRepeatNewPassword(e.target.value) }}
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' onClick={handleSubmit}>{t('changePassword')}</Button>
        </Form.Item>
      </Form>
    </LayoutPage>
  )
};

export default ChangePasswordPage;