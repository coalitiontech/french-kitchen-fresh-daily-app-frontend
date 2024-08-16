// import { Page, LegacyCard, DataTable, Box } from '@shopify/polaris';
import {
    IndexTable,
    Box,
    useIndexResourceState,
    Text,
    Badge,
    Pagination,
} from '@shopify/polaris';
import { data } from 'autoprefixer';
import React from 'react';

export default function Table({ tableData, headings, resourceName, paginationData, pageChange }) {

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(tableData);

    const rowMarkup = tableData.map(
        (
            data,
            index,
        ) => (
            <IndexTable.Row
                id={data.id}
                key={data.id}
                // selected={selectedResources.includes(data.id)}
                position={index}
            >
                {Object.keys(data).map((key) => {
                    if (key === 'id') {
                        return <IndexTable.Cell key={`${data.id}-${key}`}>
                            <Text variant="bodyMd" fontWeight="bold" as="span">
                                #{data.id}
                            </Text>
                        </IndexTable.Cell>
                    } else if (key === 'amount') {
                        return <IndexTable.Cell key={`${data.id}-${key}`} className='amount-cell' >{data[key]}</IndexTable.Cell>
                    } else if (key === 'action') {
                        return <IndexTable.Cell key={`${data.id}-${key}`} className='action-cell2' >{data[key]}</IndexTable.Cell>
                    } else {
                        return <IndexTable.Cell key={`${data.id}-${key}`} >{data[key]}</IndexTable.Cell>
                    }
                })}
            </IndexTable.Row>
        ),
    );

    return (
        // <Page title="Sales by product">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* <div style={{ width: '4000px' }}> */}
            <div style={{ width: '100%' }}>
                <IndexTable
                    resourceName={resourceName}
                    itemCount={tableData.length}
                    selectable={false}
                    // selectedItemsCount={
                    //     allResourcesSelected ? 'All' : selectedResources.length
                    // }
                    // onSelectionChange={handleSelectionChange}
                    headings={headings}
                >
                    {rowMarkup}
                </IndexTable>
                <div
                    style={{
                        // maxWidth: '700px',
                        margin: 'auto',
                        border: '1px solid var(--p-color-border)'
                    }}
                >
                    <Pagination
                        onPrevious={() => {
                            pageChange(paginationData.prev_page_url)
                        }}
                        onNext={() => {
                            pageChange(paginationData.next_page_url)
                        }}
                        type="table"
                        hasNext={paginationData.next_page_url}
                        hasPrevious={paginationData.prev_page_url}
                        label={`${paginationData.from}-${paginationData.to} of ${paginationData.total}`}
                    />
                </div>
            </div>
        </div>
        // </Page>
    );
}