import Table from '@/Components/Table';
import { Box, Card, Icon, Text } from '@shopify/polaris';
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
        { title: 'Calories' },
        { title: 'Amount', alignment: 'end' },
        { title: 'Actions', alignment: 'end' }
    ]

    const resourceName = {
        singular: 'ingredient',
        plural: 'ingredients',
    };

    useEffect(() => {
        axiosInstance.get('/api/ingredients').then((response) => {
            let data = response.data.data.map((dt) => {
                let amountText = '-';

                if (dt.amount && dt.unit_measurement) {
                    amountText = `${dt.amount} (${dt.unit_measurement})`
                } else if (dt.amount) {
                    amountText = dt.amount
                } else if (dt.unit_measurement) {
                    amountText = `(${dt.unit_measurement})`
                }

                let action = <div className='action-cell'>
                    <a href={`/ingredients/edit/${dt.id}`} >
                        <Icon source={EditMajor} tone="base" />
                    </a>
                </div>

                return {
                    id: dt.id,
                    name: dt.name,
                    calories: dt.calories ? dt.calories : '-',
                    amount: amountText,
                    action: action
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
        window.location.href = `/ingredients/new`
    }, [])

    const changePageHandle = (url) => {
        axiosInstance.get(url).then((response) => {
            let data = response.data.data.map((dt) => {
                let amountText = '-';

                if (dt.amount && dt.unit_measurement) {
                    amountText = `${dt.amount} (${dt.unit_measurement})`
                } else if (dt.amount) {
                    amountText = dt.amount
                } else if (dt.unit_measurement) {
                    amountText = `(${dt.unit_measurement})`
                }

                let action = <div className='action-cell'>
                    <a href={`/edit/${dt.id}`} >
                        <Icon source={EditMajor} tone="base" />
                    </a>
                </div>

                return {
                    id: dt.id,
                    name: dt.name,
                    calories: dt.calories ? dt.calories : '-',
                    amount: amountText,
                    action: action
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
                        <Text variant="heading3xl" alignment="center" as={'h1'} >Ingredients</Text>
                    </div>
                    {/* <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} > */}
                    <ButtonEnd onClickAction={onClickActionHandler} buttonName={'New Ingredient'} />
                    {/* </div> */}
                    {!loading &&
                        <Table pageChange={changePageHandle} resourceName={resourceName} headings={headings} tableData={ingredients} paginationData={pagination} />
                    }
                </Card>
            </div>
        </div>
    </Box>
}