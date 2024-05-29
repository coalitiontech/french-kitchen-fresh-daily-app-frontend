import ButtonEnd from '@/Components/ButtonEnd';
import { Box, Card, Text, TextField, Button, Toast, Divider, Icon, Select, Modal } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import { DatePicker } from '@shopify/polaris';
import {
    MobileBackArrowMajor
} from '@shopify/polaris-icons';
import IngredientsModal from '@/Components/IngredientsModal';
import AuthorsModal from '@/Components/AuthorsModal';
import PublishedAtDatePicker from '@/Components/PublishedAtDatePicker';
import { useRouter } from 'next/router';
import QuillJs from '@/Components/QuillJs';
import IngredientGroupModal from '@/Components/IngredientGroupModal';

const visibilityValues = {
    'Teacher': 1,
    'Class': 2,
    'Public': 3,
}

const difficultyValues = {
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3,
}

export default function EditIngredient() {
    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})
    const [active, setActive] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date())

    const [isLoading, setIsLoading] = useState(true)

    const [clearValue, setClearValue] = useState(false);
    const router = useRouter();
    const processId = router.query.id

    useEffect(() => {
        if (processId) {

            axiosInstance.get(`/api/recipes/${processId}`).then((response) => {
                const data = response.data

                setValues({
                    title: data.title ? data.title : '',
                    description: data.description ? data.description : '',
                    instructions: data.instructions ? data.instructions : '',
                    serving_size: data.serving_size ? data.serving_size : '',
                    prep_time: data.prep_time ? data.prep_time : '',
                    cook_time: data.cook_time ? data.cook_time : '',
                    rest_time: data.rest_time ? data.rest_time : '',
                    keywords: data.keywords ? data.keywords : '',
                    visibility: visibilityValues[data.visibility],
                    difficulty: difficultyValues[data.difficulty],
                    published_at: (new Date(data.published_at)),
                    ingredients: data.ingredients,
                    ingredient_groups: data.ingredient_groups,
                    ingredient_groups_ingredients: data.ingredient_groups_ingredients,
                    selected_authors: data.selected_authors,
                    authors: data.selected_authors,
                })

                setSelectedDate((new Date(data.published_at)))
                setIsLoading(false)
            })
        }
    }, [processId])

    const onValuesChange = (value, name, index) => {
        setValues((prevValue) => {
            let valueBkp = { ...prevValue }

            if (name === 'published_at') {
                setSelectedDate(value);
            } else if (name === 'visibility' || name === 'difficulty') {
                value = parseInt(value);
            } else if (name === 'ingredient_groups') {
                value = [...valueBkp[name], ...value]
                console.log(value)
            } else if (name === 'ingredient_groups_ingredients') {
                valueBkp['ingredient_groups'][index]['ingredients'] = value

                return valueBkp
            }

            valueBkp[name] = value

            return valueBkp
        })
    }

    const options = [
        { label: 'Teacher', value: 1 },
        { label: 'Class', value: 2 },
        { label: 'Public', value: 3 },
    ];

    const difficultyOptions = [
        { label: 'Beginner', value: 1 },
        { label: 'Intermediate', value: 2 },
        { label: 'Advanced', value: 3 },
    ];

    const toastMarkup = active ? (
        <Toast content="Ingredient Edited Successfully!" onDismiss={() => {
            setActive(false)
        }} />
    ) : null;

    const onSaveAndKeepEditingHandler = useCallback(() => {
        axiosInstance.put(`/api/recipes/${processId}`, values).then((response) => {
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

    const onClickActionHandler = useCallback(() => {
        axiosInstance.put(`/api/recipes/${processId}`, values).then((response) => {
            window.location.href = `/recipes`
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

    return (<Box minHeight='100vh' maxWidth="100%" as='section' background="bg">
        {/* <Frame> */}
        <div style={{ maxWidth: "70%", display: 'flex', justifyContent: 'center', margin: '25px', marginLeft: 'auto', marginRight: 'auto' }}>
            <Card padding={800} >
                <div style={{ width: '4000px', maxWidth: '100%' }}>
                    <a className='back-button' href='/recipes' style={{ position: 'absolute', display: 'flex', textDecoration: 'none' }}>
                        <Icon
                            source={MobileBackArrowMajor}
                            tone="base"
                        /><span> Back</span>
                    </a>
                    <div style={{ marginBottom: "10px" }}>
                        <Text variant="heading3xl" alignment="center" as={'h1'} >New Recipe</Text>
                    </div>
                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>
                            <div style={{ width: '50%', padding: '15px' }}>
                                <TextField
                                    name='title'
                                    label="Title"
                                    error={errors.title}
                                    value={values.title}
                                    error={errors.title}
                                    autoComplete="off"
                                    onChange={(value) => {
                                        onValuesChange(value, 'title')
                                    }}
                                />
                            </div>
                            <div style={{ width: '50%', padding: '15px' }}>
                                <TextField
                                    label="Keywords"
                                    type='text'
                                    value={values.keywords}
                                    error={errors.keywords}
                                    autoComplete="off"
                                    inputMode='text'
                                    onChange={(value) => {
                                        onValuesChange(value, 'keywords')
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    label="Serving Size"
                                    type='number'
                                    value={values.serving_size}
                                    error={errors.serving_size}
                                    autoComplete="off"
                                    inputMode='numeric'
                                    min={0}
                                    onChange={(value) => {
                                        onValuesChange(value, 'serving_size')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    label="Prep Time"
                                    type='number'
                                    value={values.prep_time}
                                    error={errors.prep_time}
                                    autoComplete="off"
                                    inputMode='decimal'
                                    min={0}
                                    onChange={(value) => {
                                        onValuesChange(value, 'prep_time')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    label="Cook Time"
                                    type='number'
                                    value={values.cook_time}
                                    error={errors.cook_time}
                                    autoComplete="off"
                                    inputMode='decimal'
                                    min={0}
                                    onChange={(value) => {
                                        onValuesChange(value, 'cook_time')
                                    }}
                                />
                            </div>
                            <div style={{ width: '25%', padding: '15px' }}>
                                <TextField
                                    label="Rest Time"
                                    type='number'
                                    value={values.rest_time}
                                    error={errors.rest_time}
                                    autoComplete="off"
                                    inputMode='decimal'
                                    min={0}
                                    onChange={(value) => {
                                        onValuesChange(value, 'rest_time')
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        {!isLoading &&
                            <div style={{ width: '100%', display: 'flex', height: '375px' }}>
                                <div style={{ width: '50%', padding: '15px' }}>
                                    <div style={{ marginBottom: '4px' }}>
                                        <Text as='label'>Description</Text>
                                    </div>
                                    <QuillJs
                                        onChangeHandler={onValuesChange}
                                        fieldName='description'
                                        initialValue={values.description}
                                    />
                                    {/* <TextField
                                    label="Description"
                                    type='text'
                                    value={values.description}
                                    error={errors.description}
                                    autoComplete="off"
                                    inputMode='text'
                                    multiline={5}
                                    onChange={(value) => {
                                        onValuesChange(value, 'description')
                                    }}
                                /> */}
                                </div>
                                <div style={{ width: '50%', padding: '15px' }}>
                                    <div style={{ marginBottom: '4px' }}>
                                        <Text as='label'>Instructions</Text>
                                    </div>
                                    <QuillJs
                                        onChangeHandler={onValuesChange}
                                        fieldName='instructions'
                                        initialValue={values.instructions}
                                    />
                                    {/* <TextField
                                    label="Instructions"
                                    type='text'
                                    value={values.instructions}
                                    error={errors.instructions}
                                    autoComplete="off"
                                    inputMode='text'
                                    multiline={5}
                                    onChange={(value) => {
                                        onValuesChange(value, 'instructions')
                                    }}
                                /> */}
                                </div>
                            </div>
                        }
                    </div>
                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>
                            <div style={{ width: '33%', padding: '15px' }}>
                                <Select
                                    label="Visibility"
                                    options={options}
                                    onChange={(value) => {
                                        onValuesChange(parseInt(value), 'visibility')
                                    }}
                                    value={values.visibility}
                                />
                            </div>
                            <div style={{ width: '33%', padding: '15px' }}>
                                <Select
                                    label="Difficulty"
                                    options={difficultyOptions}
                                    onChange={(value) => {
                                        onValuesChange(parseInt(value), 'difficulty')
                                    }}
                                    value={values.difficulty}
                                />
                            </div>
                            <div style={{ width: '33%', padding: '15px' }}>
                                <PublishedAtDatePicker dateChange={onValuesChange} selectedDateDefault={selectedDate} />
                            </div>
                        </div>
                    </div>
                    <Divider borderColor="border" />
                    <div style={{ marginBottom: "10px", display: 'flex', marginTop: '20px' }} >
                        {
                            !isLoading &&
                            <AuthorsModal
                                onFieldsChange={onValuesChange}
                                clearValue={clearValue}
                                validationErrors={errors}
                                isEditing={true}
                                editingValues={values.selected_authors}
                            />
                        }
                        {/* <div style={{ width: '50%', padding: '15px' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>Authors</h2>
                    </div> */}
                    </div>
                    <Divider borderColor="border" />
                    <div style={{ marginBottom: "10px", display: 'flex', marginTop: '20px' }} >
                        {
                            !isLoading &&
                            <IngredientGroupModal
                                onFieldsChange={onValuesChange}
                                clearValue={clearValue}
                                validationErrors={errors}
                                isEditing={true}
                                ingredient_groups_ingredients={values.ingredient_groups_ingredients}
                                groupValues={values.ingredient_groups}
                            />
                        }
                        {/* <div style={{ width: '50%', padding: '15px' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>Authors</h2>
                    </div> */}
                    </div>
                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ marginRight: '10px' }}><Button loading={active} onClick={onSaveAndKeepEditingHandler}>Save & Keep Editing</Button></div>
                        <Button loading={active} onClick={onClickActionHandler}>Save</Button>
                    </div>
                    {/* <ButtonEnd onClickAction={onClickActionHandler} buttonName="Create Ingredient" /> */}
                </div>
            </Card>
            {toastMarkup}
        </div>
        {/* </Frame> */}
    </Box>)
}