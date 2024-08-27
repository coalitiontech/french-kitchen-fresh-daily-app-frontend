import ButtonEnd from '@/Components/ButtonEnd';
import { Box, Card, Text, TextField, Button, Toast, Divider, Icon, Select, Modal, LegacyCard, LegacyStack, Collapsible, Link } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import { DatePicker } from '@shopify/polaris';
import TimeSelect from '@/Components/TimeSelect'; 
import {
    ArrowLeftIcon
} from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import QuillJs from '@/Components/QuillJs';
import ShopifyProductsSelect from "@/Components/ShopifyProductsSelect";

export default function NewSettings() {

    
    const [active, setActive] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date())

    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter();
    const processId = router.query.id
     
    const initialCartConfigData = {
        delivery: { min_items: 0, min_order_total: 0.00 },
        pickup: { min_items: 0, min_order_total: 0.00 }
    };

    const [values, setValues] = useState({
        minimum_cart_contents_config: initialCartConfigData
         
    })

    const [errors, setErrors] = useState({
        minimum_cart_contents_config: null
    })
    
    const handleCartChange = (type, field, value) => {
       
        setValues((prevValues) => {
            const newData = { ...prevValues.minimum_cart_contents_config };
            const valuesCartBkp = { ...prevValues };
             
            if (!newData[type]) {
                newData[type] = {};
            }
            newData[type][field] = value;
            valuesCartBkp['minimum_cart_contents_config'] = newData;

            return valuesCartBkp;
        });
    };

    const onValuesChange = (value, name) => {

        setValues((prevValues) => ({
            ...prevValues,
        }));


    };

    const toastMarkup = active ? (
        <Toast content="Setting Created Successfully!" onDismiss={() => {
            setValues({
                minimum_cart_contents_config: initialCartConfigData
            })
            setActive(false)

        }} />
    ) : null;


    const onSaveAndAddAnotherHandler = useCallback(() => {
         
        axiosInstance.post('/api/settings', values).then((response) => {
            setErrors({
                minimum_cart_contents_config: null
            })
            setActive(true)
        }).catch((response) => {
            const error = response.response.data.errors
            const err = {
                minimum_cart_contents_config: null
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
        axiosInstance.post('/api/settings', values).then((response) => {
            window.location.href = `/settings`
        }).catch((response) => {
            const error = response.response.data.errors
            const err = {
                minimum_cart_contents_config: null
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
        <div style={{ maxWidth: "90%", width: '100%', display: 'block', justifyContent: 'center', margin: '25px', marginLeft: 'auto', marginRight: 'auto' }}>
            <Card padding={800} >
                {/* <div style={{ width: '4000px', maxWidth: '100%' }}> */}
                <div style={{ width: '100%' }}>
                    <a className='back-button' href='/settings' style={{ position: 'absolute', display: 'flex', textDecoration: 'none' }}>
                        <Icon
                            source={ArrowLeftIcon}
                            tone="base"
                        /><span> Back</span>
                    </a>
                    <div style={{ marginBottom: "10px" }}>
                        <Text variant="heading2xl" alignment="center" as={'h1'} >New Setting</Text>
                    </div>
                      
                    <label htmlFor="no_overwrite_stock">Cart Content Config </label>

                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >

                        <div style={{ width: '100%', display: 'flex' }}>
                            
                            <div style={{ width: '50%', padding: '15px', margin: '10px', border: '1px solid #E3E3E3' }}>
                                <center>Delivery</center>
                                <div style={{ width: '100%', display: 'flex' }}>
                                    <div style={{ width: '50%', padding: '15px' }}>
                                        <TextField
                                            label="Minimum Items"
                                            name="min_items"
                                            type='number'
                                            value={values.minimum_cart_contents_config.delivery.min_items}
                                            error={errors.minimum_cart_contents_config}
                                            autoComplete="off"
                                            inputMode='number'
                                            min='0'
                                            onChange={(value) => handleCartChange('delivery', 'min_items', value)}
                                              
                                        />
                                    </div>
                                    <div style={{ width: '50%', padding: '15px' }}>
                                        <TextField
                                            label="Minimum Order Total ($)"
                                            type='number'
                                            value={values.minimum_cart_contents_config.delivery.min_order_total}
                                            error={errors.minimum_cart_contents_config}
                                            autoComplete="off"
                                            min='0'
                                            inputMode='number'
                                            onChange={(value) => handleCartChange('delivery', 'min_order_total', value)}
                                        /> 
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: '50%', padding: '15px', margin: '10px', border: '1px solid #E3E3E3' }}>
                                <center>Pick Up</center>
                                <div style={{ width: '100%', display: 'flex' }}>
                                    <div style={{ width: '50%', padding: '15px' }}>
                                        <TextField
                                            label="Minimum Items"
                                            type='number'
                                            value={values.minimum_cart_contents_config.pickup.min_items}
                                            error={errors.minimum_cart_contents_config}
                                            autoComplete="off"
                                            min='0'
                                            inputMode='number'
                                            onChange={(value) => handleCartChange('pickup', 'min_items', value)}
                                        />
                                    </div> 
                                   
                                    <div style={{ width: '50%', padding: '15px' }}>
                                        <TextField
                                            label="Minimum Order Total ($)"
                                            type='number'
                                            value={values.minimum_cart_contents_config.pickup.min_order_total}
                                            error={errors.min_order_total}
                                            autoComplete="off"
                                            min='0'
                                            inputMode='number'
                                            onChange={(value) => handleCartChange('pickup', 'min_order_total', value)}
                                        /> 
                                    </div>
                                </div>
                            </div>

                        </div>
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