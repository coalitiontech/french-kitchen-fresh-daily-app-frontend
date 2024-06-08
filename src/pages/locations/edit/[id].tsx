import ButtonEnd from '@/Components/ButtonEnd';
import { Box, Card, Text, TextField, Button, Toast, Divider, Icon, Select, Modal, LegacyCard, LegacyStack, Collapsible, Link } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import { DatePicker } from '@shopify/polaris';
import {
    MobileBackArrowMajor
} from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import QuillJs from '@/Components/QuillJs'; 
import ShopifyProductsSelect from "@/Components/ShopifyProductsSelect";

export default function EditLocations() {

    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})
    const [active, setActive] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date())

    const [isLoading, setIsLoading] = useState(true)

    const [clearValue, setClearValue] = useState(false);
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

    //   const addPickupSlot = (day) => {
    //     setTimeslotData((prevData) => {
    //       const newData = { ...prevData };
    //       const newSlot = { slot_start: '', slot_end: '', order_limit: null };
    //       if (!newData[day].timeslots) {
    //         newData[day].timeslots = {};
    //       }
    //       if (!newData[day].timeslots.pickup) {
    //         newData[day].timeslots.pickup = [];
    //       }
    //       newData[day].timeslots.pickup.push(newSlot);
    //       return newData;
    //     });
    //   };

    /****************************************************************************/
    useEffect(() => {
        if (processId) {

            axiosInstance.get(`/api/shopifyLocation/${processId}`).then((response) => {
                const dt = response.data;

                const mergedData = { ...initialData, ...dt.timeslot_config };
                
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
                    product_eligibility: dt.product_eligibility ? dt.product_eligibility : '',
                    min_prep_time: dt.min_prep_time ? dt.min_prep_time : '',
                    custom_delivery_rate_per_mile: dt.custom_delivery_rate_per_mile ? dt.custom_delivery_rate_per_mile : '',
                    future_delivery_limit: dt.future_delivery_limit ? dt.future_delivery_limit : '',
                    minimum_cart_contents_config: dt.minimum_cart_contents_config ? dt.minimum_cart_contents_config : '',
                    timeslot_config_data: mergedData,
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
            //window.location.href = `/locations`
        }).catch((response) => {
            const error = response.response.data.errors
            console.log('in errors= '.error)
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
                    <a className='back-button' href='/shopifyLocation' style={{ position: 'absolute', display: 'flex', textDecoration: 'none' }}>
                        <Icon
                            source={MobileBackArrowMajor}
                            tone="base"
                        /><span> Back</span>
                    </a>
                    <div style={{ marginBottom: "10px" }}>
                        <Text variant="heading3xl" alignment="center" as={'h1'} >Edit Location</Text>
                    </div>
                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>
                            <div style={{ width: '33%', padding: '15px' }}>
                                <TextField
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
                            <div style={{ width: '33%', padding: '15px' }}>
                                <TextField
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
                            <div style={{ width: '33%', padding: '15px' }}>
                                <TextField
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
                        </div>
                    </div>
                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>

                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
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
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
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
                        </div>
                    </div>

                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>

                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
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
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
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
                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>
                            <div style={{ width: '50%', padding: '15px' }}>
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
                            <div style={{ width: '50%', padding: '15px' }}>
                                <TextField
                                    label="minimum_cart_contents_config"
                                    type='text'
                                    value={values.minimum_cart_contents_config}
                                    error={errors.minimum_cart_contents_config}
                                    autoComplete="off"
                                    inputMode='text'
                                    onChange={(value) => {
                                        onValuesChange(value, 'minimum_cart_contents_config')
                                    }}
                                />
                            </div>
                            
                        </div>
                    </div>
                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>
                            <div style={{ width: '50%', padding: '15px' }}>
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
                           
                            <div style={{ width: '50%', display: 'flex', border: '1px solid #E3E3E3' }}>
                                <div style={{ width: '100%', display: 'flex' }}>
                                    <center>Product</center>
                                    <div style={{ width: '50%', padding: '15px' }}>
                                        <ShopifyProductsSelect
                                            title="product_eligibility_delivery"
                                            //onFieldsChange={onFieldsChange}
                                            //clearValue={clearValue}
                                            validationErrors={errors.product_eligibility}
                                           // isEditing={isEditing}
                                           // groupIndex={index}
                                            //response={ingredientResponse}
                                            editingValues={values.product_eligibility.delivery}
                                           // editingFields={item['ingredients']}
                                           // updateDefaultOptions={updateDefaultOptionsHandler}
                                        />
                                    </div>
                                    <div style={{ width: '50%', padding: '15px' }}>
                                        <ShopifyProductsSelect
                                            title="product_eligibility_pickup"
                                            //onFieldsChange={onFieldsChange}
                                            //clearValue={clearValue}
                                            validationErrors={errors.product_eligibility}
                                           // isEditing={isEditing}
                                           // groupIndex={index}
                                            //response={ingredientResponse}
                                            editingValues={values.product_eligibility.pickup}
                                           // editingFields={item['ingredients']}
                                           // updateDefaultOptions={updateDefaultOptionsHandler}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <label htmlFor="no_overwrite_stock">Timeslot Configuration </label>                
                    {daysOrder.map((day) => (
                        <div key={day}>
                            <Button onClick={() => handleToggle(day)} ariaExpanded={open[day]} ariaControls={`${day}-collapsible`}>
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                            </Button>
                            <br />
                            <Collapsible open={open[day]} id={`${day}-collapsible`} transition={{ duration: '500ms', timingFunction: 'ease-in-out' }} expandOnPrint>
                                <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }}>
                                    <div style={{ width: '100%', display: 'flex' }}>
                                        <div style={{ width: '50%', padding: '15px', margin: '10px', border: '1px solid #E3E3E3' }}>
                                            <center>Delivery</center>
                                            <center>
                                                <Button onClick={() => addDeliverySlot(day)} ariaExpanded={deliveryGroupOpen} ariaControls="delivery-config-new-group">
                                                    Add New Time Slot
                                                </Button>
                                            </center>
                                            {values.timeslot_config_data[day].timeslots && values.timeslot_config_data[day].timeslots.delivery && values.timeslot_config_data[day].timeslots.delivery.map((slot, index) => (
                                                <div key={index}>
                                                    <div style={{ width: '100%', display: 'flex' }}>
                                                        <div style={{ width: '50%', padding: '15px' }}>
                                                            <TextField
                                                                label="Slot Start"
                                                                type='text'
                                                                value={slot.slot_start}
                                                                autoComplete="off"
                                                                onChange={(value) => handleChange(day, 'delivery', index, 'slot_start', value)}
                                                            />
                                                        </div>
                                                        <div style={{ width: '50%', padding: '15px' }}>
                                                            <TextField
                                                                label="Slot End"
                                                                type='text'
                                                                value={slot.slot_end}
                                                                autoComplete="off"
                                                                onChange={(value) => handleChange(day, 'delivery', index, 'slot_end', value)}
                                                            />
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
                                                <div key={index}>
                                                    <div style={{ width: '100%', display: 'flex' }}>
                                                        <div style={{ width: '50%', padding: '15px' }}>
                                                            <TextField
                                                                label="Slot Start"
                                                                type='text'
                                                                value={slot.slot_start}
                                                                autoComplete="off"
                                                                onChange={(value) => handleChange(day, 'pickup', index, 'slot_start', value)}
                                                            />
                                                        </div>
                                                        <div style={{ width: '50%', padding: '15px' }}>
                                                            <TextField
                                                                label="Slot End"
                                                                type='text'
                                                                value={slot.slot_end}
                                                                autoComplete="off"
                                                                onChange={(value) => handleChange(day, 'pickup', index, 'slot_end', value)}
                                                            />
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