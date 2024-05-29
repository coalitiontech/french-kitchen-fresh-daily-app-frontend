import ButtonEnd from '@/Components/ButtonEnd';
import { Box, Card, Text, TextField, Button, Toast, Frame, Icon, Link } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import {
    MobileBackArrowMajor
} from '@shopify/polaris-icons';

export default function NewIngredient({isModal = false, addIngredientToSelect = null}) {
    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({
        name: null
    })
    const [active, setActive] = useState(false);

    useEffect(() => {
        setValues({
            name: '',
            calories: '',
            amount: '',
            unit_measurement: '',
        })
    }, [])

    const onValuesChange = (value, name) => {
        let valueBkp = { ...values }

        valueBkp[name] = value

        setValues(valueBkp)
    }

    const toastMarkup = active ? (
        <Toast content="Ingredient Created Successfully!" onDismiss={() => {
            setValues({
                name: '',
                calories: '',
                amount: '',
                unit_measurement: '',
            })

            setActive(false)
        }} />
    ) : null;

    const onSaveAndAddAnotherHandler = useCallback(() => {
        axiosInstance.post('/api/ingredients', values).then((response) => {

            if(isModal){
                let newIngredient = {
                    'label': response.data.name,
                    'value': response.data.id
                }

                let newIngredientLabel = {};

                newIngredientLabel[response.data.id] = response.data.name

                addIngredientToSelect(newIngredient, newIngredientLabel)
            }

            setErrors({
                name: null,
            })
            setActive(true)
        }).catch((response) => {
            const error = response.response.data.errors
            const err = {
                name: null,
                email: null,
                description: null,
                url: null
            }
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
        axiosInstance.post('/api/ingredients', values).then((response) => {
            if(isModal){
                let newIngredient = {
                    'label': response.data.name,
                    'value': response.data.id
                }

                let newIngredientLabel = {};

                newIngredientLabel[response.data.id] = response.data.name

                addIngredientToSelect(newIngredient, newIngredientLabel, true)
            } else {
                window.location.href = `/ingredients`
            }
            
        }).catch((response) => {
            const error = response.response.data.errors
            const err = {
                name: null,
                email: null,
                description: null,
                url: null
            }
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

    const fields = (<div style={{ maxWidth: isModal ? "95%" : "70%", display: 'flex', justifyContent: 'center', margin: '25px', marginLeft: 'auto', marginRight: 'auto' }}>
        <Card padding={800} >
            <div style={{ width: '4000px', maxWidth: '100%' }}>
                { !isModal &&
                    <a className='back-button' href='/ingredients' style={{ position: 'absolute', display: 'flex', textDecoration: 'none' }}>
                        <Icon
                            source={MobileBackArrowMajor}
                            tone="base"
                        /><span> Back</span>
                    </a>
                }
                <div style={{ marginBottom: "10px" }}>
                    <Text variant="heading3xl" alignment="center" as={'h1'} >New Ingredient</Text>
                </div>
                <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '50%', padding: '15px' }}>
                            <TextField
                                name='name'
                                requiredIndicator
                                label="Name"
                                error={errors.name}
                                value={values.name}
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'name')
                                }}
                            />
                        </div>
                        <div style={{ width: '50%', padding: '15px' }}>
                            <TextField
                                label="Calories"
                                type='number'
                                value={values.calories}
                                autoComplete="off"
                                inputMode='numeric'
                                onChange={(value) => {
                                    onValuesChange(value, 'calories')
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '50%', padding: '15px' }}>
                            <TextField
                                label="Amount"
                                type='number'
                                value={values.amount}
                                autoComplete="off"
                                inputMode='decimal'
                                onChange={(value) => {
                                    onValuesChange(value, 'amount')
                                }}
                            />
                        </div>
                        <div style={{ width: '50%', padding: '15px' }}>
                            <TextField
                                label="Unit Measurement"
                                value={values.unit_measurement}
                                autoComplete="off"
                                onChange={(value) => {
                                    onValuesChange(value, 'unit_measurement')
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                    <div style={{ marginRight: '10px' }}><Button loading={active} onClick={onSaveAndAddAnotherHandler}>Save & Create Another</Button></div>
                    <Button loading={active} onClick={onClickActionHandler}>Create</Button>
                </div>
                {/* <ButtonEnd onClickAction={onClickActionHandler} buttonName="Create Ingredient" /> */}
            </div>
        </Card>
        {toastMarkup}
    </div>)

    return isModal ?
        fields :
        (<Box minHeight='100vh' maxWidth="100%" as='section' background="bg">
            {fields}
        </Box>)
}