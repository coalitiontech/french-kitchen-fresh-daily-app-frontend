import ButtonEnd from '@/Components/ButtonEnd';
import { Box, Card, Text, TextField, Button, Toast, Divider, Icon, Select, Modal, LegacyCard, LegacyStack, Collapsible, Link } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import { DatePicker } from '@shopify/polaris';
import TimeSelect from '@/Components/TimeSelect'; 
import {
    MobileBackArrowMajor
} from '@shopify/polaris-icons';
import ShopifyLocationsSelect from "@/Components/ShopifyLocationsSelect";


export default function NewSettings() {
    
    const [active, setActive] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date())

    const [isLoading, setIsLoading] = useState(true)

    const [values, setValues] = useState({
        start_time: '',
        end_time: '',
        start_date: '',
        end_date: '',
        status: false,
        apply_to_all_locations: false,
        locations_id: '',
         
    })

    const [errors, setErrors] = useState({
        
        start_time: null,
        end_time: null,
        start_date: null,
        end_date: null,
        status: null,
        apply_to_all_locations: null,
        locations_id: null,
        
    })

    const onValuesChange = (value, name) => {

        setValues((prevValue) => {
            let valueBkp = { ...prevValue }
            valueBkp[name] = value
            
            return valueBkp
        })

    };

    const toastMarkup = active ? (
        <Toast content="BlackoutdateTime Created Successfully!" onDismiss={() => {
            setValues({
                start_time: '',
                end_time: '',
                start_date: '',
                end_date: '',
                status: false,
                apply_to_all_locations: false,
                locations_id: '',
            })
            setActive(false)

        }} />
    ) : null;


    const onSaveAndAddAnotherHandler = useCallback(() => {
         
        axiosInstance.post('/api/blackoutDateTime', values).then((response) => {
            setErrors({
                start_time: null,
                end_time: null,
                start_date: null,
                end_date: null,
                status: false,
                apply_to_all_locations: false,
                locations_id: null,
            })
            setActive(true)
        }).catch((response) => {
            const error = response.response.data.errors
            const err = {
                start_time: null,
                end_time: null,
                start_date: null,
                end_date: null,
                status: null,
                apply_to_all_locations: null,
                locations_id: null,
            }

            Object.keys(error).map((key) => {
                err[key] = <ul key={key} style={{ margin: 0, listStyle: 'none', padding: 0 }}>
                    {error[key].map((message, index) => {
                        return <li key={index} style={{ margin: 0 }}>{message}</li>
                    })}
                </ul>
            })

            setErrors({ ...errors, ...err })
        })
    }, [values])

    const onClickActionHandler = useCallback(() => {

        //values.minimum_cart_contents_config = JSON.stringify(values.minimum_cart_contents_config);

        axiosInstance.post('/api/blackoutDateTime', values).then((response) => {
            window.location.href = `/blackoutSettings`
        }).catch((response) => {
            const error = response.response.data.errors
            const err = {
                start_time: null,
                end_time: null,
                start_date: null,
                end_date: null,
                status: null,
                apply_to_all_locations: null,
                locations_id: null,
            }
            
            Object.keys(error).map((key) => {
                err[key] = <ul key={key} style={{ margin: 0, listStyle: 'none', padding: 0 }}>
                    {error[key].map((message, index) => {
                        return <li key={index} style={{ margin: 0 }}>{message}</li>
                    })}
                </ul>
            })

            setErrors({ ...errors, ...err })
        })
    }, [values])

    return <Box minHeight='100vh' maxWidth="100%" as='section' background="bg">
        {/* <Frame> */}
        <div style={{ maxWidth: "70%", display: 'flex', justifyContent: 'center', margin: '25px', marginLeft: 'auto', marginRight: 'auto' }}>
            <Card padding={800} >
                <div style={{ width: '4000px', maxWidth: '100%' }}>
                    <a className='back-button' href='/blackoutSettings' style={{ position: 'absolute', display: 'flex', textDecoration: 'none' }}>
                        <Icon
                            source={MobileBackArrowMajor}
                            tone="base"
                        /><span> Back</span>
                    </a>
                    <div style={{ marginBottom: "10px" }}>
                        <Text variant="heading3xl" alignment="center" as={'h1'} >New Blackout Time </Text>
                    </div>
                      
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '50%', padding: '15px' }}>
                            <TimeSelect 
                                label="Start Time"
                                type='number'
                                max={ values.end_time }
                                value={values.start_time}
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'start_time')
                                }}
                                style={{ width:"30%" }}
                            />
                        </div>
                        <div style={{ width: '50%', padding: '15px' }}>
                            <TimeSelect 
                                label="End Time"
                                type='number'
                                min={ values.start_time }
                                value={values.end_time}
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'end_time')
                                }}
                                style={{ width:"30%" }}
                            />
                        </div>
                    </div>

                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '50%', padding: '15px' }}>
                            <TextField 
                                label="Start Date"
                                type='date'
                                max={ values.end_date }
                                value={values.start_date}
                                name='start_date'
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'start_date')
                                }}
                                style={{ width:"30%" }}
                            />
                        </div>
                        <div style={{ width: '50%', padding: '15px' }}>
                        <TextField 
                                label="End Date"
                                type='date'
                                min={ values.start_date }
                                value={ values.end_date }
                                name='end_date'
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'end_date')
                                }}
                                style={{ width:"30%" }}
                            />
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '25%', padding: '15px' }}>
                            <h3 > Status</h3>
                            <input
                                type="radio"
                                name="status"
                                error={errors.status}
                                checked={values.status === true}
                                onChange={() => {
                                    onValuesChange(true, 'status')
                                }}
                            />
                            <label htmlFor="on">Enable</label>

                            <input
                                type="radio"
                                name="status"
                                error={errors.status}
                                checked={values.status === false}
                                onChange={() => {
                                    onValuesChange(false, 'status')
                                }}
                            />
                            <label htmlFor="off">Disable</label>

                        </div>
                        <div style={{ width: '25%', padding: '15px' }}>
                        <h3 > Apply To All Locations</h3>
                            <input
                                type="radio"
                                name="apply_to_all_locations"
                                error={errors.apply_to_all_locations}
                                checked={values.apply_to_all_locations === true}
                                onChange={() => {
                                    onValuesChange(true, 'apply_to_all_locations')
                                }}
                            />
                            <label htmlFor="apply_to_all_locations_on">Yes</label>

                            <input
                                type="radio"
                                name="apply_to_all_locations"
                                error={errors.apply_to_all_locations}
                                checked={values.apply_to_all_locations === false}
                                onChange={() => {
                                    onValuesChange(false, 'apply_to_all_locations')
                                }}
                            />
                            <label htmlFor="apply_to_all_locations_off">No</label>
                        </div>
                        {values.apply_to_all_locations === false && (
                        <div style={{ width: '50%', padding: '15px' }}>
                            <ShopifyLocationsSelect
                                field="locations_id"
                                title="Select Product"
                                onFieldsChange={onValuesChange}
                                validationErrors={errors.locations}
                                isEditing={true}
                                editingValues={values.locations}
                            />
                        </div>
                        )}
                    </div> 
                     <Divider borderColor="border" />

                    <div style={{ marginBottom: "10px", marginTop: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ marginRight: '10px' }}><Button loading={active} onClick={onSaveAndAddAnotherHandler}>Save & Create Another</Button></div>
                        <Button loading={active} onClick={onClickActionHandler}>Save</Button>
                    </div>
                     
                </div>
            </Card>
            {toastMarkup}
        </div>
        {/* </Frame> */}
    </Box>
}