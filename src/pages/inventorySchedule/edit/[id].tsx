import ButtonEnd from '@/Components/ButtonEnd';
import { Box, Card, Text, TextField, Button, Toast, Divider, Icon, Select, Modal, LegacyCard, LegacyStack, Collapsible, Link } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import { DatePicker } from '@shopify/polaris';
import TimeSelect from '@/Components/TimeSelect'; 
import ShopifyVariantSelect from "@/Components/ShopifyVariantSelect";
 
import DateTimeSelect from '@/Components/DateTimeSelect';
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

            axiosInstance.get(`/api/inventorySchedule/${processId}`).then((response) => {
                console.log('data=', response.data)
                const dt = response.data;
                
                setValues({
                    quantity: dt.quantity,
                    stock_datetime: dt.stock_datetime,
                    overwrite_stock: dt.overwrite_stock,
                    is_active: dt.is_active == 1 ? true : false,
                    recurring_config: dt.recurring_config, 
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
        <Toast content="Inventory Schedule Updated Successfully!" onDismiss={() => {
            setActive(false)
        }} />
    ) : null;

    const onSaveAndKeepEditingHandler = useCallback(() => {

        
        axiosInstance.put(`/api/inventorySchedule/${processId}`, values).then((response) => {
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

        axiosInstance.put(`/api/inventorySchedule/${processId}`, values).then((response) => {
            window.location.href = `/inventorySchedule`
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
                    <a className='back-button' href='/inventorySchedule' style={{ position: 'absolute', display: 'flex', textDecoration: 'none' }}>
                        <Icon
                            source={MobileBackArrowMajor}
                            tone="base"
                        /><span> Back</span>
                    </a>
                    <div style={{ marginBottom: "10px" }}>
                        <Text variant="heading3xl" alignment="center" as={'h1'} >Edit Setting</Text>
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