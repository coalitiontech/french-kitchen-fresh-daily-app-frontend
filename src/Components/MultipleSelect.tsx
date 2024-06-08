import axiosInstance from '@/plugins/axios';
import { LegacyStack, Tag, Autocomplete } from '@shopify/polaris';
import { useState, useCallback } from 'react';

export default function MultipleSelect({
    defaultOptionsValue,
    optionsLabelValue, 
    optionsValue, optionsValueChange,
    selectedOptionsValue, selectedOptionsValueChange,
    validationErrors,
    updateOptions,
}) {
    const [inputValue, setInputValue] = useState('');

    const updateText = useCallback(
        (value: string) => {
            setInputValue(value);

            if (value === '') {
                optionsValueChange(defaultOptionsValue);
                return;
            }

            updateOptions(value)
            
        },
        [selectedOptionsValue],
    );

    const removeTag = useCallback(
        (tag: string) => () => {
            const options = [...selectedOptionsValue];
            options.splice(options.indexOf(tag), 1);
            selectedOptionsValueChange(options);
        },
        [selectedOptionsValue],
    );

    const verticalContentMarkup =
    selectedOptionsValue.length > 0 ? (
            <LegacyStack spacing="extraTight" alignment="center">
                {selectedOptionsValue.map((option) => {
                    let tagLabel = optionsLabelValue[option];
                    return (
                        <Tag key={`option${option}`} onRemove={removeTag(option)}>
                            {tagLabel}
                        </Tag>
                    );
                })}
            </LegacyStack>
        ) : null;

    const textField = (
        <Autocomplete.TextField
            error={validationErrors}
            onChange={updateText}
            value={inputValue}
            verticalContent={verticalContentMarkup}
            autoComplete="off"
        />
    );

    return (
        <div >
            <Autocomplete
                allowMultiple
                options={optionsValue}
                selected={selectedOptionsValue}
                textField={textField}
                onSelect={selectedOptionsValueChange}
                listTitle="Suggested Tags"
            />
        </div>
    );
}