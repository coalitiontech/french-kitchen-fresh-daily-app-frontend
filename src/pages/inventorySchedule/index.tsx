import Table from '@/Components/Table';
import { Box, Card, Icon, Text, Button, Thumbnail } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import ButtonEnd from '@/Components/ButtonEnd';
import {
    DuplicateIcon,
    EditIcon,
    SkeletonIcon,
    ViewMajor
} from '@shopify/polaris-icons';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';

export default function InventorySchedule() {
    const [inventorySchedule, setInventorySchedule] = useState(null);

    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({})

    const headings = [
        { title: 'ID' },
        { title: 'Image' },
        { title: 'Product Title' },
        { title: 'Overwrite Stock' },
        { title: 'Is Active' },
        { title: 'Next Run Date' },
        { title: 'Actions', alignment: 'end' }
    ]

    const resourceName = {
        singular: 'inventorySchedule',
        plural: 'inventorySchedules',
    };

    const onClickActionHandler = useCallback(() => {
        window.location.href = `/inventorySchedule/new`
    }, [])

    const onTitleFilterChangesHandler = (filter) => {
        setFilters((prevValue) => {
            return { ...prevValue, ...filter };
        })
    }

    const duplicateItem = (id) => {
        axiosInstance.put(`/api/inventorySchedule/duplicate/${id}`).then((response) => {
            getTableData()
        })
    }

    const getTableData = () => {
        let currentFilter = '?' + new URLSearchParams(filters).toString();

        axiosInstance.get('/api/inventorySchedule' + currentFilter).then((response) => {
            let data = response.data.data.map((dt) => {
                let action = <div className='action-cell'>
                    <a style={{cursor: 'pointer'}} onClick={() => duplicateItem(dt.id)} >
                        <Icon source={DuplicateIcon} tone="base" />
                    </a>
                    <a href={`/inventorySchedule/edit/${dt.id}`} >
                        <Icon source={EditIcon} tone="base" />
                    </a>
                </div>

                let thumbnail = <Thumbnail
                    source={dt.product_image}
                    size="small"
                    alt={dt.title}
                />

                return {
                    id: dt.id,
                    image: thumbnail,
                    title: dt.title,
                    overwrite_stock: (dt.overwrite_stock == 1 && dt.overwrite_stock != '') ? <div className='toggle-vip'><Icon source={SkeletonIcon} tone="success" /></div> : <div className='toggle-vip'><Icon source={SkeletonIcon} tone="critical" /></div>,
                    is_active: dt.is_active == 1 ? <div className='toggle-vip'><Icon source={SkeletonIcon} tone="success" /></div> : <div className='toggle-vip'><Icon source={SkeletonIcon} tone="critical" /></div>,
                    next_run_date: (dt.next_run_date && dt.is_active == 1) ? dt.next_run_date : '-',
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

            setInventorySchedule(data);
            setPagination(paginationData)
            setLoading(false)
        })
    }

    useEffect(() => {
        getTableData()
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
                        <Text variant="heading2xl" alignment="center" as={'h1'} >Inventory Schedule</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                        <Button onClick={onClickActionHandler} onTitleFilterChanges={onTitleFilterChangesHandler} buttonName={'New inventorySchedule'}>New Schedule</Button>
                    </div>
                    {!loading &&
                        <Table pageChange={changePageHandle} resourceName={resourceName} headings={headings} tableData={inventorySchedule} paginationData={pagination} />
                    }
                </Card>
            </div>
        </div>
    </Box>
}