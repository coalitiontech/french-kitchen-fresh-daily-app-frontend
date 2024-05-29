import { Button, Select, TextField } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';

export default function ({ buttonName, onClickAction, onFilterChanges, onTitleFilterChanges }) {
    const [selectedOptions, setSelectedOptions] = useState('');
    const [options, setOptions] = useState();

    const [textFieldValue, setTextFieldValue] = useState('');

    const handleTextFieldChange = (value: string) => {
        onTitleFilterChanges({ 'title': value })
        setTextFieldValue(value)
    };

    useEffect(() => {
        axiosInstance.get('/api/select/authors').then((response) => {
            setOptions((prevValue) => {
                return [{ 'label': 'None', 'value': 0 }, ...response.data.selectData]
            })
        })
    }, [])

    const handleSelectChange = (value) => {
        onFilterChanges({ 'author': parseInt(value) })
        setSelectedOptions(parseInt(value))
    };

    return <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'space-between' }} >
        <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '10px'}}>
                <TextField
                    value={textFieldValue}
                    onChange={handleTextFieldChange}
                    placeholder="Title"
                    autoComplete="off"
                />
            </div>
            <div>
                <Select
                    label="Sort by"
                    labelInline
                    options={options}
                    onChange={handleSelectChange}
                    value={selectedOptions}
                />
            </div>
        </div>
        <Button onClick={onClickAction}>{`${buttonName}`}</Button>
    </div>
}