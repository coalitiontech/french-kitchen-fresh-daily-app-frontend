import NewIngredient from "@/pages/ingredients/new";
import { Button, Modal, Text, TextField } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import SelectSearch from "react-select-search";
import MultipleSelect from "./MultipleSelect";
import axiosInstance from '@/plugins/axios';
import NewAuthor from "@/pages/authors/new";

export default function AuthorsModal({onFieldsChange, clearValue, validationErrors, editingValues = [], isEditing = false}) {
    const [activeModal, setActiveModal] = useState(false);
    const [optionsValue, setOptionsValue] = useState([]);

    useEffect(() => {
        axiosInstance.get('/api/select/authors').then((response) => {
            setOptions(response.data.selectData)
            setDefaultOptions(response.data.selectData)
            setOptionsLabel(response.data.optionsLabel)
            setSelectedOptions(editingValues)
        })
    }, [])

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [optionsLabel, setOptionsLabel] = useState({})
    const [options, setOptions] = useState([]);

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

        if (closeModal) {
            toggleModal()
        }
    }

    useEffect(() => {
        onFieldsChange(selectedOptions, 'authors')
    }, [selectedOptions])

    const selectedOptionsValueChangeHandler = (value) => {
        setSelectedOptions(value)
    }

    const optionsValueChangeHandler = (value) => {
        setOptions(value)
    }

    useEffect(() => {
        if (!isEditing) {
            setSelectedOptions([])
        }
    }, [clearValue])

    const activator = <div><Button onClick={toggleModal}>Add Author</Button></div>;

    return <div style={{ width: '50%', padding: '15px', borderRight: '1px solid #e3e3e3' }}>
        <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>Authors</h2>
        <div style={{ textAlign: 'right', marginBottom: '15px', marginTop: '10px' }}>
            <Modal
                activator={activator}
                open={activeModal}
                onClose={toggleModal}
                title="Add authors to recipe"
                size='large'
            >
                <Modal.Section>
                    <NewAuthor addAuthorToSelect={addIngredientToSelectHandler} isModal={true} />
                </Modal.Section>
            </Modal>
        </div>
        <MultipleSelect validationErrors={validationErrors.authors} optionsValueChange={optionsValueChangeHandler} selectedOptionsValueChange={selectedOptionsValueChangeHandler} selectedOptionsValue={selectedOptions} defaultOptionsValue={defaultOptions} optionsLabelValue={optionsLabel} optionsValue={options} />
    </div>
}