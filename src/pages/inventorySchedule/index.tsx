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

export default function InventorySchedule() {

    const [blackoutDateTime, setBlackoutDateTime] = useState(null);
    const [inventorySchedule, setInventorySchedule] = useState(null);
    
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({})
    
    const headings = [
        { title: 'ID' },
        { title: 'Quantity' },
        { title: 'Blackout Dates' },
        { title: 'Stock DateTime' },
        { title: 'Overwrite Stock' },
        { title: 'Is Active' },
        { title: 'Actions', alignment: 'end' }
    ]

    const resourceName = {
        singular: 'inventorySchedule',
        plural: 'inventorySchedules',
    };

    useEffect(() => {
        axiosInstance.get('/api/inventorySchedule').then((response) => {
            let data = response.data.data.map((dt) => {
                let action = <div className='action-cell'>
                    <a href={`/inventorySchedule/edit/${dt.id}`} >
                        <Icon source={EditIcon} tone="base" />
                    </a>
                </div>

                return {
                    id: dt.id,
                    quantity: dt.quantity ? dt.quantity : '-',
                    blackout_dates: dt.blackout_dates ? dt.blackout_dates : '-',
                    stock_datetime: dt.stock_datetime ? dt.stock_datetime : '-',
                    overwrite_stock: (dt.overwrite_stock == 1 && dt.overwrite_stock != '') ? 'True' : 'False',is_active: dt.is_active == 1 ? 'Enable' : 'Disable',
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
    }, [])

    const onClickActionHandler = useCallback(() => {
        window.location.href = `/inventorySchedule/new`
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

        axiosInstance.get('/api/inventorySchedule' + currentFilter).then((response) => {
             
            let data = response.data.data.map((dt) => {
                let action = <div className='action-cell'>
                    <a href={`/inventorySchedule/edit/${dt.id}`} >
                        <Icon source={EditIcon} tone="base" />
                    </a>
                </div>
                console.log('dt',dt);
                return {
                    id: dt.id,
                    quantity: dt.quantity ? dt.quantity : '-',
                    blackout_dates: dt.blackout_dates ? dt.blackout_dates : '-',
                    stock_datetime: dt.stock_datetime ? dt.stock_datetime : '-',
                    overwrite_stock: (dt.overwrite_stock == 1 && dt.overwrite_stock != '') ? 'True' : 'False',is_active: dt.is_active == 1 ? 'Enable' : 'Disable',
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
           
            setBlackoutDateTime(data);
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
                        <Text variant="heading3xl" alignment="center" as={'h1'} >Inventory Schedule</Text>
                    </div>
                    <Button onClick={onClickActionHandler} onTitleFilterChanges={onTitleFilterChangesHandler} buttonName={'New inventorySchedule'}>New Schedule</Button>
                    {/* <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'end' }} > */}
                     
                    {/* </div> */}
                    {!loading &&
                        <Table pageChange={changePageHandle} resourceName={resourceName} headings={headings} tableData={inventorySchedule} paginationData={pagination} />
                    }
                </Card>
            </div>
        </div>
    </Box>
}