import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Form, Row } from 'antd';
import icon from '../../assets/icon.png';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { authenticate } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const success = await authenticate(login, password);
      if (success)
        navigate('/');
    } catch (ex) {
      alert(ex);
    }
  };

  return (
    <Row itemType='flex' justify='center' align='middle'>
      <Form layout='vertical' labelCol={{span: 6}} wrapperCol={{span: 18}} style={{ width: '20%' }}>
        <Form.Item>
          <img src={icon} width={200} />
        </Form.Item>
        <Form.Item label={t('login')}>
          <Input
            type='text'
            onChange={(e) => { setLogin(e.target.value) }}
          />
        </Form.Item>
        <Form.Item label={t('password')}>
          <Input
            type='password'
            onChange={(e) => { setPassword(e.target.value) }}
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' onClick={handleSubmit}>{t('signin')}</Button>
        </Form.Item>
      </Form>
    </Row>
  );
};

export default LoginPage;