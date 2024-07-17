const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  return (
    <div className={`notification ${notification.type}`}>
      {notification.msg}
    </div>
  );
};

export default Notification;
