import Table from '@/Components/Table';
import { Box, Card, Icon, Text, Button, Toast } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';
import ButtonEnd from '@/Components/ButtonEnd';
import {
    DuplicateIcon,
    EditIcon,
    SkeletonIcon,
    ViewMajor,
    DeleteIcon
} from '@shopify/polaris-icons';
import { parseUrl } from 'next/dist/shared/lib/router/utils/parse-url';

export default function BlackoutDateTime() {

    const [blackoutDateTime, setBlackoutDateTime] = useState(null);
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({})
    const [active, setActive] = useState(false);

    const headings = [
        { title: 'ID' },
        { title: 'Start Time' },
        { title: 'End Time' },
        { title: 'Start Date' },
        { title: 'End Date' },
        { title: 'Status' },
        { title: 'Apply To All Locations' },
        { title: 'Actions', alignment: 'end' }
    ]

    const resourceName = {
        singular: 'blackoutDateTime',
        plural: 'blackoutDateTimes',
    };

    const onClickActionHandler = useCallback(() => {
        window.location.href = `/blackoutSettings/new`
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

    const duplicateItem = (id) => {
        axiosInstance.put(`/api/blackoutDateTime/duplicate/${id}`).then((response) => {
            getTableData()
        })
    }

    const toastMarkup = active ? (
        <Toast content="Setting Deleted Successfully!" onDismiss={() => {
            
        }} />
    ) : null;

    const onDeleteClickActionHandler = (id) => {
        setActive(true); 
        axiosInstance.delete(`/api/blackoutDateTime/${id}`).then((response) => {
            window.location.href = `/blackoutSettings`;
            setActive(false);
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
        });
    }

    const getTableData = () => {
        let currentFilter = '?' + new URLSearchParams(filters).toString();

        axiosInstance.get('/api/blackoutDateTime' + currentFilter).then((response) => {
            let data = response.data.data.map((dt) => {
                let action = <div className='action-cell'>
                    <a style={{ cursor: 'pointer' }} onClick={() => duplicateItem(dt.id)} >
                        <Icon source={DuplicateIcon} tone="base" />
                    </a>
                    <a href={`/blackoutSettings/edit/${dt.id}`} >
                        <Icon source={EditIcon} tone="base" />
                    </a>
                    <a
                        title="Delete Setting" 
                        onClick={(e) => {
                            const confirmed = confirm("Are you sure you want to delete this setting?");
                            if (!confirmed) {
                              e.preventDefault();
                            } else {
                              e.preventDefault();  
                              onDeleteClickActionHandler(dt.id);  
                            }
                          }}
                        >
                        <Icon source={DeleteIcon} tone="base" />
                    </a>
                </div>

                return {
                    id: dt.id,
                    start_time: dt.start_time ? dt.start_time : '-',
                    end_time: dt.end_time ? dt.end_time : '-',
                    start_date: dt.start_date ? dt.start_date : '-',
                    end_date: dt.end_date ? dt.end_date : '-',
                    status: <div className='toggle-vip'><span style={{padding: '4px 8px', backgroundColor: dt.status == 1 ? '#81bdae' : "#f0959b", color: 'black', borderRadius: '5px', fontWeight: 700}}>{dt.status == 1 ? 'Is Active' : "Not Active"}</span></div>,
                    apply_to_all_locations: (dt.apply_to_all_locations == 1 && dt.apply_to_all_locations != '') ? <div className='toggle-vip'><Icon source={SkeletonIcon} tone="success" /></div> : <div className='toggle-vip'><Icon source={SkeletonIcon} tone="critical" /></div>,
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
                        <Text variant="heading2xl" alignment="center" as={'h1'} >BlackoutDateTime</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                        <Button onClick={onClickActionHandler} onTitleFilterChanges={onTitleFilterChangesHandler} buttonName={'New BlackoutDateTime'}>New BlackoutDateTime</Button>
                    </div>
                    {!loading &&
                        <Table pageChange={changePageHandle} resourceName={resourceName} headings={headings} tableData={blackoutDateTime} paginationData={pagination} />
                    }
                </Card>
                {toastMarkup}
            </div>
        </div>
    </Box>
}