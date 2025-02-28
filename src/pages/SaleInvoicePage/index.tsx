import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import SaleInvoiceResponse from '../../types/SaleInvoiceResponse';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { formatCurrency } from '../../services/format';

const SaleInvoicePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const [sale, setSale] = useState<SaleInvoiceResponse>();
  const separator = new Array(42 + 1).join('-');

  useEffect(() => {
    if (!id) {
      navigate('/sales');
      return;
    }

    api.getSaleInvoiceById(id)
      .then((res) => {
        setSale(res);
        setTimeout(() => window.print(), 200);
      })
      .catch((res) => {
        alert(res);
        navigate('/sales');
      });
  }, [id]);

  if (!sale)
    return (
      <>
        ...
      </>
    );

  return (
    <div style={{ textAlign: 'center' }}>
      {t('whiskyKing')}
      <br />
      {t('saleOf')} {moment(sale.registerDate).format('DD/MM/yyyy HH:mm:ss')}
      <br />
      {separator}
      {sale.merchandises.map(merchandise => (
        <>
          <br />
          {merchandise.name}
          <br />
          {merchandise.quantity} x {formatCurrency(merchandise.price)} {merchandise.discount > 0 ? `- ${formatCurrency(merchandise.discount)}` : ''} = {formatCurrency(merchandise.subtotal)}
          <br />
          {merchandise.detail}
          {(merchandise.detail && <br />)}
        </>
      ))}
      {separator}
      <br />
      {sale.paymentMethods.map(paymentMethod => (
        <>
          {paymentMethod.name} ({formatCurrency(paymentMethod.value)})
          <br />
        </>
      ))}
      {t('amount')} ({formatCurrency(sale.amount)})
      <br />
      {separator}
      <br />
      {sale.id}
    </div>
  );
};

export default SaleInvoicePage;