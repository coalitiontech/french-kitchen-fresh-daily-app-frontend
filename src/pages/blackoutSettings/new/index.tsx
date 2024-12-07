import ButtonEnd from '@/Components/ButtonEnd';
import { Box, Card, Text, TextField, Button, Toast, Divider, Icon, Select, Modal, LegacyCard, LegacyStack, Collapsible, Link } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import { DatePicker } from '@shopify/polaris';
import TimeSelect from '@/Components/TimeSelect';
import {
    ArrowLeftIcon
} from '@shopify/polaris-icons';
import ShopifyLocationsSelect from "@/Components/ShopifyLocationsSelect";
import StatusSwitch from '../../../Components/Switch';


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
            setActive(false);
            setValues({
                start_time: '',
                end_time: '',
                start_date: '',
                end_date: '',
                status: false,
                apply_to_all_locations: false,
                locations_id: '',
            })
        }} />
    ) : null;


    const onSaveAndAddAnotherHandler = useCallback(() => {
        setActive(true);
        axiosInstance.post('/api/blackoutDateTime', values).then((response) => {
            setActive(false);
            setErrors({
                start_time: null,
                end_time: null,
                start_date: null,
                end_date: null,
                status: false,
                apply_to_all_locations: false,
                locations_id: null,
            })
        }).catch((response) => {
            setActive(false);

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
        setActive(false);
        //values.minimum_cart_contents_config = JSON.stringify(values.minimum_cart_contents_config);

        axiosInstance.post('/api/blackoutDateTime', values).then((response) => {
            window.location.href = `/blackoutSettings`;
            setActive(true);
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
        <div style={{ maxWidth: "90%", display: 'block', justifyContent: 'center', margin: '25px', marginLeft: 'auto', marginRight: 'auto' }}>
            <Card padding={800} >
                {/* <div style={{ width: '4000px', maxWidth: '100%' }}> */}
                <div style={{ width: '100%' }}>
                    <a className='back-button' href='/blackoutSettings' style={{ position: 'absolute', display: 'flex', textDecoration: 'none' }}>
                        <Icon
                            source={ArrowLeftIcon}
                            tone="base"
                        /><span> Back</span>
                    </a>
                    <div style={{ marginBottom: "10px" }}>
                        <Text variant="heading2xl" alignment="center" as={'h1'} >New Blackout Time </Text>
                    </div>

                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '50%', padding: '15px' }}>
                            <TimeSelect
                                label="Start Time"
                                type='number'
                                max={values.end_time}
                                value={values.start_time}
                                error={errors.start_time ? errors.start_time : false}
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'start_time')
                                }}
                                style={{ width: "30%" }}
                            />
                        </div>
                        <div style={{ width: '50%', padding: '15px' }}>
                            <TimeSelect
                                label="End Time"
                                type='number'
                                min={values.start_time}
                                value={values.end_time}
                                error={errors.end_time ? errors.end_time : false}
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'end_time')
                                }}
                                style={{ width: "30%" }}
                            />
                        </div>
                    </div>

                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '50%', padding: '15px' }}>
                            <TextField
                                label="Start Date"
                                type='date'
                                max={values.end_date}
                                value={values.start_date}
                                error={errors.start_date ? errors.start_date : false}
                                name='start_date'
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'start_date')
                                }}
                                style={{ width: "30%" }}
                            />
                        </div>
                        <div style={{ width: '50%', padding: '15px' }}>
                            <TextField
                                label="End Date"
                                type='date'
                                min={values.start_date}
                                value={values.end_date}
                                error={errors.end_date ? errors.end_date : false}
                                name='end_date'
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'end_date')
                                }}
                                style={{ width: "30%" }}
                            />
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '25%', padding: '15px' }}>
                            <h3 > Status</h3>
                            <StatusSwitch status={values.status} arrayKey={'status'} changeStatus={onValuesChange} />

                        </div>
                        <div style={{ width: '25%', padding: '15px' }}>
                            <h3 > Apply To All Locations</h3>
                            <StatusSwitch status={values.apply_to_all_locations} arrayKey={'apply_to_all_locations'} changeStatus={onValuesChange} />
                        </div>
                        {values.apply_to_all_locations === false && (
                            <div style={{ width: '50%', padding: '15px' }}>
                                <ShopifyLocationsSelect
                                    field="locations_id"
                                    title="Select Location"
                                    onFieldsChange={onValuesChange}
                                    validationErrors={errors.locations_id}
                                    isEditing={true}
                                    editingValues={values.locations}
                                    listTitle={"Suggested Locations"}
                                />
                            </div>
                        )}
                    </div>
                    <Divider borderColor="border" />

                    <div style={{ marginBottom: "10px", marginTop: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ marginRight: '10px' }}>
                            <Button loading={active} onClick={onSaveAndAddAnotherHandler} disabled={active} >{active ? 'Submitting...' : 'Save & Create Another'}</Button></div>
                            <Button loading={active} onClick={onClickActionHandler} disabled={active} > {active ? 'Submitting...' : 'Save'} </Button>
                        </div>

                </div>
            </Card>
            {toastMarkup}
        </div>
        {/* </Frame> */}
    </Box>
}