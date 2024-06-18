import ButtonEnd from '@/Components/ButtonEnd';
import { Box, Card, Text, TextField, Button, Toast, Divider, Icon, Select, Modal, LegacyCard, LegacyStack, Collapsible, Link } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import { DatePicker } from '@shopify/polaris';
import TimeSelect from '@/Components/TimeSelect'; 
import ShopifyVariantSelect from "@/Components/ShopifyVariantSelect";
import ShopifyProductsSelect from "@/Components/ShopifyProductsSelect";
import DateTimeSelect from '@/Components/DateTimeSelect';
import moment from 'moment';

import {
    MobileBackArrowMajor
} from '@shopify/polaris-icons';

export default function NewSettings() {
    
    
    const [active, setActive] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date())

    const [isLoading, setIsLoading] = useState(true)
 
    const [values, setValues] = useState({
        quantity: '',
        blackout_dates: '',
        stock_datetime: '',
        overwrite_stock: false,
        is_active: false,
        recurring_config: '',
         
    })

    const [errors, setErrors] = useState({
        quantity: null,
        blackout_dates: null,
        stock_datetime: null,
        overwrite_stock: null,
        is_active: false,
        recurring_config: null,
        
    })

    const onValuesChange = (value, name) => {
        
        setValues((prevValue) => {
            let valueBkp = { ...prevValue }
            if(name == 'stock_datetime')
            {
                const formattedDate = moment(value).format('YYYY-MM-DD HH:mm:ss');
                valueBkp[name] = formattedDate;
        console.log(name+ '= ', formattedDate);

            }
            else
            {
                valueBkp[name] = value
            }
            
            return valueBkp
        })

    };

    const toastMarkup = active ? (
        <Toast content="Inventory Schedule Added Successfully!" onDismiss={() => {
            setValues({
                quantity: '',
                blackout_dates: '',
                stock_datetime: '',
                overwrite_stock: false,
                is_active: false,
                recurring_config: '',
            })
            setActive(false)

        }} />
    ) : null;


    const onSaveAndAddAnotherHandler = useCallback(() => {
         
        axiosInstance.post('/api/inventorySchedule', values).then((response) => {
            setErrors({
                quantity: null,
                blackout_dates: null,
                stock_datetime: null,
                overwrite_stock: false,
                is_active: false,
                recurring_config: null,
            })
            setActive(true)
        }).catch((response) => {
            const error = response.response.data.errors
            const err = {
                quantity: null,
                blackout_dates: null,
                stock_datetime: null,
                overwrite_stock: null,
                is_active: false,
                recurring_config: null,
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

        axiosInstance.post('/api/inventorySchedule', values).then((response) => {
            window.location.href = `/inventorySchedule`
        }).catch((response) => {
            const error = response.response.data.errors
            const err = {
                quantity: null,
                blackout_dates: null,
                stock_datetime: null,
                overwrite_stock: null,
                is_active: false,
                recurring_config: null,
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
        <div style={{ maxWidth: "70%", display: 'flex', justifyContent: 'center', margin: '25px', marginLeft: 'auto', marginRight: 'auto', overflow: 'visible' }}>
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
                        <div style={{ width: '33%', padding: '15px' }}>
                            <ShopifyProductsSelect
                                field="shopify_product_id"
                                title="Shopify Product"
                                onFieldsChange={onValuesChange}
                                validationErrors={errors.shopify_product_id}
                                isEditing={true}
                                editingValues={values.shopify_product_id}
                            />
                        </div>
                        {/* <div style={{ width: '25%', padding: '15px' }}>
                            <ShopifyVariantSelect
                                field="variant_config"
                                title="Variant"
                                onFieldsChange={onValuesChange}
                                validationErrors={errors.variant_config}
                                isEditing={true}
                                editingValues={values.variant_config}
                            />
                        </div>
                        <div style={{ width: '25%', padding: '15px' }}>
                            <ShopifyVariantSelect
                                field="variant_quantity"
                                title="Variant Quantity"
                                onFieldsChange={onValuesChange}
                                validationErrors={errors.variant_config}
                                isEditing={true}
                                editingValues={values.variant_config}
                            />
                        </div> */}
                        <div style={{ width: '33%', padding: '15px' }}>
                            <TextField 
                                label="Quantity"
                                type='number'
                                min="0"
                                value={values.quantity}
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'quantity')
                                }}
                                style={{ width:"30%" }}
                            />
                        </div> 
                        <div style={{ width: '33%', padding: '15px' }}>
                            <h3 > Active</h3>
                            <input
                                type="radio"
                                name="is_active"
                                error={errors.is_active}
                                checked={values.is_active === true}
                                onChange={() => {
                                    onValuesChange(true, 'is_active')
                                }}
                            />
                            <label htmlFor="on">Enable</label>

                            <input
                                type="radio"
                                name="is_active"
                                error={errors.is_active}
                                checked={values.is_active === false}
                                onChange={() => {
                                    onValuesChange(false, 'is_active')
                                }}
                            />
                            <label htmlFor="off">Disable</label>

                        </div>
                         
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        
                        <div style={{ width: '33%', padding: '15px' }}>
                        <h3> Overwrite Stock</h3>
                            <input
                                type="radio"
                                name="overwrite_stock"
                                error={errors.overwrite_stock}
                                checked={values.overwrite_stock === true}
                                onChange={() => {
                                    onValuesChange(true, 'overwrite_stock')
                                }}
                            />
                            <label htmlFor="overwrite_stock">True</label>
                                <input
                                    type="radio"
                                    name="overwrite_stock"
                                    error={errors.overwrite_stock}
                                    checked={values.overwrite_stock === false}
                                    onChange={() => {
                                        onValuesChange(false, 'overwrite_stock')
                                    }}
                                />
                            <label htmlFor="overwrite_stock">False</label>
                        </div>
                        <div style={{ width: '33%', padding: '15px' }}>
                            <DateTimeSelect 
                                label="Stock Datetime"
                                name="stock_datetime"
                                value={values.stock_datetime}
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'stock_datetime')
                                }}
                                style={{ width:"30%", overflow: "visible" }}
                            />
                        </div> 
                        <div style={{ width: '33%', padding: '15px' }}>
                            <TextField 
                                label="Recurring Config"
                                name="recurring_config"
                                 min="0"
                                value={values.recurring_config}
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'recurring_config')
                                }}
                                style={{ width:"30%" }}
                            />
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