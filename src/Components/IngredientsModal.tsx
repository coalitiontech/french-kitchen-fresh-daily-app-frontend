import NewIngredient from "@/pages/ingredients/new";
import { Button, Modal, Text, TextField } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import SelectSearch from "react-select-search";
import MultipleSelect from "./MultipleSelect";
import axiosInstance from '@/plugins/axios';

export default function IngredientsModal({ onFieldsChange, clearValue, validationErrors, editingValues = [], isEditing = false, editingFields = [], response = {}, groupIndex }) {
    const [activeModal, setActiveModal] = useState(false);

    useEffect(() => {
        if (response.data) {
            setOptions(response.data.selectData)
            setDefaultOptions(response.data.selectData)
            setOptionsLabel(response.data.optionsLabel)
        }

        setSelectedOptions(editingValues.map((item) => (item.ingredient_id)))
        setSelectedFields(editingFields)
    }, [response])

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [optionsLabel, setOptionsLabel] = useState({})
    const [options, setOptions] = useState([]);

    const [selectedFields, setSelectedFields] = useState([]);

    useEffect(() => {
        // console.log('before method', selectedFields)
        onFieldsChange(selectedFields, 'ingredient_groups_ingredients', groupIndex)
    }, [selectedFields])

    useEffect(() => {
        if (!isEditing) {
            setSelectedOptions([])
            setSelectedFields([])
        }

    }, [clearValue])

    const toggleModal = useCallback(() => setActiveModal((activeModal) => !activeModal), []);

    const addIngredientToSelectHandler = (newIngredient, newIngredientLabel, closeModal = false) => {
        setDefaultOptions((prevDefaultOptions) => {
            return [newIngredient, ...prevDefaultOptions]
        })
        setOptions((prevOptions) => {
            return [newIngredient, ...prevOptions]
        })
        setOptionsLabel((prevOptionsLabel) => {
            return { ...newIngredientLabel, ...prevOptionsLabel }
        })
        setSelectedOptions((prevSelected) => {
            return [...prevSelected, newIngredient.value]
        })

        setSelectedFields((prevSelectedFields) => {
            let obj = {
                ingredient_id: newIngredient.value,
                display_name: '',
                amount: '',
                unit_measurement: ''
            }

            return [...prevSelectedFields, obj]
        })

        if (closeModal) {
            toggleModal()
        }
    }

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

    const handleChange = (value, index, name) => {

        setSelectedFields((prevSelectedFields) => {
            let selectedFieldsBkp = [...prevSelectedFields]

            selectedFieldsBkp[index][name] = value
    
            return selectedFieldsBkp;
        })
        
    }

    const activator = <div><Button onClick={toggleModal}>Add Ingredient</Button></div>;

    return <div style={{ padding: '15px', borderRight: '1px solid #e3e3e3' }}>
        {/* <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>Ingredients</h2> */}
        <div style={{ textAlign: 'right', marginBottom: '15px', marginTop: '10px' }}>
            <Modal
                activator={activator}
                open={activeModal}
                onClose={toggleModal}
                title="Add ingredients to recipe"
                size='large'
            >
                <Modal.Section>
                    <NewIngredient addIngredientToSelect={addIngredientToSelectHandler} isModal={true} />
                </Modal.Section>
            </Modal>
        </div>
        <MultipleSelect validationErrors={validationErrors.ingredients} optionsValueChange={optionsValueChangeHandler} selectedOptionsValueChange={selectedOptionsValueChangeHandler} selectedOptionsValue={selectedOptions} defaultOptionsValue={defaultOptions} optionsLabelValue={optionsLabel} optionsValue={options} />
        <div style={{ marginBottom: '15px', marginTop: '10px' }}>
            {
                selectedFields.map((field, index) => {
                    return <div key={field.ingredient_id} style={{ padding: '15px', backgroundColor: '#f1f1f1', marginTop: '20px', borderRadius: '10px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                            <Text variant="headingMd" as="h3">
                                Ingredient: {optionsLabel[field.ingredient_id]}
                            </Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div style={{ width: '100%' }}>
                                <TextField
                                    label="Display Text"
                                    value={field.display_name ? field.display_name : ''}
                                    name="display_name"
                                    error={validationErrors[`ingredients.${index}.display_name`]}
                                    onChange={(value) => handleChange(value, index, 'display_name')}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '45%' }}>
                                <TextField
                                    label="Amount"
                                    value={field.amount ? field.amount : ''}
                                    name="amount"
                                    type="number"
                                    inputMode='numeric'
                                    min={0}
                                    error={validationErrors[`ingredients.${index}.amount`]}
                                    onChange={(value) => handleChange(value, index, 'amount')}
                                    autoComplete="off"
                                />
                            </div>
                            <div style={{ width: '45%' }}>
                                <TextField
                                    label="Unit Measurement"
                                    name="unit_measurement"
                                    value={field.unit_measurement ? field.unit_measurement : ''}
                                    error={validationErrors[`ingredients.${index}.unit_measurement`]}
                                    onChange={(value) => handleChange(value, index, 'unit_measurement')}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>
                })
            }
        </div>
    </div>
}