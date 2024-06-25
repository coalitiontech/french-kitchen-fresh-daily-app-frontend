import ButtonEnd from '@/Components/ButtonEnd';
import { Box, Card, Text, TextField, Button, Toast, Divider, Icon, Select, Modal, LegacyCard, LegacyStack, Collapsible, Link, Autocomplete, Checkbox, Tag } from '@shopify/polaris';
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

    const [productinputValue, setProductInputValue] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productVariants, setProductVariants] = useState([]);
    const [variantSelections, setVariantSelections] = useState({});
    const [isReadOnly, setIsReadOnly] = useState(false);
    
    const router = useRouter();
    const processId = router.query.id
    
    /****************************************************************************/
    
    useEffect(() => {
        if (processId) {

            axiosInstance.get(`/api/inventorySchedule/${processId}`).then((response) => {
                 
                const dt = response.data;
                setSelectedProduct(dt.shopify_product_id);
                
                setValues({
                    quantity: dt.quantity,
                    stock_datetime: dt.stock_datetime,
                    overwrite_stock: dt.overwrite_stock ? true : false,
                    is_active: dt.is_active == 1 ? true : false,
                    recurring_config: dt.recurring_config ? dt.recurring_config : { type: '', days: [] }, 
                    shopify_product_id: dt.shopify_product_id,
                    variant_config: dt.variant_config,
                })

                const initialVariantSelections = {};
                for (const variantId in dt.variant_config) {
                    initialVariantSelections[variantId] = {
                        selected: true,
                        quantity: dt.variant_config[variantId].quantity
                    };
                }
                setVariantSelections(initialVariantSelections);

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
            values.variant_config = JSON.stringify(values.variant_config);
            values.recurring_config = JSON.stringify(values.recurring_config);
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
        values.variant_config = JSON.stringify(values.variant_config);
        values.recurring_config = JSON.stringify(values.recurring_config);
        
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
    
     const [productDeselectedOptions, setProductDeselectedOptions] = useState([]);     
     const [productOptions, setProductOptions] = useState(productDeselectedOptions); 
     const [productSelectedOptions, setProductSelectedOptions] = useState<string[]>([]);
     const [productOptionsLabel, setProductOptionsLabel] = useState<string[]>([]);
 
    useEffect(() => {
        axiosInstance.get('/api/select/singleShopifyProduct?title=' + productinputValue).then((response) => {
            setProductDeselectedOptions([{ label: 'None', value: '' }, ...response.data.selectData])
            setProductOptions([{ label: 'None', value: '' }, ...response.data.selectData]);
            setProductOptionsLabel(response.data.optionsLabel);
            console.log(response.data);
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
            verticalContent={productVerticalContentMarkup}
            placeholder="Search Product"
            autoComplete="off"
            name="shopify_product_id"
            label="Shopify Product"
            key="shopify_product_id"
            initialValue={values.shopify_product_id}
        />
    );
 
    /********************************************************************************/ 
 
    const [numberOfProductVariants, setNumberOfProductVariants] = useState(0);
    
    useEffect(() => {
        if (selectedProduct != '' || values.variant_config != '') {
            axiosInstance.get(`/api/select/productVariant/${selectedProduct}`)
                .then((response) => {
                    if (response.data) {
                        setProductVariants(response.data.selectData);
                        setNumberOfProductVariants(response.data.selectData.length);
                        
                        if(response.data.selectData.length > 1)
                        {
                            setIsReadOnly(true); 
                        }
                         
                    }
                    
                })
                .catch((error) => {
                    console.error('Error fetching product variants:', error);
                });
        }
    }, [selectedProduct]);

     
    const handleVariantChange = useCallback((variantId, event, quantity) => {
        console.log(variantId+' val= '+event);
        const checked = event;
        setVariantSelections(prevSelections => ({
            ...prevSelections,
            [variantId]: {
                ...prevSelections[variantId],
                selected: checked,
                quantity: Number(quantity)
            }
        }));

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
        setVariantSelections(prevSelections => ({
            ...prevSelections,
            [variantId]: {
                ...prevSelections[variantId],
                quantity: Number(quantity)
            }
        }));

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

        if(numberOfProductVariants == 1 )
        {
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


    // Function to get the final output structure
    const getFinalVariantData = () => {
        const finalData = {};
        const variantSelections = values.variant_config || {};
        for (const variantId in variantSelections) {
            if (variantSelections[variantId].selected) {
                finalData[variantId] = { quantity: variantSelections[variantId].quantity };
            }
        }
        return finalData;
    };

    const recurringOptions = [
        {label: 'Daily', value: 'Daily'},
        {label: 'Per Week', value: 'Per Week'},
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
        console.log('day - '+day)
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

                        <div style={{ width: '30%', padding: '15px' }}>
                            <Autocomplete
                                title="Product"
                                options={productOptions}
                                error={errors.name}
                                selected={values.shopify_product_id}
                                textField={productTextField}
                                onSelect={updateProductSelection}
                                listTitle="Suggested Products"
                                fieldName="shopify_product_id"
                                fieldKey="shopify_product_id"
                                initialValue={values.shopify_product_id}
                            /> 
                        </div>

                        {/* {productVariants.length > 0 && selectedProduct !== '' && ( */}
                        { values.variant_config !== '' && (
                            <div style={{ width: '70%' }}>
                                <h3>Product Variants</h3>
                                {productVariants.map((variant) => (
                                    <div key={variant.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px',width: '80%',padding: '10px' }}>
                                        <div style={{ width: '50%', padding: '15px' }}>
                                            <Checkbox
                                                label={variant.title}
                                                type="checkbox"
                                                id={`variant-${variant.id}`}
                                                checked={variantSelections[variant.id]?.selected || false}
                                                onChange={(e) => handleVariantChange(variant.id, e, variant.quantity)}
                                                style={{ marginRight: '10px' }}
                                            />
                                        </div>
                                        <div style={{ width: '50%', padding: '15px' }}>
                                            <TextField
                                                type="number"
                                                readOnly={isReadOnly}
                                                placeholder="Quantity"
                                                value={values.variant_config?.[variant.id]?.quantity || ''}
                                                onChange={(e) => handleChange(variant.id, e)}
                                            />  
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                         
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '33%', padding: '15px' }}>
                            <h3> Active</h3>
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
                        
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '33%', padding: '15px' }}>
                            {/* <TextField 
                                label="Recurring Config"
                                name="recurring_config"
                                min="0"
                                value={values.recurring_config}
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'recurring_config')
                                }}
                                style={{ width:"30%" }}
                            /> */}
                             
                            <Select
                                label="Recurring Config"
                                options={recurringOptions}
                                onChange={handleRecurringConfigChange}
                                value={values.recurring_config ? values.recurring_config.type : ''}
                            />   
                        </div> 
                        { values.recurring_config != '' && values.recurring_config != null && values.recurring_config.type === 'Per Week' && (
                            <div style={{ width: '33%', padding: '15px' }}>
                                {daysOfWeek.map(day => (
                                    <Checkbox
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