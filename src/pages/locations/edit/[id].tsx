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
import styles from '@/Components/styles.module.css';
import ShopifyProductsSelect from "@/Components/ShopifyProductsSelect";

export default function EditLocations() {

    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})
    const [active, setActive] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date())

    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter();
    const processId = router.query.id
    const initialData = {
        monday: { timeslots: { delivery: [], pickup: [] } },
        tuesday: { timeslots: { delivery: [], pickup: [] } },
        wednesday: { timeslots: { delivery: [], pickup: [] } },
        thursday: { timeslots: { delivery: [], pickup: [] } },
        friday: { timeslots: { delivery: [], pickup: [] } },
        saturday: { timeslots: { delivery: [], pickup: [] } },
        sunday: { timeslots: { delivery: [], pickup: [] } },
    };

    const initialCartConfigData = {
        delivery: { min_items: 0, min_order_total: 0.00 },
        pickup: { min_items: 0, min_order_total: 0.00 }
    };

    // Order of days from Monday to Sunday
    const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    /************************************************** */

    //const [timeslot_config_data, setTimeslotData] = useState(initialData);
    // setTimeslotData(initialData);

    const [open, setOpen] = useState({ monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false });
    const [deliveryGroupOpen, setDeliveryGroupOpen] = useState(false);
    const [pickUpGroupOpen, setPickUpGroupOpen] = useState(false);

    const handleToggle = (day) => {
        setOpen((prevOpen) => ({ ...prevOpen, [day]: !prevOpen[day] }));
    };

    const handleDeliveryToggle = () => {
        setDeliveryGroupOpen((prevOpen) => !prevOpen);
    };

    const handlePickUpToggle = () => {
        setPickUpGroupOpen((prevOpen) => !prevOpen);
    };

    const handleChange = (day, type, index, field, value) => {
        
        setValues((prevValues) => {
            const newData = { ...prevValues.timeslot_config_data };
            const valuesBkp = { ...prevValues };

            if (newData[day].timeslots && newData[day].timeslots[type]) {
                newData[day].timeslots[type][index][field] = value;
            }
            valuesBkp['timeslot_config_data'] = newData;
             
            return valuesBkp;
            
        });
         
    };

    const addDeliverySlot = (day) => {
        setValues((prevData) => {
            const newData = { ...prevData.timeslot_config_data };
            const valuesBkp = { ...prevData };
            const newSlot = { slot_start: '', slot_end: '', order_limit: null };
            if (!newData[day].timeslots) {
                newData[day].timeslots = {};
            }
            if (!newData[day].timeslots.delivery) {
                newData[day].timeslots.delivery = [];
            }
            newData[day].timeslots.delivery.push(newSlot);
            valuesBkp['timeslot_config_data'] = newData;
            return valuesBkp;
        });

    };

    const addPickupSlot = (day) => {
        setValues((prevData) => {
            const newData = { ...prevData.timeslot_config_data };
            const valuesBkp = { ...prevData };
            const newSlot = { slot_start: '', slot_end: '', order_limit: null };
            if (!newData[day].timeslots) {
                newData[day].timeslots = {};
            }
            if (!newData[day].timeslots.pickup) {
                newData[day].timeslots.pickup = [];
            }
            newData[day].timeslots.pickup.push(newSlot);
            valuesBkp['timeslot_config_data'] = newData;
            return valuesBkp;
        });

    };

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

     
    /****************************************************************************/
    useEffect(() => {
        if (processId) {

            axiosInstance.get(`/api/shopifyLocation/${processId}`).then((response) => {
                const dt = response.data;
                const mergedData = { ...initialData, ...dt.timeslot_config };
                const mergedCartConfigData = { ...initialCartConfigData, ...dt.minimum_cart_contents_config };

                setValues({
                    name: dt.name,
                    address1: dt.address1 ? dt.address1 : '',
                    address2: dt.address2 ? dt.address2 : '',
                    city: dt.city ? dt.city : '',
                    zip: dt.zip ? dt.zip : '',
                    province: dt.province ? dt.province : '',
                    country: dt.country ? dt.country : '',
                    phone: dt.phone ? dt.phone : '',
                    country_code: dt.country_code ? dt.country_code : '',
                    country_name: dt.country_name ? dt.country_name : '',
                    province_code: dt.province_code ? dt.province_code : '-',
                    timeslot_config: dt.timeslot_config ? dt.timeslot_config : '',
                    delivery_distance_limit: dt.delivery_distance_limit ? dt.delivery_distance_limit : '',
                    order_tag: dt.order_tag ? dt.order_tag : '',
                    product_eligibility: dt.product_eligibility ? dt.product_eligibility : {},
                    min_prep_time: dt.min_prep_time ? dt.min_prep_time : '',
                    custom_delivery_rate_per_mile: dt.custom_delivery_rate_per_mile ? dt.custom_delivery_rate_per_mile : '',
                    future_delivery_limit: dt.future_delivery_limit ? dt.future_delivery_limit : '',
                    minimum_cart_contents_config: mergedCartConfigData,
                    timeslot_config_data: mergedData,
                })
                setIsLoading(false)
            })
             
        }
    }, [processId])

    const onValuesChange = (value, name, index) => {
        setValues((prevValue) => {
            let valueBkp = { ...prevValue }

            console.log(valueBkp.product_eligibility.delivery);
            if (name == 'product_eligibility_delivery') {
                valueBkp.product_eligibility.delivery = value
            } else if (name == 'product_eligibility_pickup') {
                valueBkp.product_eligibility.pickup = value
            } 
            else {
                valueBkp[name] = value
            }

            return valueBkp
        })
    }

    const toastMarkup = active ? (
        <Toast content="Location Edited Successfully!" onDismiss={() => {
            setActive(false)
        }} />
    ) : null;

    const onSaveAndKeepEditingHandler = useCallback(() => {
        axiosInstance.put(`/api/shopifyLocation/${processId}`, values).then((response) => {
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
        axiosInstance.put(`/api/shopifyLocation/${processId}`, values).then((response) => {
            window.location.href = `/locations`
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
        <div style={{ maxWidth: "90%", display: 'block', justifyContent: 'center', margin: '25px', marginLeft: 'auto', marginRight: 'auto' }}>
            <Card padding={800} >
                {/* <div style={{ width: '4000px', maxWidth: '100%' }}> */}
                <div style={{ width: '100%', maxWidth: '100%' }}>
                    <a className='back-button' href='/locations' style={{ position: 'absolute', display: 'flex', textDecoration: 'none' }}>
                        <Icon
                            source={ArrowLeftIcon}
                            tone="base"
                        /><span> Back</span>
                    </a>
                    <div style={{ marginBottom: "10px" }}>
                        <Text variant="heading2xl" alignment="center" as={'h1'} >Edit Location</Text>
                    </div>
                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    readOnly='true'
                                    name='name'
                                    label="Name"
                                    error={errors.name}
                                    value={values.name}
                                    error={errors.name}
                                    autoComplete="off"
                                    onChange={(value) => {
                                        onValuesChange(value, 'name')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    readOnly='true'
                                    label="Address Line 1"
                                    type='text'
                                    value={values.address1}
                                    error={errors.address1}
                                    autoComplete="off"
                                    inputMode='text'
                                    onChange={(value) => {
                                        onValuesChange(value, 'address1')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    readOnly='true'
                                    label="Address Line 2"
                                    type='text'
                                    value={values.address2}
                                    error={errors.address2}
                                    autoComplete="off"
                                    inputMode='text'
                                    min={0}
                                    onChange={(value) => {
                                        onValuesChange(value, 'address2')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    readOnly='true'
                                    label="City"
                                    type='text'
                                    value={values.city}
                                    error={errors.city}
                                    autoComplete="off"
                                    inputMode='text'
                                    onChange={(value) => {
                                        onValuesChange(value, 'city')
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>

                            
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    readOnly='true'
                                    label="Zip"
                                    type='number'
                                    value={values.zip}
                                    error={errors.zip}
                                    autoComplete="off"
                                    inputMode='decimal'
                                    min={0}
                                    onChange={(value) => {
                                        onValuesChange(value, 'zip')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    label="Province"
                                    readOnly='true'
                                    type='text'
                                    value={values.province}
                                    error={errors.province}
                                    autoComplete="off"
                                    inputMode='text'
                                    onChange={(value) => {
                                        onValuesChange(value, 'province')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    readOnly='true'
                                    label="Country"
                                    type='text'
                                    value={values.country}
                                    error={errors.country}
                                    autoComplete="off"
                                    inputMode='text'
                                    onChange={(value) => {
                                        onValuesChange(value, 'country')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    readOnly='true'
                                    label="Phone"
                                    type='text'
                                    value={values.phone}
                                    error={errors.phone}
                                    autoComplete="off"
                                    inputMode='text'
                                    onChange={(value) => {
                                        onValuesChange(value, 'phone')
                                    }}
                                />

                            </div>
                            
                        </div>
                    </div>

                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>

                           
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    readOnly='true'
                                    label="Country Code"
                                    type='text'
                                    value={values.country_code}
                                    error={errors.country_code}
                                    autoComplete="off"
                                    inputMode='text'
                                    onChange={(value) => {
                                        onValuesChange(value, 'country_code')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    readOnly='true'
                                    label="Country Name"
                                    type='text'
                                    value={values.country_name}
                                    error={errors.country_name}
                                    autoComplete="off"
                                    inputMode='text'
                                    onChange={(value) => {
                                        onValuesChange(value, 'country_name')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    readOnly='true'
                                    label="Province Code"
                                    type='text'
                                    value={values.province_code}
                                    error={errors.province_code}
                                    autoComplete="off"
                                    inputMode='text'
                                    onChange={(value) => {
                                        onValuesChange(value, 'province_code')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    label="Future delivery Limit"
                                    type='number'
                                    value={values.future_delivery_limit}
                                    error={errors.future_delivery_limit}
                                    autoComplete="off"
                                    inputMode='decimal'
                                    onChange={(value) => {
                                        onValuesChange(value, 'future_delivery_limit')
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>

                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    label="Delivery Distance Limit"
                                    type='integer'
                                    value={values.delivery_distance_limit}
                                    error={errors.delivery_distance_limit}
                                    autoComplete="off"
                                    inputMode='integer'
                                    onChange={(value) => {
                                        onValuesChange(value, 'delivery_distance_limit')
                                    }}
                                />
                            </div>

                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    label="Order Tag"
                                    type='text'
                                    value={values.order_tag}
                                    error={errors.order_tag}
                                    autoComplete="off"
                                    inputMode='text'
                                    onChange={(value) => {
                                        onValuesChange(value, 'order_tag')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    label="Prep Time"
                                    type='number'
                                    value={values.min_prep_time}
                                    error={errors.min_prep_time}
                                    autoComplete="off"
                                    inputMode='decimal'
                                    min={0}
                                    onChange={(value) => {
                                        onValuesChange(value, 'min_prep_time')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    label="Delivery rate Per Mile"
                                    type='number'
                                    value={values.custom_delivery_rate_per_mile}
                                    error={errors.custom_delivery_rate_per_mile}
                                    autoComplete="off"
                                    inputMode='decimal'
                                    onChange={(value) => {
                                        onValuesChange(value, 'custom_delivery_rate_per_mile')
                                    }}
                                />
                            </div>
                        </div>
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
                                            min='0'
                                            inputMode='number'
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
                    <label htmlFor="no_overwrite_stock">Product Eligibility </label>

                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>
                            
                             
                                <div style={{ width: '100%', display: 'flex' }}>
                                    <div style={{ width: '50%', padding: '15px' }}>
                                        <ShopifyProductsSelect
                                            field="product_eligibility_delivery"
                                            title="Delivery"
                                            onFieldsChange={onValuesChange}
                                            validationErrors={errors.product_eligibility}
                                            isEditing={true}
                                            editingValues={values.product_eligibility.delivery}
                                        />
                                    </div>
                                    <div style={{ width: '50%', padding: '15px' }}>
                                        <ShopifyProductsSelect
                                            field="product_eligibility_pickup"
                                            onFieldsChange={onValuesChange}
                                            title="Pickup"
                                            validationErrors={errors.product_eligibility}
                                            isEditing={true}
                                            editingValues={values.product_eligibility.pickup}
                                        />
                                    </div>
                                </div>
                             
                        </div>
                    </div>
                    <label htmlFor="no_overwrite_stock">Timeslot Configuration </label>
                    {daysOrder.map((day) => (
                        <div key={day} style={{ textAlign: 'center', width:'100%', padding: '5px' }}>
                             <Button onClick={() => handleToggle(day)} ariaExpanded={open[day]} style={{ width:'100%',padding:'5px' }}  ariaControls={`${day}-collapsible`} width="100px">
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                            </Button>
                             
                            <br />
                            <Collapsible open={open[day]} id={`${day}-collapsible`} transition={{ duration: '500ms', timingFunction: 'ease-in-out' }} expandOnPrint>
                                <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }}>
                                    <div style={{ width: '100%', display: 'flex' }}>
                                        <div style={{ width: '50%', padding: '15px', margin: '10px', border: '1px solid #E3E3E3' }}>
                                            <center>Delivery</center>
                                            <center>
                                              <div style={{ width: '100%' }}>
                                                <Button className={styles.fullWidthButton}  onClick={() => addDeliverySlot(day)} ariaExpanded={deliveryGroupOpen} ariaControls="delivery-config-new-group">
                                                    Add New Time Slot
                                                </Button>
                                              </div>
                                            </center>
                                            {values.timeslot_config_data[day].timeslots && values.timeslot_config_data[day].timeslots.delivery && values.timeslot_config_data[day].timeslots.delivery.map((slot, index) => (
                                                <div key={index} style={{ padding: '15px', margin: '10px', border: '1px solid #E3E3E3' }} >
                                                    <div style={{ width: '100%', display: 'flex' }}>
                                                        <div style={{ width: '50%', padding: '15px' }}>
                                                            <TimeSelect 
                                                             label="Slot Start"
                                                             type='number'
                                                             max={ slot.slot_end }
                                                             value={slot.slot_start}
                                                             autoComplete="off"
                                                             onChange={(value) => handleChange(day, 'delivery', index, 'slot_start', value)} 
                                                             style={{ width:"30%" }}
                                                            />
                                                            {/* <TextField
                                                                label="Slot Start"
                                                                type='number'
                                                                max={slot.slot_end}
                                                                value={slot.slot_start}
                                                                autoComplete="off"
                                                                onChange={(value) => handleChange(day, 'delivery', index, 'slot_start', value)}
                                                            /> */}
                                                        </div>
                                                        <div style={{ width: '50%', padding: '15px' }}>
                                                            <TimeSelect 
                                                                label="Slot End"
                                                                type='number'
                                                                min={slot.slot_start}
                                                                value={slot.slot_end}
                                                                autoComplete="off"
                                                                onChange={(value) => handleChange(day, 'delivery', index, 'slot_end', value)} 
                                                                style={{ width:"30%" }}
                                                            />

                                                            {/* <TextField
                                                                label="Slot End"
                                                                type='number'
                                                                min={slot.slot_start}
                                                                value={slot.slot_end}
                                                                autoComplete="off"
                                                                onChange={(value) => handleChange(day, 'delivery', index, 'slot_end', value)}
                                                            /> */}
                                                        </div>
                                                    </div>
                                                    <div style={{ width: '100%', display: 'flex' }}>
                                                        <div style={{ width: '100%', padding: '15px' }}>
                                                            <TextField
                                                                label="Order Limit"
                                                                type='number'
                                                                value={slot.order_limit !== null ? slot.order_limit : ''}
                                                                autoComplete="off"
                                                                onChange={(value) => handleChange(day, 'delivery', index, 'order_limit', value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ width: '50%', padding: '15px', margin: '10px', border: '1px solid #E3E3E3' }}>
                                            <center>Pick Up</center>
                                            <center>
                                                <Button onClick={() => addPickupSlot(day)} ariaExpanded={pickUpGroupOpen} ariaControls="pickUp-config-new-group">
                                                    Add New Time Slot
                                                </Button>
                                            </center>
                                            {values.timeslot_config_data[day].timeslots && values.timeslot_config_data[day].timeslots.pickup && values.timeslot_config_data[day].timeslots.pickup.map((slot, index) => (
                                                <div key={index} style={{border: '1px solid #E3E3E3'}}>
                                                    <div style={{ width: '100%', display: 'flex'  }}>
                                                        <div style={{ width: '50%', padding: '15px' }}>
                                                            <TimeSelect 
                                                             label="Slot Start"
                                                             type='number'
                                                             max={ slot.slot_end }
                                                             value={slot.slot_start}
                                                             autoComplete="off"
                                                             onChange={(value) => handleChange(day, 'pickup', index, 'slot_start', value)} 
                                                             style={{ width:"20%" }}
                                                            />
                                                            {/* <TextField
                                                                label="Slot Start"
                                                                type='text'
                                                                value={slot.slot_start}
                                                                autoComplete="off"
                                                                onChange={(value) => handleChange(day, 'pickup', index, 'slot_start', value)}
                                                            /> */}
                                                        </div>
                                                        <div style={{ width: '50%', padding: '15px' }}>
                                                            <TimeSelect 
                                                                label="Slot End"
                                                                type='number'
                                                                min={slot.slot_start}
                                                                value={slot.slot_end}
                                                                autoComplete="off"
                                                                onChange={(value) => handleChange(day, 'pickup', index, 'slot_end', value)} 
                                                                style={{ width:"20%" }}
                                                            />
                                                            {/* <TextField
                                                                label="Slot End"
                                                                type='text'
                                                                value={slot.slot_end}
                                                                autoComplete="off"
                                                                onChange={(value) => handleChange(day, 'pickup', index, 'slot_end', value)}
                                                            /> */}
                                                        </div>

                                                    </div>
                                                    <div style={{ width: '100%', display: 'flex' }}>
                                                        <div style={{ width: '100%', padding: '15px' }}>
                                                            <TextField
                                                                label="Order Limit"
                                                                type='number'
                                                                value={slot.order_limit !== null ? slot.order_limit : ''}
                                                                autoComplete="off"
                                                                onChange={(value) => handleChange(day, 'pickup', index, 'order_limit', value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Collapsible>
                        </div>
                    ))}

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