import Table from '@/Components/Table';
import { Box, Card, Icon, Text, Button } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import ButtonEnd from '@/Components/ButtonEnd';
import {
    EditIcon,
    ViewMajor
} from '@shopify/polaris-icons';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';

export default function Settings() {

    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({})

    const headings = [
        { title: 'ID' },
        { title: 'Delivery -  Minimum Items', alignment: 'left' },
        { title: 'Minimum Order Total', alignment: 'left' },
        { title: 'Pick Up - Minimum Items', alignment: 'left' },
        { title: 'Pick Up - Minimum Order Total', alignment: 'left' },
        { title: 'Actions', alignment: 'end' }
    ]

    const resourceName = {
        singular: 'setting',
        plural: 'settings',
    };

    const onClickActionHandler = useCallback(() => {
        window.location.href = `/settings/new`
    }, [])

    const onFilterChangesHandler = (filter) => {
        setFilters((prevValue) => {
            if (prevValue['name']) {
                return { ...{ 'name': prevValue['name'] }, ...filter }
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

        axiosInstance.get('/api/settings' + currentFilter).then((response) => {
            let data = response.data.data.map((dt) => {
                let action = <div className='action-cell'>
                    <a href={`/settings/edit/${dt.id}`} >
                        <Icon source={EditIcon} tone="base" />
                    </a>
                </div>

                const decodedConfig = dt.minimum_cart_contents_config;

                return {
                    id: dt.id,
                    del_min_items: decodedConfig.delivery ? decodedConfig.delivery.min_items : '-',
                    del_min_order_total: decodedConfig.delivery ? decodedConfig.delivery.min_order_total : '-',
                    pickup_min_items: decodedConfig.pickup ? decodedConfig.pickup.min_items : '-',
                    pickup_min_order_total: decodedConfig.pickup ? decodedConfig.pickup.min_order_total : '-',
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

            setSettings(data);
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
                        <Text variant="heading2xl" alignment="center" as={'h1'} >Settings</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                        <Button onClick={onClickActionHandler} onTitleFilterChanges={onTitleFilterChangesHandler} buttonName={'New Settings'}>New Settings</Button>
                    </div>
                    {!loading &&
                        <Table pageChange={changePageHandle} resourceName={resourceName} headings={headings} tableData={settings} paginationData={pagination} />
                    }
                </Card>
            </div>
        </div>
    </Box>
}