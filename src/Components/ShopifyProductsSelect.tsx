//import NewIngredient from "@/pages/locations/new";
import { Button, Modal, Text, TextField } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import SelectSearch from "react-select-search";
import MultipleSelect from "./MultipleSelect";
import axiosInstance from '@/plugins/axios';

export default function ShopifyProductsSelect({ onFieldsChange, clearValue, validationErrors, editingValues = [], isEditing = false, editingFields = [], response = {}, groupIndex, updateDefaultOptions }) {
    console.log('editing values=', editingValues);
    useEffect(() => {

        axiosInstance.get(`/api/select/shopifyProducts`).then((response) => {
            if (response.data) {
                setOptions(response.data.selectData)
                setDefaultOptions(response.data.selectData)
                setOptionsLabel(response.data.optionsLabel)
            }
            setSelectedOptions(editingValues);
           // setSelectedOptions(editingValues.map((item) => (item.ingredient_id)))
            //setSelectedFields(editingFields)
        }).catch((error) => {
            console.log(error)
        })
 
    }, [])

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [optionsLabel, setOptionsLabel] = useState({})
    const [options, setOptions] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);

    useEffect(() => {
        if (!isEditing) {
            setSelectedOptions([])
            setSelectedFields([])
        }

    }, [clearValue])

    

    const selectedOptionsValueChangeHandler = (value) => {
        let difference = value.filter(x => !selectedOptions.includes(x));

        if (difference[0]) {
            let obj = {
                ingredient_id: difference[0],
                display_name: '',
                amount: '',
                unit_measurement: ''
            }

            setSelectedFields((prevValue) => {
                return [...prevValue, obj]
            })
        } else {
            difference = selectedOptions.filter(x => !value.includes(x));

            if (difference[0]) {
                let newFieldsValues = selectedFields.filter((item) => {
                    return item.ingredient_id != difference[0]
                })

                setSelectedFields(newFieldsValues)
            }
        }

        setSelectedOptions(value)
    }

    const optionsValueChangeHandler = (value) => {
        setOptions(value)
    }

    const updateOptions = (value) => {
        axiosInstance.get(`/api/select/shopifyProducts?title=${value}`).then((response) => {
            //console.log(response);
            optionsValueChangeHandler(response.data.selectData);
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleChange = (value, index, name) => {

        setSelectedFields((prevSelectedFields) => {
            let selectedFieldsBkp = [...prevSelectedFields]

            selectedFieldsBkp[index][name] = value

            return selectedFieldsBkp;
        })
        console.log('selectedFields = ' +selectedFields);

    }

    return <div style={{ padding: '15px' }}>
        {/* <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>Ingredients</h2> */}
        
        <MultipleSelect
            validationErrors={validationErrors}
            optionsValueChange={optionsValueChangeHandler}
            selectedOptionsValueChange={selectedOptionsValueChangeHandler}
            selectedOptionsValue={selectedOptions}
            defaultOptionsValue={defaultOptions}
            optionsLabelValue={optionsLabel}
            optionsValue={options}
            updateOptions={updateOptions}
        />
        <div style={{ marginBottom: '15px', marginTop: '10px' }}>
            {
                //selectedFields.map((field, index) => {
                    // return <div key={field.ingredient_id} style={{ padding: '15px', backgroundColor: '#f1f1f1', marginTop: '20px', borderRadius: '10px' }}>
                    //     <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    //         <Text variant="headingMd" as="h3">
                    //             Products: {optionsLabel[field.ingredient_id]}
                    //         </Text>
                    //     </div>
                    //     {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    //         <div style={{ width: '100%' }}>
                    //             <TextField
                    //                 label="Display Text"
                    //                 value={field.display_name ? field.display_name : ''}
                    //                 name="display_name"
                    //                 error={validationErrors.product_eligibility}
                    //                 onChange={(value) => handleChange(value, index, 'display_name')}
                    //                 autoComplete="off"
                    //             />
                    //         </div>
                    //     </div> */}
                         
                    // </div>
               // })
            }
        </div>
    </div>
}