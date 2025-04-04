import ButtonEnd from '@/Components/ButtonEnd';
import DateTimeSelect from '@/Components/DateTimeSelect';
import { Box, Card, Text, TextField, Button, Toast, Divider, Icon, Select, Modal, DropZone, Checkbox } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import moment from 'moment';
import {
    ArrowLeftIcon,
    ViewIcon,
    DeleteIcon
} from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'

const DynamicQuillJs = dynamic(() => import('@/Components/QuillJs'), {
    loading: () => <p>Loading...</p>,
})

export default function Settings() {
    const [isLoading, setIsLoading] = useState(true)
    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})
    const [active, setActive] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [times, setTimes] = useState({});

    const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


    useEffect(() => {
        updateValues()
    }, [])    

    const updateValues = () => {
      axiosInstance.get(`/api/store-settings`).then((response) => {
        const data = response.data;
    
        if (Array.isArray(data) && data.length > 0) {

          const settings = data[0];    
          let parsedValue = { days: [], times: {} };

          if (settings.value) {
            try {
              parsedValue = JSON.parse(settings.value);
            } catch (error) {
              console.error("Error parsing value:", error);
            }
          }
    
          setSelectedDays(parsedValue.days || []);

          const today = moment().format("YYYY-MM-DD"); 
          const formattedTimes = {};

          Object.keys(parsedValue.times).forEach((day) => {
           
            formattedTimes[day] = {               
              start_time: moment(`${today} ${parsedValue.times[day].start_time}`, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"),
              start_time_display: moment(`${today} ${parsedValue.times[day].start_time}`, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"), 
              end_time: moment(`${today} ${parsedValue.times[day].end_time}`, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"),
              end_time_display: moment(`${today} ${parsedValue.times[day].end_time}`, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"),
            };
          }); 
         
          setTimes(formattedTimes);
    
          setValues({
            key: settings.key,
            value: parsedValue,
          });
        }    
        setIsLoading(false);
        
      }).catch((error) => {
        console.error("Error fetching store settings:", error);
      });
    };
    

    const handleDayChange = (day) => {
        setSelectedDays((prev) => {
          let updatedDays;
          if (prev.includes(day)) {
           
            updatedDays = prev.filter((d) => d !== day);
            setTimes((prevTimes) => {
              const newTimes = { ...prevTimes };
              delete newTimes[day]; 
              return newTimes;
            });
          } else {
            updatedDays = [...prev, day];

            const defaultTime = moment().seconds(0).format('YYYY-MM-DD HH:mm:ss');
            
            setTimes((prevTimes) => ({
              ...prevTimes,
              [day]: {
                start_time: defaultTime, 
                start_time_display: defaultTime,
                end_time: defaultTime,
                end_time_display: defaultTime,     
              },
            }));
          }
          return updatedDays;
        });
      };
 
      const handleTimeChange = (day, field, value) => {    
        const timeOnly = moment(value).format("HH:mm:ss");
        const fullDateTime = moment().format("YYYY-MM-DD") + " " + timeOnly;   

        setTimes((prev) => ({
          ...prev,
          [day]: {
            ...prev[day],
            [field]: timeOnly,
            [`${field}_display`]: fullDateTime,
          },
        }));
      };
      
      const preparePayload = () => {
        const cleanedTimes = Object.keys(times).reduce((acc, day) => {
          acc[day] = {
            start_time: times[day].start_time,
            end_time: times[day].end_time,
          };
          return acc;
        }, {});
      
        return {
          key: "store_settings",
          value: JSON.stringify({
            days: selectedDays,
            times: cleanedTimes, // Remove display fields before posting
          }),
        };
      };

    useEffect(() => {
        if (isEditing != null && !isEditing) {
          const payload = preparePayload();
         
          axiosInstance.post(`/api/store-settings`, payload).then((response) => {
            setActive(true);
          });
        }
    }, [isEditing])

    const toastMarkup = active ? (
        <Toast content="Store Settings Updated Successfully!" onDismiss={() => {
            setActive(false)
        }} />
    ) : null;

    return !isLoading && (<Box minHeight='100vh' maxWidth="100%" as='section' background="bg">
        <div style={{ maxWidth: "100%", display: 'block', justifyContent: 'center', margin: '25px' }}>
            <Card padding={'800'}>
                <div style={{ marginBottom: "10px" }}>
                    <Text variant="heading2xl" alignment="center" as={'h1'} >Store Settings</Text>
                </div>
                <input type="hidden" name="key" value='store_settings' />
                <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                    <div className="quill-js__section" style={{ width: '100%', display: 'flex' }}>
                        <div className={isEditing ? '' : 'not-allowed'} style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', width: '50%' }}>
                            <Text as='label'> Days </Text>
                            <div className='week-days-section'>
                                {allDays.map((day) => (
                                    <label key={day} className="flex items-center space-x-2">
                                        <Checkbox
                                          key={day}
                                          label={day}
                                          checked={selectedDays.includes(day)}
                                          onChange={() => handleDayChange(day)}
                                          disabled={!isEditing}
                                        />                                       
                                    </label>
                                ))}
                            </div>
                          </div>
                            {selectedDays.length > 0 && (
                               
                                <div>
                                  {selectedDays.map((day) => (
                                    <div key={day} style={{ display: 'flex' }}>
                                      {/* Day Label */}
                                      <span className="w-24 font-medium">{day} </span> 
                                      <div className={isEditing ? '' : 'not-allowed'} style={{ width: '100%', padding: '15px', pointerEvents: isEditing ? "auto" : "none", opacity: isEditing ? 1 : 0.5 }}>
                                        {/* Start Time Picker */}
                                        <DateTimeSelect
                                          label="Start Time"
                                          name="start_time"
                                          value={times[day]?.start_time_display || ""}
                                          autoComplete="off"
                                          isDate={false}
                                          isTime={true}
                                          format="HH:mm:ss" 
                                          initialViewMode="time"
                                          onChange={(value) => handleTimeChange(day, "start_time", value)}
                                          style={{ width: "100%" }}
                                          disabled={!isEditing}
                                        />
                                      </div>
                                      {/* End Time Picker */}
                                      <div className={isEditing ? '' : 'not-allowed'} style={{ width: '100%', padding: '15px', pointerEvents: isEditing ? "auto" : "none", opacity: isEditing ? 1 : 0.5 }}>
                                        <DateTimeSelect
                                          label="End Time"
                                          name="end_time"
                                          value={times[day]?.end_time_display || ""}
                                          autoComplete="off"
                                          isDate={false}
                                          isTime={true}
                                          format="HH:mm:ss"
                                          initialViewMode="time"
                                          onChange={(value) => handleTimeChange(day, "end_time", value)}
                                          style={{ width: "100%" }}
                                          disabled={!isEditing}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                               
                            )} 
                        
                         
                    </div>
                </div>
                <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                    <div className='quill-js__section' style={{ width: '100%', display: 'flex' }}>
                        <div className={isEditing ? '' : 'not-allowed'} style={{ width: '30%', padding: '15px' }}>
                            
                            
                        </div>
                    </div>
                </div>
                <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                    {/* <div style={{ marginRight: '10px' }}><Button loading={active} onClick={()=>{}}>Save & Keep Editing</Button></div> */}
                    <Button loading={active} onClick={() => { setIsEditing((prevValue) => !prevValue) }}>{isEditing ? 'Save' : 'Edit'}</Button>
                </div>
            </Card>
        </div>
        {toastMarkup}
    </Box >)
}