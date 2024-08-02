import { React, useEffect, useState} from 'react';
import { Select, FormLayout } from '@shopify/polaris';
import { generateTimeslots } from './utils/timeslots';
import styles from './TimeSelect.module.css';

const TimeSelect = ({ label, value, onChange, min, max, style, ...props }) => {
    const timeslots = generateTimeslots().map(time => ({ label: time, value: time }));
    const [filteredTimeslots, setFilteredTimeslots] = useState([]);

    // Function to filter timeslots based on min and max props
    const filterTimeslots = () => {
    const filtered = timeslots.filter(slot => 
        (!min || slot.value >= min) && (!max || slot.value <= max)
    );
        setFilteredTimeslots(filtered);
   };

    useEffect(() => {
        console.log('effect= ', max);
        filterTimeslots(); // Filter timeslots when min or max changes
    }, [min, max]);

    const handleChange = (selectedValue) => {
      onChange(selectedValue);
    };
  
    return (
        <FormLayout>
          <FormLayout.Group>
            <Select
                label={label}
                options={filteredTimeslots}
                value={value}
                onChange={handleChange}
                {...props}
                style={{ width:'30%' }}
                className={styles.selectContainer}
            />
          </FormLayout.Group>
        </FormLayout>
      );
     
};

export default TimeSelect;