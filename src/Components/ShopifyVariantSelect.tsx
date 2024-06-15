import { Button, Modal, Text, TextField } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import SelectSearch from "react-select-search";
import MultipleSelect from "./MultipleSelect";
import axiosInstance from '@/plugins/axios';

export default function ShopifyProductsSelect({ onFieldsChange, title, field, clearValue, validationErrors, editingValues = [], isEditing = false, response = {}, groupIndex, updateDefaultOptions }) {
     
    useEffect(() => {

        axiosInstance.get(`/api/select/shopifyProducts`).then((response) => {
            if (response.data) {
                setOptions(response.data.selectData)
                setDefaultOptions(response.data.selectData)
                setOptionsLabel(response.data.optionsLabel)
            }
            setSelectedOptions(editingValues);
        }).catch((error) => {
            console.log(error)
        })
 
    }, [])

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [optionsLabel, setOptionsLabel] = useState({})
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (!isEditing) {
            setSelectedOptions([])
        }

    }, [clearValue])

    

    const selectedOptionsValueChangeHandler = (value) => {
        setSelectedOptions(value)
        onFieldsChange(value, field)
    }

    const optionsValueChangeHandler = (value) => {
        setOptions(value)
    }

    const updateOptions = (value) => {
         
        axiosInstance.get(`/api/select/shopifyProducts?title=${value}`).then((response) => {
            optionsValueChangeHandler(response.data.selectData);
        }).catch((error) => {
            console.log(error)
        })
    }

    return <div>
        
        <MultipleSelect
            label={title}
            validationErrors={validationErrors}
            optionsValueChange={optionsValueChangeHandler}
            selectedOptionsValueChange={selectedOptionsValueChangeHandler}
            selectedOptionsValue={selectedOptions}
            defaultOptionsValue={defaultOptions}
            optionsLabelValue={optionsLabel}
            optionsValue={options}
            updateOptions={updateOptions}
        />
    </div>
}