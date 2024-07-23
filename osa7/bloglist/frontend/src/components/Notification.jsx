import { useSelector } from 'react-redux';

const Notification = () => {
  const { type, msg } = useSelector(({ notification }) => notification);

  return <div className={`notification ${type}`}>{msg}</div>;
};

export default Notification;
