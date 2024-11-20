import {
    Text,
    IndexTable,
    useBreakpoints,
    Box,
    Card,
    Filters,
} from '@shopify/polaris';
import type { IndexTableRowProps, IndexTableProps, IndexFiltersProps, TabProps } from '@shopify/polaris';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../plugins/axios';

export default function WithNestedRowsExample() {
    interface Product {
        [key: string]: any;
    }

    interface Order {
        [key: string]: any;
    }

    interface ProductRow extends Product {
        position: number;
    }

    interface ProductGroup {
        id: string;
        position: number;
        products: ProductRow[];
    }

    interface Groups {
        [key: string]: ProductGroup;
    }

    const [queryValue, setQueryValue] = useState<string | undefined>(undefined);

    const handleFiltersQueryChange = useCallback(
        (value: string) => setQueryValue(value),
        [],
    );

    const handleQueryValueRemove = useCallback(
        () => setQueryValue(undefined),
        [],
    );

    const handleFiltersClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [
        handleQueryValueRemove,
    ]);

    const [orders, setOrders] = useState<Order[]>([]);
    const [pagination, setPagination] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        axiosInstance.get(`/api/orders?page=${currentPage}&queryText=${queryValue}`).then((response) => {
            // console.log(response.data)
            setOrders(response.data.data);
            const pagination = {...response.data};
            delete pagination.data
            console.log(pagination)
            setPagination(pagination)
        })
    }, [queryValue, currentPage])

    const columnHeadings = [
        { title: 'Order Details', id: 'column-header--size' },
        {
            hidden: false,
            id: 'column-header--sku',
            title: 'SKU',
        },
        {
            id: 'column-header--price',
            title: 'Price',
        },
        {
            id: 'column-header--quantity',
            title: 'Quantity',
        },
    ];

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };


    const rowMarkup = orders.map((item, index) => {
        let USDollar = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        return (
            <Fragment key={item.order_number}>
                <IndexTable.Row
                    hideSelectable={true}
                    rowType="subheader"
                    id={`Parent-${index}`}
                    position={item.order_number}
                >
                    <IndexTable.Cell scope="col" id={item.order_number}>
                        <div style={{ display: 'inline-flex', gap: '25px' }}>
                            <Text as="span" fontWeight="semibold">
                                {`#${item.order_number}`}
                            </Text>
                            <Text as="span" fontWeight="semibold">
                                {`${item.full_name}`}
                            </Text>
                            <Text as="span" fontWeight="semibold">
                                {`${USDollar.format(item.total_price)}`}
                            </Text>
                            <Text as="span" fontWeight="semibold">
                                {`${item.scheduled_date ? item.scheduled_date : ''}`}
                            </Text>
                        </div>
                    </IndexTable.Cell>
                    <IndexTable.Cell />
                    <IndexTable.Cell />
                    <IndexTable.Cell />
                </IndexTable.Row>
                {item.line_items.map(
                    ({ name, sku, price, quantity }, rowIndex) => (
                        <IndexTable.Row
                            rowType="child"
                            // hideSelectable={true}
                            key={rowIndex}
                            id={sku}
                            position={rowIndex}
                        >
                            <IndexTable.Cell
                                scope="row"
                                headers={`${columnHeadings[0].id} ${item.order_number}`}
                            >
                                <Text variant="bodyMd" as="span">
                                    {name}
                                </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                                <Text as="span">
                                    {sku}
                                </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                                <Text as="span">
                                    {price}
                                </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                                <Text as="span">
                                    {quantity}
                                </Text>
                            </IndexTable.Cell>
                        </IndexTable.Row>
                    ),
                )}
            </Fragment>
        );
    })

    return (
        <Box minHeight='100vh' maxWidth="100%" as='section' background="bg">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ maxWidth: "90%", width: '100%', display: 'block', justifyContent: 'center', margin: '25px' }}>
                    <Card padding={'800'} >
                        <div style={{ marginBottom: "10px" }}>
                            <Text variant="heading2xl" alignment="center" as={'h1'} >Orders</Text>
                        </div>
                        <div>
                            <Filters
                                queryPlaceholder="Search"
                                queryValue={queryValue}
                                onQueryChange={handleFiltersQueryChange}
                                onQueryClear={handleQueryValueRemove}
                                filters={[]}
                                disableFilters={true}
                                onClearAll={handleFiltersClearAll}
                            />
                        </div>
                        <IndexTable
                            selectable={false}
                            condensed={useBreakpoints().smDown}
                            resourceName={resourceName}
                            itemCount={orders.length}
                            headings={columnHeadings as IndexTableProps['headings']}
                            pagination={{
                                hasNext: pagination.next_page_url,
                                hasPrevious: pagination.prev_page_url,
                                onNext: () => {
                                    setCurrentPage(prevValue => (prevValue + 1))
                                },
                                onPrevious: () => {
                                    setCurrentPage(prevValue => (prevValue - 1))
                                },
                              }}
                        >
                            {rowMarkup}
                        </IndexTable>
                    </Card>
                </div>
            </div>
        </Box>
    );
}