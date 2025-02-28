export const formatCurrency = (value: Number) => {
  return value.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'brl'
  });
}