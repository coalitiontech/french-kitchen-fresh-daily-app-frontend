// DateTimeSelect.js
import { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import styles from './DateTimeSelect.module.css';

export default function DateTimeSelect({ label, name, value, onChange, isDate, isTime, initialViewMode, format }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? moment(value).seconds(0).toDate() : new Date());

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    }
  }, [value]);

  const handleDateChange = (date) => {
    setSelectedDate(date.toDate());
  };

  const handleConfirm = () => {
    const formattedDate = moment(selectedDate).seconds(0).format('YYYY-MM-DD HH:mm:ss');
    // const formattedDate = moment(selectedDate).format(format);
    onChange(formattedDate);
    setIsOpen(false);
  };

  const formattedDate = moment(selectedDate).seconds(0).format(format);

  return (
    <div className={styles.datetimeContainer}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type="text"
        readOnly
        value={formattedDate}
        onClick={() => setIsOpen(true)}
        className={styles.polarisTextfield}
        id={name}
        name={name}
      />
      {isOpen && (
        <div className={styles.datetimePickerWrapper}>
          <Datetime
            className={styles.datetimePicker}
            value={selectedDate}
            initialViewDate={moment(selectedDate)}
            input={false}
            initialViewMode={initialViewMode}
            timeFormat={isTime}
            dateFormat={isDate}
            onChange={handleDateChange}
            closeOnSelect={true}
            onNavigate={() => { }}
          />
          <button className={styles.confirmButton} onClick={handleConfirm}>Select</button>

        </div>
      )}
    </div>
  );
}
