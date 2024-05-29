import ButtonEnd from '@/Components/ButtonEnd';
import { Box, Card, Text, TextField, Button, Toast, Frame, Icon, Link } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import {
    MobileBackArrowMajor
} from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import QuillJs from '@/Components/QuillJs';

export default function NewAuthor() {
    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({
        name: null
    })
    const [active, setActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter();
    const processId = router.query.id

    useEffect(() => {
        if (processId) {

            axiosInstance.get(`/api/authors/${processId}`).then((response) => {
                const data = response.data
                setValues({
                    name: data.name,
                    email: data.email ? data.email : '',
                    description: data.description ? data.description : '',
                    url: data.url ? data.url : '',
                })
                setIsLoading(false)
            })
        }
    }, [processId])

    const onValuesChange = (value, name) => {

        setValues((prevValue) => {
            let valueBkp = { ...prevValue }

            valueBkp[name] = value

            return valueBkp
        })
    }

    const toastMarkup = active ? (
        <Toast content="Author Created Successfully!" onDismiss={() => {
            setActive(false)
        }} />
    ) : null;

    const onSaveAndKeepEditingHandler = useCallback(() => {
        axiosInstance.put(`/api/authors/${processId}`, values).then((response) => {
            setErrors({
                name: null
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
        axiosInstance.put(`/api/authors/${processId}`, values).then((response) => {
            window.location.href = `/authors`
        }).catch((response) => {
            const errors = response.response.data.errors
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

    return (<Box minHeight='100vh' maxWidth="100%" as='section' background="bg">
        {/* <Frame> */}
        <div style={{ maxWidth: "80%", display: 'flex', justifyContent: 'center', margin: '25px', marginLeft: 'auto', marginRight: 'auto' }}>
            <Card padding={800} >
                <div style={{ width: '4000px', maxWidth: '100%' }}>
                    <a className='back-button' href='/authors' style={{ position: 'absolute', display: 'flex', textDecoration: 'none' }}>
                        <Icon
                            source={MobileBackArrowMajor}
                            tone="base"
                        /><span> Back</span>
                    </a>
                    <div style={{ marginBottom: "10px" }}>
                        <Text variant="heading3xl" alignment="center" as={'h1'} >Edit Author</Text>
                    </div>
                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ width: '100%', display: 'flex' }}>
                            <div style={{ width: '50%', padding: '15px' }}>
                                <TextField
                                    name='name'
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
                                    label="Email"
                                    type='email'
                                    value={values.email}
                                    error={errors.email}
                                    autoComplete="off"
                                    inputMode='email'
                                    onChange={(value) => {
                                        onValuesChange(value, 'email')
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
                                    multiline={4}
                                    onChange={(value) => {
                                        onValuesChange(value, 'description')
                                    }}
                                /> */}
                                </div>
                                <div style={{ width: '50%', padding: '15px' }}>
                                    <TextField
                                        label="URL"
                                        value={values.url}
                                        error={errors.url}
                                        autoComplete="off"
                                        type='url'
                                        inputMode='url'
                                        onChange={(value) => {
                                            onValuesChange(value, 'url')
                                        }}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                    <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} >
                        <div style={{ marginRight: '10px' }}><Button loading={active} onClick={onSaveAndKeepEditingHandler}>Save & Keep Editing</Button></div>
                        <Button loading={active} onClick={onClickActionHandler}>Create</Button>
                    </div>
                    {/* <ButtonEnd onClickAction={onClickActionHandler} buttonName="Create Author" /> */}
                </div>
            </Card>
            {toastMarkup}
        </div>
        {/* </Frame> */}
    </Box>)
}