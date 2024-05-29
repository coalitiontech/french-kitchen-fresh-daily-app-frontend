import Table from '@/Components/Table';
import { Box, Card, Text, Icon } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import ButtonEnd from '@/Components/ButtonEnd';
import {
    EditMajor,
    ViewMajor
} from '@shopify/polaris-icons';

export default function Ingredients() {

    const [ingredients, setIngredients] = useState(null);
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState(null);

    const headings = [
        { title: 'ID' },
        { title: 'Name' },
        { title: 'Email' },
        { title: 'URL'},
        { title: 'Actions', alignment: 'end' }
    ]

    const resourceName = {
        singular: 'author',
        plural: 'authors',
    };

    useEffect(() => {
        axiosInstance.get('/api/authors').then((response) => {
            let data = response.data.data.map((dt) => {

                let action = <div className='action-cell'>
                    <a href={`/authors/edit/${dt.id}`} >
                        <Icon source={EditMajor} tone="base" />
                    </a>
                </div>

                return {
                    id: dt.id,
                    name: dt.name,
                    email: dt.email ? dt.email : '-',
                    url: dt.url ? dt.url : '-',
                    action
                }
            })
            const responseData = response.data

            const format = new Intl.NumberFormat()

            const paginationData = {
                current_page: responseData.current_page,
                first_page_url: responseData.first_page_url,
                last_page: responseData.last_page,
                last_page_url: responseData.last_page_url,
                next_page_url: responseData.next_page_url,
                prev_page_url: responseData.prev_page_url,
                from: format.format(responseData.from),
                to: format.format(responseData.to),
                total: format.format(responseData.total),
                per_page: responseData.per_page
            }

            setIngredients(data)
            setPagination(paginationData)
            setLoading(false)
        })
    }, [])

    const onClickActionHandler = useCallback(() => {
        window.location.href = `/authors/new`
    }, [])

    const changePageHandle = (url) => {
        axiosInstance.get(url).then((response) => {
            let data = response.data.data.map((dt) => {

                let action = <div className='action-cell'>
                    <a href={`/authors/edit/${dt.id}`} >
                        <Icon source={EditMajor} tone="base" />
                    </a>
                </div>

                return {
                    id: dt.id,
                    name: dt.name,
                    email: dt.email ? dt.email : '-',
                    url: dt.url ? dt.url : '-',
                    action
                }
            })
            const responseData = response.data

            const format = new Intl.NumberFormat()

            const paginationData = {
                current_page: responseData.current_page,
                first_page_url: responseData.first_page_url,
                last_page: responseData.last_page,
                last_page_url: responseData.last_page_url,
                next_page_url: responseData.next_page_url,
                prev_page_url: responseData.prev_page_url,
                from: format.format(responseData.from),
                to: format.format(responseData.to),
                total: format.format(responseData.total),
                per_page: responseData.per_page
            }

            setIngredients(data)
            setPagination(paginationData)
            setLoading(false)
        })
    }

    return <Box minHeight='100vh' maxWidth="100%" as='section' background="bg">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ maxWidth: "70%", display: 'flex', justifyContent: 'center', margin: '25px' }}>
                <Card padding={800} >
                    <div style={{ marginBottom: "10px" }}>
                        <Text variant="heading3xl" alignment="center" as={'h1'} >Authors</Text>
                    </div>
                    {/* <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} > */}
                    <ButtonEnd onClickAction={onClickActionHandler} buttonName={'New Author'} />
                    {/* </div> */}
                    {!loading &&
                        <Table pageChange={changePageHandle} resourceName={resourceName} headings={headings} tableData={ingredients} paginationData={pagination} />
                    }
                </Card>
            </div>
        </div>
    </Box>
}