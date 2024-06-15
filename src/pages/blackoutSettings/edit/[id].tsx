import ButtonEnd from '@/Components/ButtonEnd';
import { Box, Card, Text, TextField, Button, Toast, Divider, Icon, Select, Modal, LegacyCard, LegacyStack, Collapsible, Link } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import { DatePicker } from '@shopify/polaris';
import TimeSelect from '@/Components/TimeSelect'; 
import {
    MobileBackArrowMajor
} from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import QuillJs from '@/Components/QuillJs';
import ShopifyProductsSelect from "@/Components/ShopifyProductsSelect";

export default function EditSettings() {

    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})
    const [active, setActive] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date())

    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter();
    const processId = router.query.id
     
     
    /****************************************************************************/
    useEffect(() => {
        if (processId) {

            axiosInstance.get(`/api/blackoutDateTime/${processId}`).then((response) => {
                console.log('data=', response.data)
                const dt = response.data;
                
                setValues({
                    start_time: dt.start_time ? dt.start_time : '-',
                    end_time: dt.end_time ? dt.end_time : '-',
                    start_date: dt.start_date ? dt.start_date : '-',
                    end_date: dt.end_date ? dt.end_date : '-',
                    status: dt.status == 1 ? true : false,
                    apply_to_all_locations: (dt.apply_to_all_locations == 1 && dt.apply_to_all_locations != '') ? true : false,
                })
                setIsLoading(false)
            })
              
        }
    }, [processId])

    const onValuesChange = (value, name, index) => {
        setValues((prevValue) => {
            let valueBkp = { ...prevValue }
            valueBkp[name] = value

            return valueBkp
        })
    }

    const toastMarkup = active ? (
        <Toast content="Blackout Date Time Settings Edited Successfully!" onDismiss={() => {
            setActive(false)
        }} />
    ) : null;

    const onSaveAndKeepEditingHandler = useCallback(() => {

        
        axiosInstance.put(`/api/blackoutDateTime/${processId}`, values).then((response) => {
            setErrors({})
            setActive(true)
        }).catch((response) => {
            const error = response.response.data.errors
            const err = {}
            Object.keys(error).map((key) => {
                err[key] = <ul key={key} style={{ margin: 0, listStyle: 'none', padding: 0 }}>
                    {error[key].map((message, index) => {
                        let splitedKey = key.split('.');
                        let fieldTitle = splitedKey[splitedKey.length - 1].replace('_', ' ')

                        if (splitedKey.length > 1) {
                            return <li key={index} style={{ margin: 0 }}>{message.replace(key, fieldTitle)}</li>
                        } else {
                            return <li key={index} style={{ margin: 0 }}>{message}</li>
                        }
                    })}
                </ul>
            })

            setErrors({ ...err })
        })
    }, [values])

    const onClickActionHandler = () => { 

        values.minimum_cart_contents_config = JSON.stringify(values.minimum_cart_contents_config);

        axiosInstance.put(`/api/blackoutDateTime/${processId}`, values).then((response) => {
            window.location.href = `/blackoutSettings`
        }).catch((response) => {
            const error = response.response.data.errors
             
            const err = {}
            Object.keys(error).map((key) => {
                err[key] = <ul key={key} style={{ margin: 0, listStyle: 'none', padding: 0 }}>
                    {error[key].map((message, index) => {
                        let splitedKey = key.split('.');
                        let fieldTitle = splitedKey[splitedKey.length - 1].replace('_', ' ')

                        if (splitedKey.length > 1) {
                            return <li key={index} style={{ margin: 0 }}>{message.replace(key, fieldTitle)}</li>
                        } else {
                            return <li key={index} style={{ margin: 0 }}>{message}</li>
                        }
                    })}
                </ul>
            })

            setErrors({ ...err })
        });
    }

    return !isLoading && <Box minHeight='100vh' maxWidth="100%" as='section' background="bg">
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
                        <Text variant="heading3xl" alignment="center" as={'h1'} >Edit Setting</Text>
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
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'start_date')
                                }}
                                style={{ width:"30%" }}
                            />
                        </div>
                        <div style={{ width: '50%', padding: '15px' }}>
                        <TextField 
                                label="Start Date"
                                type='date'
                                min={ values.start_date }
                                value={values.end_date}
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'end_date')
                                }}
                                style={{ width:"30%" }}
                            />
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '50%', padding: '15px' }}>
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
                        <div style={{ width: '50%', padding: '15px' }}>
                        <h3 > Apply To All Locations</h3>
                            <input
                                type="radio"
                                name="apply_to_all_locations"
                                error={errors.apply_to_all_locations}
                                checked={values.status === true}
                                onChange={() => {
                                    onValuesChange(true, 'apply_to_all_locations')
                                }}
                            />
                            <label htmlFor="apply_to_all_locations_on">True</label>

                                <input
                                    type="radio"
                                    name="apply_to_all_locations"
                                    error={errors.apply_to_all_locations}
                                    checked={values.apply_to_all_locations === false}
                                    onChange={() => {
                                        onValuesChange(false, 'apply_to_all_locations')
                                    }}
                                />
                                <label htmlFor="apply_to_all_locations_off">False</label>
                        </div>
                    </div> 
                     <Divider borderColor="border" />

                    <div style={{ marginBottom: "10px", marginTop: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ marginRight: '10px' }}><Button loading={active} onClick={onSaveAndKeepEditingHandler}>Save & Keep Editing</Button></div>
                        <Button loading={active} onClick={onClickActionHandler}>Save</Button>
                    </div>
                    {/* <ButtonEnd onClickAction={onClickActionHandler} buttonName="Create Ingredient" /> */}
                </div>
            </Card>
            {toastMarkup}
        </div>
        {/* </Frame> */}
    </Box>
}