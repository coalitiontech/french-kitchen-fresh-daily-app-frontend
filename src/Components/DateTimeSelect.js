import { useState } from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import styles from './DateTimeSelect.module.css';
 
export default function DateTimeSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date.toDate());
    setIsOpen(false); // Close the picker after selecting a date
  };

  const formattedDate = moment(selectedDate).format('YYYY-MM-DD HH:mm'); // Customize the format

  return (
    <div className={styles.datetimeContainer}>
      <input
        type="text"
        readOnly
        value={formattedDate}
        onClick={() => setIsOpen(true)}
        className={styles.polarisTextfield}
      />
      {isOpen && (
        <div className={styles.datetimePickerWrapper}>
          <Datetime
            className={styles.datetimePicker}
            initialValue={selectedDate}
            input={false}
            initialViewMode="days"
            timeFormat={true}
            onChange={handleDateChange}
            closeOnSelect={true}
          />
        </div>
      )}
    </div>
  );
  
}