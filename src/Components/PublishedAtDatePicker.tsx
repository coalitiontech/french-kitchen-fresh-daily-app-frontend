import { BlockStack, Box, Card, DatePicker, Icon, Popover, TextField } from '@shopify/polaris';
import { useCallback, useEffect, useState, useRef } from 'react';
import { CalendarMinor } from '@shopify/polaris-icons';

export default function PublishedAtDatePicker({dateChange, selectedDateDefault}) {
  const [visible, setVisible] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(selectedDateDefault);
  const [{ month, year }, setDate] = useState({
    month: selectedDateDefault.getMonth(),
    year: selectedDateDefault.getFullYear(),
  });
  const formattedValue = selectedDateDefault.toISOString().slice(0, 10);

  function handleOnClose({ relatedTarget }) {
    setVisible(false);
  }
  function handleMonthChange(month, year) {
    setDate({ month, year });
  }
  function handleDateSelection({ end: newSelectedDate }) {
    dateChange(newSelectedDate, 'published_at')
    setVisible(false);
  }
  useEffect(() => {
    if (selectedDateDefault) {
      setDate({
        month: selectedDateDefault.getMonth(),
        year: selectedDateDefault.getFullYear(),
      });
    }
  }, [selectedDateDefault]);

  return (
    <Popover
      active={visible}
      autofocusTarget="none"
      preferredAlignment="left"
      fullWidth
      preferInputActivator={false}
      preferredPosition="below"
      preventCloseOnChildOverlayClick
      onClose={handleOnClose}
      activator={
        <TextField
          role="combobox"
          label={"Published at"}
          prefix={<Icon source={CalendarMinor} />}
          value={formattedValue}
          onFocus={() => setVisible(true)}
          autoComplete="off"
        />
      }
    >
      <Card >
        <DatePicker
          month={month}
          year={year}
          selected={selectedDateDefault}
          onMonthChange={handleMonthChange}
          onChange={handleDateSelection}
        />
      </Card>
    </Popover>
  )
}