import { Box, Card, Text, TextField, Button, Toast, Divider, Icon, Select, Modal, LegacyCard, LegacyStack, Collapsible, Link, Autocomplete, Checkbox, Tag } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import DateTimeSelect from '@/Components/DateTimeSelect';
import {
    ArrowLeftIcon
} from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import StatusSwitch from '../../../Components/Switch';
import moment from 'moment';

export default function EditSettings() {

    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})
    const [active, setActive] = useState(false);

    const [isLoading, setIsLoading] = useState(true)

    const [selectedProduct, setSelectedProduct] = useState('');
    const [productVariants, setProductVariants] = useState([]);

    const router = useRouter();
    const processId = router.query.id

    const [productinputValue, setProductInputValue] = useState('');
    const [productSelectedOptions, setProductSelectedOptions] = useState<string[]>([]);

    /****************************************************************************/

    useEffect(() => {
        if (processId) {

            axiosInstance.get(`/api/inventorySchedule/${processId}`).then((response) => {
                const dt = response.data;
                setSelectedProduct(dt.shopify_product_id);
                setValues({
                    quantity: dt.quantity,
                    stock_datetime: dt.stock_datetime,
                    starting_date: moment(dt.starting_date).format('YYYY-MM-DD HH:mm:ss'),
                    stock_time: moment(`${dt.starting_date} ${dt.stock_time}`).format('YYYY-MM-DD HH:mm:ss'),
                    overwrite_stock: dt.overwrite_stock ? true : false,
                    is_active: dt.is_active == 1 ? true : false,
                    recurring_config: dt.recurring_config ? dt.recurring_config : { type: '', days: [] },
                    shopify_product_id: dt.shopify_product_id,
                    variant_config: dt.variant_config,
                })

                setProductSelectedOptions([dt.shopify_product_id]);
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

    /***************************************************************************** */

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
                setValues(prevValues => {

                    return {
                        ...prevValues,
                        variant_config: {}
                    };
                });
                return matchedOption && matchedOption.label;
            });

            setProductSelectedOptions(selected);
            setProductInputValue('');
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
            verticalContent={productVerticalContentMarkup}
            placeholder="Search Product"
            autoComplete="off"
            name="shopify_product_id"
            label="Shopify Product"
            key="shopify_product_id"
        />
    );

    /********************************************************************************/

    const [numberOfProductVariants, setNumberOfProductVariants] = useState(0);

    useEffect(() => {
        if (values.variant_config != '') {
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
            quantity: Number(quantity),
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

    return !isLoading && <Box minHeight='100vh' maxWidth="100%" as='section' background="bg">
        {/* <Frame> */}
        <div style={{ maxWidth: "90%", display: 'block', justifyContent: 'center', margin: '25px', marginLeft: 'auto', marginRight: 'auto' }}>
            <Card padding={800} >
                {/* <div style={{ width: '4000px', maxWidth: '100%' }}> */}
                <div style={{ width: '100%' }}>
                    <a className='back-button' href='/inventorySchedule' style={{ position: 'absolute', display: 'flex', textDecoration: 'none' }}>
                        <Icon
                            source={ArrowLeftIcon}
                            tone="base"
                        /><span> Back</span>
                    </a>
                    <div style={{ marginBottom: "10px" }}>
                        <Text variant="heading2xl" alignment="center" as={'h1'} >Edit Inventory Schedule</Text>
                    </div>

                    <div style={{ width: '100%', display: 'flex' }}>

                        <div style={{ width: '70%', padding: '15px' }}>
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
                            <h3>Active</h3>
                            <StatusSwitch status={values.is_active} arrayKey={'is_active'} changeStatus={onValuesChange} />
                        </div>
                        <div style={{ width: '15%', padding: '15px' }}>
                            <h3> Overwrite Stock</h3>
                            <StatusSwitch status={values.overwrite_stock} arrayKey={'overwrite_stock'} changeStatus={onValuesChange} />
                        </div>
                    </div>

                    {values.variant_config !== '' && (
                        <div style={{ width: '100%' }}>
                            <h3 style={{ padding: '15px' }}>Product Variants</h3>
                            <div style={{ display: 'grid', alignItems: 'center', marginBottom: '10px', padding: '10px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                {productVariants.map((variant) => {
                                    return <div key={variant.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
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
                                })}
                            </div>
                        </div>
                    )}

                    <div style={{ width: '100%', display: 'flex' }}>
                        {/* <div style={{ width: '25%', padding: '15px' }}>
                            <DateTimeSelect
                                label="Stock Datetime"
                                name="stock_datetime"
                                value={values.stock_datetime}
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'stock_datetime')
                                }}
                                style={{ width: "30%", overflow: "visible" }}
                            />
                        </div> */}
                        <div style={{ width: '50%', padding: '15px' }}>
                            <Select
                                label="Recurring Config"
                                options={recurringOptions}
                                onChange={handleRecurringConfigChange}
                                value={values.recurring_config ? values.recurring_config.type : ''}
                            />
                            {values.recurring_config != '' && values.recurring_config != null && values.recurring_config.type === 'Per Week' && (
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
                                format='HH:mm:ss'
                                initialViewMode="time"
                                onChange={(value) => {
                                    onValuesChange(value, 'stock_time')
                                }}
                                style={{ width: "30%", overflow: "visible" }}
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