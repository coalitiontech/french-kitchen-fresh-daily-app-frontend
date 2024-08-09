import Table from '@/Components/Table';
import { Box, Card, Icon, Text } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import ButtonEnd from '@/Components/ButtonEnd';
import {
    EditIcon,
} from '@shopify/polaris-icons';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';

export default function Locations() {

    const [locations, setLocations] = useState(null);
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({})

    const headings = [
        { title: 'ID' },
        { title: 'Name' },
        { title: 'Address1' },
        { title: 'Address2' },
        { title: 'City' },
        { title: 'Zip' },
        { title: 'Country' },
        { title: 'Phone'},
        { title: 'Actions', alignment: 'end' }
    ]

    const resourceName = {
        singular: 'location',
        plural: 'locations',
    };

    const onClickActionHandler = useCallback(() => {
        window.location.href = `/shopifyLocation/new`
    }, [])

    const onFilterChangesHandler = (filter) => {
        setFilters((prevValue) => {
            if(prevValue['name']){
                return {...{'name': prevValue['name']}, ...filter}
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

        axiosInstance.get('/api/shopifyLocation' + currentFilter).then((response) => {
            let data = response.data.data.map((dt) => {
                let action = <div className='action-cell'>
                    <a href={`/locations/edit/${dt.id}`} >
                        <Icon source={EditIcon} tone="base" />
                    </a>
                </div>

                return {
                    id: dt.id,
                    name: dt.name,
                    address1: dt.address1 ? dt.address1 : '-',
                    address2: dt.address2 ? dt.address2 : '-',
                    city: dt.city ? dt.city : '-',
                    zip: dt.zip ? dt.zip : '-',
                    country: dt.country ? dt.country : '-',
                    phone: dt.phone ? dt.phone : '-',
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

            setLocations(data)
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
            <div style={{ maxWidth: "90%", width: '100%', display: 'block', justifyContent: 'center', margin: '25px' }}>
                <Card padding={800} >
                    <div style={{ marginBottom: "10px" }}>
                        <Text variant="heading2xl" alignment="center" as={'h1'} >Locations</Text>
                    </div>
                    {!loading &&
                        <Table pageChange={changePageHandle} resourceName={resourceName} headings={headings} tableData={locations} paginationData={pagination} />
                    }
                </Card>
            </div>
        </div>
    </Box>
}