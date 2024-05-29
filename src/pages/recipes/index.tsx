import Table from '@/Components/Table';
import { Box, Card, Icon, Text } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import ButtonEnd from '@/Components/ButtonEnd';
import {
    EditMajor,
    ViewMajor
} from '@shopify/polaris-icons';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';

export default function Ingredients() {

    const [ingredients, setIngredients] = useState(null);
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({})

    const headings = [
        { title: 'ID' },
        { title: 'Title' },
        { title: 'Serving Size' },
        { title: 'Prep Time' },
        { title: 'Cook Time' },
        { title: 'Rest Time' },
        { title: 'Visibility' },
        { title: 'Difficulty'},
        { title: 'Actions', alignment: 'end' }
    ]

    const resourceName = {
        singular: 'recipe',
        plural: 'recipes',
    };

    useEffect(() => {
        axiosInstance.get('/api/recipes').then((response) => {
            let data = response.data.data.map((dt) => {
                let action = <div className='action-cell'>
                    <a href={`/recipes/edit/${dt.id}`} >
                        <Icon source={EditMajor} tone="base" />
                    </a>
                </div>

                return {
                    id: dt.id,
                    title: dt.title,
                    serving_size: dt.serving_size ? dt.serving_size : '-',
                    prep_time: dt.prep_time ? dt.prep_time : '-',
                    cook_time: dt.cook_time ? dt.cook_time : '-',
                    rest_time: dt.rest_time ? dt.rest_time : '-',
                    visibility: dt.visibility ? dt.visibility : '-',
                    difficulty: dt.difficulty ? dt.difficulty : '-',
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
        window.location.href = `/recipes/new`
    }, [])

    const onFilterChangesHandler = (filter) => {
        setFilters((prevValue) => {
            if(prevValue['title']){
                return {...{'title': prevValue['title']}, ...filter}
            }
            return { ...filter };
        })
    }

    const onTitleFilterChangesHandler = (filter) => {
        setFilters((prevValue) => {
            return { ...prevValue, ...filter };
        })
    }

    useEffect(() => {
        let currentFilter = '?' + new URLSearchParams(filters).toString();

        axiosInstance.get('/api/recipes' + currentFilter).then((response) => {
            let data = response.data.data.map((dt) => {
                let action = <div className='action-cell'>
                    <a href={`/recipes/edit/${dt.id}`} >
                        <Icon source={EditMajor} tone="base" />
                    </a>
                </div>

                return {
                    id: dt.id,
                    title: dt.title,
                    serving_size: dt.serving_size ? dt.serving_size : '-',
                    prep_time: dt.prep_time ? dt.prep_time : '-',
                    cook_time: dt.cook_time ? dt.cook_time : '-',
                    rest_time: dt.rest_time ? dt.rest_time : '-',
                    visibility: dt.visibility ? dt.visibility : '-',
                    difficulty: dt.difficulty ? dt.difficulty : '-',
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
    }, [filters])

    const changePageHandle = (url) => {
        const parsedURL = (parseUrl(url));
        const searchParams = parsedURL.query;

        setFilters((prevValue) => {
            return { ...prevValue, ...searchParams };
        })
    }

    return <Box minHeight='100vh' maxWidth="100%" as='section' background="bg">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ maxWidth: "70%", display: 'flex', justifyContent: 'center', margin: '25px' }}>
                <Card padding={800} >
                    <div style={{ marginBottom: "10px" }}>
                        <Text variant="heading3xl" alignment="center" as={'h1'} >Recipes</Text>
                    </div>
                    {/* <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} > */}
                    <ButtonEnd onClickAction={onClickActionHandler} onTitleFilterChanges={onTitleFilterChangesHandler} onFilterChanges={onFilterChangesHandler} buttonName={'New Recipe'} />
                    {/* </div> */}
                    {!loading &&
                        <Table pageChange={changePageHandle} resourceName={resourceName} headings={headings} tableData={ingredients} paginationData={pagination} />
                    }
                </Card>
            </div>
        </div>
    </Box>
}