import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

export function useNotification() {
  const { alert } = useContext(NotificationContext)

  return {
    alert
  }
}