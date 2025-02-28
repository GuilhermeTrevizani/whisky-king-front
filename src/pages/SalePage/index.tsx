import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, Table, Select, Divider, Row, Col, Popconfirm, AutoComplete } from 'antd';
import { useTranslation } from 'react-i18next';
import { CreateSaleRequestMerchandise, CreateSaleRequestPaymentMethod } from '../../types/CreateSaleRequest';
import MerchandisePaginationResponse from '../../types/MerchandisePaginationResponse';
import PaymentMethodPaginationResponse from '../../types/PaymentMethodPaginationResponse';
import ShiftResponse from '../../types/ShiftResponse';
import moment from 'moment';
import { ColumnsType } from 'antd/es/table';
import { formatCurrency } from '../../services/format';
import { SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import LayoutPage from '../LayoutPage';
import CategoryPaginationResponse from '../../types/CategoryPaginationResponse';

const SalePage = () => {
  const { t } = useTranslation();
  const api = useApi();
  const navigate = useNavigate();

  const [saleMerchandises, setSaleMerchandises] = useState<CreateSaleRequestMerchandise[]>([]);
  const [salePaymentMethods, setSalePaymentMethods] = useState<CreateSaleRequestPaymentMethod[]>([]);

  const [shift, setShift] = useState<ShiftResponse | null>(null);

  const [merchandises, setMerchandises] = useState<MerchandisePaginationResponse[]>();
  const [categoryMerchandises, setCategoryMerchandises] = useState<MerchandisePaginationResponse[]>();
  const [selectedMerchandise, setSelectedMerchandise] = useState<CreateSaleRequestMerchandise>({
    merchandiseId: '',
    quantity: 1,
    discount: 0
  });
  const [selectedMerchandisePrice, setSelectedMerchandisePrice] = useState(0);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodPaginationResponse[]>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<CreateSaleRequestPaymentMethod>({
    paymentMethodId: '',
    value: 0
  });

  const [categories, setCategories] = useState<CategoryPaginationResponse[]>();

  const [savePaymentMethod, setSavePaymentMethod] = useState(false);

  const [details, setDetails] = useState<{ label: string, value: string }[]>([]);

  useEffect(() => {
    const merchandise = merchandises?.find(x => x.id === selectedMerchandise?.merchandiseId);
    if(!merchandise?.categoryId)
      return;

    const category = categories?.find(x => x.id === merchandise.categoryId);
    setDetails(category!.details.map(x => {
      return { label: x, value: x };
    }));
  }, [selectedMerchandise]);

  const getMerchandisePrice = (merchandiseId: string) => {
    return merchandises?.find(x => x.id == merchandiseId)?.price ?? 0;
  }

  const getSaleAmount = () => {
    return saleMerchandises.reduce((sum, record) => sum + record.quantity * getMerchandisePrice(record.merchandiseId) - record.discount, 0);
  }

  const getPaymentMethodsAmount = () => {
    return salePaymentMethods.reduce((sum, record) => sum + record.value, 0);
  }

  const columnsMerchandises: ColumnsType<CreateSaleRequestMerchandise> = [
    {
      title: t('merchandise'),
      key: 'merchandise',
      render: (_, record) => merchandises?.find(x => x.id == record.merchandiseId)?.name,
    },
    {
      title: t('detail'),
      dataIndex: 'detail',
      key: 'detail',
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'end',
    },
    {
      title: t('price'),
      key: 'price',
      align: 'end',
      render: (_, record) => formatCurrency(getMerchandisePrice(record.merchandiseId)),
    },
    {
      title: t('discount'),
      dataIndex: 'discount',
      key: 'discount',
      align: 'end',
      render: (discount: Number) => formatCurrency(discount),
    },
    {
      title: t('subtotal'),
      key: 'subtotal',
      align: 'end',
      render: (_, record) => formatCurrency(record.quantity * getMerchandisePrice(record.merchandiseId) - record.discount),
    },
    {
      title: t('options'),
      dataIndex: 'merchandiseId',
      key: 'options',
      align: 'center',
      render: (_, record) => <Button onClick={() => handleDeleteMerchandise(saleMerchandises.indexOf(record))} icon={<DeleteOutlined />} />,
    },
  ];

  const columnsPaymentMethods: ColumnsType<CreateSaleRequestPaymentMethod> = [
    {
      title: t('paymentMethod'),
      key: 'paymentMethod',
      render: (_, record) => paymentMethods?.find(x => x.id == record.paymentMethodId)?.name,
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      align: 'end',
      render: (value: Number) => formatCurrency(value),
    },
    {
      title: t('options'),
      key: 'options',
      align: 'center',
      render: (_, record) => <Button onClick={() => handleDeletePaymentMethod(salePaymentMethods.indexOf(record))} icon={<DeleteOutlined />} />,
    },
  ];

  const handleDeleteMerchandise = (index: number) => {
    setSaleMerchandises([...saleMerchandises.filter((x, i) => i != index)]);
    setSaleLocalStorage();
  };

  const handleDeletePaymentMethod = (index: number) => {
    setSalePaymentMethods([...salePaymentMethods.filter((x, i) => i != index)]);
    setSaleLocalStorage();
  };

  const handleChangeMerchandise = (value: string) => {
    setSelectedMerchandise({ merchandiseId: value, quantity: 1, discount: 0 });
    setSelectedMerchandisePrice(getMerchandisePrice(value));
  }

  const handleChangePaymentMethod = (value: string) => {
    setSelectedPaymentMethod({ paymentMethodId: value, value: getSaleAmount() - getPaymentMethodsAmount() });
  }

  const handleAddMerchandise = () => {
    if (!selectedMerchandise.merchandiseId) {
      alert(t('noMerchandiseSelected'));
      return;
    }

    if (selectedMerchandise.quantity <= 0) {
      alert(t('invalidQuantity'));
      return;
    }

    const amount = selectedMerchandise.quantity * selectedMerchandisePrice - selectedMerchandise.discount;
    if (amount < 0) {
      alert(t('invalidDiscount'));
      return;
    }

    setSaleMerchandises([...saleMerchandises, selectedMerchandise]);
    setSaleLocalStorage();
    handleChangeMerchandise('');

    if (selectedPaymentMethod.paymentMethodId) {
      setSavePaymentMethod(true);
      setSelectedPaymentMethod({ ...selectedPaymentMethod, value: amount });
    }
  };

  useEffect(() => {
    if (savePaymentMethod) {
      handleAddPaymentMethod();
      setSavePaymentMethod(false);
    }
  }, [selectedPaymentMethod]);

  const handleAddPaymentMethod = () => {
    if (!selectedPaymentMethod.paymentMethodId) {
      alert(t('noPaymentMethodSelected'));
      return;
    }

    if (selectedPaymentMethod.value <= 0) {
      alert(t('invalidValue'));
      return;
    }

    setSalePaymentMethods([...salePaymentMethods, selectedPaymentMethod]);
    setSaleLocalStorage();
    handleChangePaymentMethod('');
  };

  const handleShift = async () => {
    try {
      if (shift) {
        await api.endShift();
        setShift(null);
        return;
      }

      const res = await api.startShift();
      setShift(res);
    } catch (ex) {
      alert(ex);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('SALE');
    setSaleMerchandises([]);
    setSalePaymentMethods([]);
    handleChangeMerchandise('');
    handleChangePaymentMethod('');
  };

  const handleSubmit = async () => {
    try {
      const id = await api.createSale({
        merchandises: saleMerchandises,
        paymentMethods: salePaymentMethods
      });
      localStorage.removeItem('SALE');
      window.open(`/sale/invoice/${id}`);
      navigate('/sales');
    } catch (ex) {
      alert(ex);
    }
  };

  const setSaleLocalStorage = () => {
    localStorage.setItem('SALE', JSON.stringify({
      merchandises: saleMerchandises,
      paymentMethods: salePaymentMethods
    }));
  };

  const handleChangeCategory = (value: string) => {
    setCategoryMerchandises(value ? merchandises?.filter(x => x.categoryId == value) : merchandises);
  }

  useEffect(() => {
    const localStorageSale = localStorage.getItem('SALE');
    if (localStorageSale) {
      const sale = JSON.parse(localStorageSale);
      setSaleMerchandises(sale.merchandises);
      setSalePaymentMethods(sale.paymentMethods);
    }

    api.getCurrentShift()
      .then((res) => {
        setShift(res?.id ? res : null);
      });

    api.getMerchandisesByPagination({ take: 1000, orderColumn: 'name', onlyActive: true })
      .then((res) => {
        setMerchandises(res.data);
        setCategoryMerchandises(res.data);
        handleChangePaymentMethod('');
      });

    api.getPaymentMethodsByPagination({ take: 1000, orderColumn: 'name', onlyActive: true })
      .then((res) => {
        setPaymentMethods(res.data);
      });

    api.getCategoriesByPagination({ take: 1000, orderColumn: 'name', onlyActive: true })
      .then((res) => {
        setCategories(res.data);
      });
  }, []);

  return (
    <LayoutPage>
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={18}>
            <Popconfirm
              title={shift == null ? t('openShiftTitle') : t('endShiftTitle')}
              description={shift == null ? t('openShiftMessage') : t('endShiftMessage')}
              onConfirm={handleShift}
              okText={t('yes')}
              cancelText={t('no')}
            >
              <Button>{t('shift')}: {shift == null ? t('none') : moment(shift.registerDate).format('DD/MM/yyyy HH:mm:ss')}</Button>
            </Popconfirm>
          </Col>
          <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel} style={{ marginRight: 10 }}>Cancelar</Button>
            <Button type='primary' onClick={handleSubmit}>{t('finish')} ({formatCurrency(getSaleAmount())})</Button>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={3}>
            <Form.Item label={t('category')}>
              <Select
                allowClear
                showSearch
                optionFilterProp='children'
                onChange={handleChangeCategory}
              >
                {categories?.map(x => <Select.Option key={x.id.toString()} value={x.id}>{x.name}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item label={t('merchandise')}>
              <Select
                allowClear
                showSearch
                optionFilterProp='children'
                onChange={handleChangeMerchandise}
                value={selectedMerchandise.merchandiseId}
              >
                {categoryMerchandises?.map(x => <Select.Option key={x.id.toString()} value={x.id}>{x.name}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label={t('quantity')}>
              <Input type='number'
                value={selectedMerchandise?.quantity}
                onChange={(e) => setSelectedMerchandise({ ...selectedMerchandise, quantity: Number(e.target.value) })}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label={t('price')}>
              <Input type='number'
                readOnly
                value={selectedMerchandisePrice}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label={t('discount')}>
              <Input type='number'
                value={selectedMerchandise?.discount}
                onChange={(e) => setSelectedMerchandise({ ...selectedMerchandise, discount: Number(e.target.value) })}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label={t('subtotal')}>
              <Input type='number'
                readOnly
                value={(selectedMerchandise?.quantity ?? 0) * selectedMerchandisePrice - (selectedMerchandise?.discount ?? 0)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={18}>
            <Form.Item label={t('detail')}>
              <AutoComplete
                options={details}
                value={selectedMerchandise?.detail}
                filterOption={(inputValue, option) =>
                  option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                onSelect={(value) => setSelectedMerchandise({ ...selectedMerchandise, detail: value })}
                onChange={(value) => setSelectedMerchandise({ ...selectedMerchandise, detail: value })}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={t('paymentMethod')}>
              <Select
                allowClear
                showSearch
                optionFilterProp='children'
                onChange={handleChangePaymentMethod}
                value={selectedPaymentMethod.paymentMethodId}
              >
                {paymentMethods?.map(x => <Select.Option key={x.id.toString()} value={x.id}>{x.name}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item label=' '>
              <Button block icon={<SaveOutlined />} onClick={handleAddMerchandise} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Table
            columns={columnsMerchandises}
            dataSource={saleMerchandises}
            pagination={false}
          />
        </Form.Item>
        <Divider />
        <Row gutter={16}>
          <Col span={18}>
            <Form.Item label={t('paymentMethod')}>
              <Select
                allowClear
                showSearch
                optionFilterProp='children'
                onChange={handleChangePaymentMethod}
                value={selectedPaymentMethod.paymentMethodId}
              >
                {paymentMethods?.map(x => <Select.Option key={x.id.toString()} value={x.id}>{x.name}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={t('value')}>
              <Input type='number'
                value={selectedPaymentMethod?.value}
                onChange={(e) => setSelectedPaymentMethod({ ...selectedPaymentMethod, value: Number(e.target.value) })}
              />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item label=' '>
              <Button block icon={<SaveOutlined />} onClick={handleAddPaymentMethod} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Table
            columns={columnsPaymentMethods}
            dataSource={salePaymentMethods}
            pagination={false}
          />
        </Form.Item>
      </Form>
    </LayoutPage>
  )
};

export default SalePage;