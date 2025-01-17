import { Box, Card, Text, TextField, Button, Toast, Divider, Icon, Select, Modal, LegacyCard, LegacyStack, Collapsible, Link, Autocomplete, Checkbox, Tag } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import DateTimeSelect from '@/Components/DateTimeSelect';
import moment from 'moment';
import ShopifyLocationsSelect from "@/Components/ShopifyLocationsSelect";
import {
    ArrowLeftIcon
} from '@shopify/polaris-icons';
import StatusSwitch from '../../../Components/Switch';

export default function NewSettings() {

    const [active, setActive] = useState(false);

    const [values, setValues] = useState({
        quantity: '',
        display_name: '',
        blackout_dates: '',
        overwrite_stock: false,
        is_active: false,
        recurring_config: { type: 'dnr', days: [] },
        shopify_product_id: '',
        variant_config: '',
        apply_to_all_locations: false,
        locations_id: '',
        starting_date: moment().format('YYYY-MM-DD'),
        ending_date: '',
        stock_time: moment().format('YYYY-MM-DD HH:mm:ss'),
    })

    const [errors, setErrors] = useState({})

    const onValuesChange = (value, name) => {

        setValues((prevValue) => {
            let valueBkp = { ...prevValue }

            valueBkp[name] = value

            return valueBkp
        })

    };

    const toastMarkup = active ? (
        <Toast content="Inventory Schedule Added Successfully!" onDismiss={() => {
            setValues({
                quantity: '',
                display_name: '',
                blackout_dates: '',
                overwrite_stock: false,
                is_active: false,
                recurring_config: { type: 'dnr', days: [] },
                shopify_product_id: '',
                variant_config: '',
                apply_to_all_locations: false,
                locations_id: '',
                starting_date: moment().format('YYYY-MM-DD'),
                ending_date: '',
                stock_time: moment().seconds(0).format('YYYY-MM-DD HH:mm:ss'),
            })
            setSelectedProduct(null);
            setProductVariants([])
            setProductInputValue('')
            setActive(false);

        }} />
    ) : null;


    const onSaveAndAddAnotherHandler = useCallback(() => {
        setActive(false);

        axiosInstance.post('/api/inventorySchedule', values).then((response) => {
            setErrors({})
            setActive(true);
        }).catch((response) => {
            const error = response.response.data.errors
            const err = {}

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
        axiosInstance.post('/api/inventorySchedule', values).then((response) => {
            window.location.href = `/inventorySchedule`;
            setActive(true);
        }).catch((response) => {
            const error = response.response.data.errors
            const err = {}

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

    /************************************************ */

    const [productinputValue, setProductInputValue] = useState('');
    const [productSelectedOptions, setProductSelectedOptions] = useState<string[]>([]);

    const [productOptions, setProductOptions] = useState([{ label: 'None', value: '' }]);
    const [productOptionsLabel, setProductOptionsLabel] = useState<string[]>([]);

    useEffect(() => {
        axiosInstance.get('/api/select/singleShopifyProduct?title=' + productinputValue).then((response) => {
            setProductOptions([{ label: 'None', value: '' }, ...response.data.selectData]);
            setProductOptionsLabel(response.data.optionsLabel);
        })
    }, [productinputValue]);

    const updateCatText = useCallback(
        (value: string) => {
            setProductInputValue(value);
        },
        [],
    );

    const updateProductSelection = useCallback(

        (selected: string[]) => {
            const selectedValue = selected.map((selectedItem) => {
                const matchedOption = productOptions.find((option) => {
                    setValues((prevValues) => ({
                        ...prevValues,
                        'shopify_product_id': selectedItem
                    }));

                    updateCatText('');
                    return option.value.match(selectedItem);
                });
                setSelectedProduct(selectedItem);
                return matchedOption && matchedOption.label;
            });
            setProductSelectedOptions(selected);
            setProductInputValue(selectedValue[0] || '');
        },
        [productOptions],
    );

    let productVerticalContentMarkup =
        values.shopify_product_id > 0 ? (

            <LegacyStack spacing="extraTight" alignment="center">
                <Tag key={values.shopify_product_id} >
                    {productOptionsLabel[values.shopify_product_id]}
                </Tag>
            </LegacyStack>
        ) : null;

    const productTextField = (
        <Autocomplete.TextField
            onChange={updateCatText}
            error={errors.shopify_product_id}
            value={productinputValue}
            //prefix={<Icon source={SearchIcon} tone="base" />}
            placeholder="Search Product"
            verticalContent={productVerticalContentMarkup}
            autoComplete="off"
            name="shopify_product_id"
            label="Shopify Product"
            key="shopify_product_id"
        />
    );

    /**************************************************** */

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productVariants, setProductVariants] = useState([]);
    const [numberOfProductVariants, setNumberOfProductVariants] = useState(0);

    useEffect(() => {
        if (selectedProduct != '') {
            axiosInstance.get(`/api/select/productVariant/${selectedProduct}`)
                .then((response) => {

                    if (response.data) {
                        setProductVariants(response.data.selectData);
                        setNumberOfProductVariants(response.data.selectData.length);
                    }

                })
                .catch((error) => {
                    console.error('Error fetching product variants:', error);
                });
        }
    }, [selectedProduct]);


    const handleVariantChange = useCallback((variantId, event, quantity) => {
        const checked = event;

        setValues(prevValues => {
            const updatedVariantConfig = { ...prevValues.variant_config };
            if (checked) {
                updatedVariantConfig[variantId] = {
                    ...updatedVariantConfig[variantId],
                    selected: checked,
                    quantity: updatedVariantConfig[variantId]?.quantity || 0
                };
            } else {
                delete updatedVariantConfig[variantId];
            }
            return {
                ...prevValues,
                variant_config: updatedVariantConfig
            };
        });

    }, []);

    const handleQuantityChange = (variantId, quantity) => {
        setValues((prevValues) => ({
            ...prevValues,
            variant_config: {
                ...prevValues.variant_config,
                [variantId]: {
                    ...prevValues.variant_config?.[variantId],
                    quantity: Number(quantity)
                }
            }
        }));
        if (numberOfProductVariants == 1) {
            setValues((prevValues) => ({
                ...prevValues,
                quantity: Number(quantity),
                variant_config: {
                    ...prevValues.variant_config,
                    [variantId]: {
                        ...prevValues.variant_config?.[variantId],
                        quantity: Number(quantity)
                    }
                }
            }));

        }

    };

    const handleChange = (variantId, e) => {

        const value = e;
        handleQuantityChange(variantId, value);
    };

    const recurringOptions = [
        { label: 'Does not repeat', value: 'dnr' },
        { label: 'Daily', value: 'Daily' },
        { label: 'Per Week', value: 'Per Week' },
    ];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const handleRecurringConfigChange = (e) => {
        const value = e;
        setValues((prevValues) => ({
            ...prevValues,
            recurring_config: {
                ...prevValues.recurring_config,
                type: value,
                days: value === 'Per Week' ? prevValues.recurring_config.days : [] // reset days if not Per Week
            }
        }));
    };

    const handleDaysChange = (day) => {
        setValues((prevValues) => {
            const newDays = prevValues.recurring_config.days.includes(day)
                ? prevValues.recurring_config.days.filter(d => d !== day)
                : [...prevValues.recurring_config.days, day];

            return {
                ...prevValues,
                recurring_config: {
                    ...prevValues.recurring_config,
                    days: newDays
                }
            };
        });
    };

    /** ************************************************************************ */

    return <Box minHeight='100vh' maxWidth="100%" as='section' background="bg">
        {/* <Frame> */}
        <div style={{ maxWidth: "90%", width: '100%', display: 'block', justifyContent: 'center', margin: '25px', marginLeft: 'auto', marginRight: 'auto', overflow: 'visible' }}>
            <Card padding={800} >
                {/* <div style={{ width: '4000px', maxWidth: '100%' }}> */}
                <div style={{ width: '100%', maxWidth: '100%' }}>
                    <a className='back-button' href='/inventorySchedule' style={{ position: 'absolute', display: 'flex', textDecoration: 'none' }}>
                        <Icon
                            source={ArrowLeftIcon}
                            tone="base"
                        /><span> Back</span>
                    </a>
                    <div style={{ marginBottom: "10px" }}>
                        <Text variant="heading2xl" alignment="center" as={'h1'} >New Inventory Schedule </Text>
                    </div>

                    <div style={{ width: '100%', display: 'flex' }}>

                        <div style={{ width: '55%', padding: '15px' }}>
                            <Autocomplete
                                title="Product"
                                options={productOptions}
                                error={errors.name}
                                selected={productSelectedOptions}
                                textField={productTextField}
                                onSelect={updateProductSelection}
                                listTitle="Suggested Products"
                                fieldName="shopify_product_id"
                                fieldKey="shopify_product_id"
                            />
                        </div>

                        <div style={{ width: '15%', padding: '15px' }}>
                            <TextField
                                placeholder="Display Name"
                                label="Display Name"
                                value={values.display_name}
                                onChange={(value) => onValuesChange(value, 'display_name')}
                            />
                        </div>
                        <div style={{ width: '15%', padding: '15px' }}>
                            <h3> Active</h3>
                            <StatusSwitch status={values.is_active} arrayKey={'is_active'} changeStatus={onValuesChange} />
                        </div>
                        <div style={{ width: '15%', padding: '15px' }}>
                            <h3> Overwrite Stock</h3>
                            <StatusSwitch status={values.overwrite_stock} arrayKey={'overwrite_stock'} changeStatus={onValuesChange} />
                        </div>
                    </div>
                    {productVariants.length > 0 && selectedProduct !== '' && (
                        <div style={{ width: '100%' }}>
                            <h3>Product Variants</h3>
                            <div style={{ display: 'grid', alignItems: 'center', marginBottom: '10px', padding: '10px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                {productVariants.map((variant) => (
                                    <div key={variant.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
                                        <div style={{ padding: '5px' }}>
                                            {variant.img_src != "" && (
                                                <img src={variant.img_src} style={{ width: '120px', height: '100px', border: '1px solid black', padding: '15px', borderRadius: '15px' }}
                                                />
                                            )}
                                        </div>
                                        <div style={{ padding: '5px' }}>
                                            <Checkbox
                                                label={variant.title}
                                                type="checkbox"
                                                id={`variant-${variant.id}`}
                                                checked={values.variant_config?.[variant.id]?.selected || false}
                                                onChange={(e) => handleVariantChange(variant.id, e, variant.quantity)}
                                                style={{ marginRight: '10px' }}
                                            />
                                        </div>
                                        <div style={{ padding: '5px' }}>
                                            <TextField
                                                type="number"
                                                readOnly={!values.variant_config?.[variant.id]?.selected}
                                                placeholder="Quantity"
                                                value={values.variant_config?.[variant.id]?.quantity || ''}
                                                onChange={(e) => handleChange(variant.id, e)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '30%', padding: '15px' }}>
                            <Select
                                label="Recurring Config"
                                options={recurringOptions}
                                onChange={handleRecurringConfigChange}
                                value={values.recurring_config.type}
                            />
                            {values.recurring_config.type === 'Per Week' && (
                                <div className='week-days-section'>
                                    {daysOfWeek.map((day, index) => (
                                        <Checkbox
                                            key={index}
                                            label={day}
                                            type="checkbox"
                                            id={day}
                                            checked={values.recurring_config.days.includes(day)}
                                            onChange={() => handleDaysChange(day)}
                                            style={{ marginRight: '10px' }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={{ width: '25%', padding: '15px' }}>
                            <DateTimeSelect
                                label={values.recurring_config.type === 'dnr' ? "Stock Date" : "Starting Date"}
                                name="starting_date"
                                value={values.starting_date}
                                isDate={true}
                                isTime={false}
                                format='YYYY-MM-DD'
                                initialViewMode="days"
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'starting_date')
                                }}
                                style={{ width: "30%", overflow: "visible" }}
                            />
                        </div>
                        <div style={{ width: '25%', padding: '15px' }}>
                            <DateTimeSelect
                                label="Stock Time"
                                name="stock_time"
                                value={values.stock_time}
                                autoComplete="off"
                                isDate={false}
                                isTime={true}
                                format='hh:mm A'
                                initialViewMode="time"
                                onChange={(value) => {
                                    onValuesChange(value, 'stock_time')
                                }}
                                style={{ width: "30%", overflow: "visible" }}
                            />
                        </div>

                        {
                            values.recurring_config.type !== 'dnr' &&
                            <div style={{ width: '25%', padding: '15px' }}>
                                <DateTimeSelect
                                    label={"Ending Date"}
                                    name="ending_date"
                                    value={values.ending_date}
                                    showDate={values.ending_date}
                                    isDate={true}
                                    isTime={false}
                                    format='YYYY-MM-DD'
                                    initialViewMode="days"
                                    autoComplete="off"
                                    onChange={(value) => {
                                        onValuesChange(value, 'ending_date')
                                    }}
                                    style={{ width: "30%", overflow: "visible" }}
                                />
                            </div>
                        }

                        <div style={{ width: '15%', padding: '15px' }}>
                            <h3 > Apply To All Locations</h3>
                            <StatusSwitch status={values.apply_to_all_locations} arrayKey={'apply_to_all_locations'} changeStatus={onValuesChange} />
                        </div>
                        {values.apply_to_all_locations === false && (
                            <div style={{ width: '25%', padding: '15px' }}>
                                <ShopifyLocationsSelect
                                    field="locations_id"
                                    title="Select Location"
                                    onFieldsChange={onValuesChange}
                                    validationErrors={errors.locations}
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
                            <Button loading={active} onClick={onSaveAndAddAnotherHandler} disabled={active} >{active ? 'Submitting...' : 'Save & Create Another'}</Button>
                        </div>
                        <Button loading={active} onClick={onClickActionHandler} disabled={active} >{active ? 'Submitting...' : 'Save'} </Button>


                    </div>
                </div>
            </Card>
            {toastMarkup}
        </div>
        {/* </Frame> */}
    </Box>
}