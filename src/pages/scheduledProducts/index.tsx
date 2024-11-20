import {
    Text,
    Box,
    Card,
    DataTable,
    DatePicker,
    Popover,
    Button,
    Autocomplete,
    LegacyStack,
    Tag,
    Link,
} from '@shopify/polaris';
import type { IndexTableRowProps, IndexTableProps, IndexFiltersProps, TabProps, TableData } from '@shopify/polaris';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../plugins/axios';

const currentDate = new Date();
const endDate = new Date();
endDate.setDate(endDate.getDate() + 1)
export default function WithNestedRowsExample() {

    interface Order {
        [key: string]: any;
    }

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';

        const formattedHours = hours % 12 || 12; // Convert to 12-hour format

        return `${year}-${month}-${day}`;
    }

    const [{ month, year }, setDate] = useState({ month: currentDate.getMonth(), year: currentDate.getFullYear() });
    const [selectedDates, setSelectedDates] = useState({
        start: currentDate,
        end: endDate,
    });

    const handleMonthChange = useCallback(
        (month: number, year: number) => setDate({ month, year }),
        [],
    );
    const [orders, setOrders] = useState<TableData[][]>([]);



    const [popoverActive, setPopoverActive] = useState(false);

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

    const activator = (
        <Button onClick={togglePopoverActive} disclosure>
            {`${formatDate(selectedDates.start)} - ${formatDate(selectedDates.end)}`}
        </Button>
    );

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [productinputValue, setProductInputValue] = useState('');
    const [productSelectedOptions, setProductSelectedOptions] = useState<string[]>([]);

    const [productOptions, setProductOptions] = useState([{ label: 'None', value: '' }]);
    const [productOptionsLabel, setProductOptionsLabel] = useState<string[]>([]);

    const [totalQuantity, setTotalQuantity] = useState(0);

    useEffect(() => {
        axiosInstance.get('/api/select/singleShopifyProduct?title=' + productinputValue).then((response) => {
            setProductOptions([{ label: 'None', value: '' }, ...response.data.selectData]);
            setProductOptionsLabel(response.data.optionsLabel);
        })
    }, [productinputValue]);

    useEffect(() => {
        axiosInstance.get('/api/orders/products', {
            params: {
                ...selectedDates,
                product_id: selectedProduct
            }
        }).then((response) => {
            setTotalQuantity(response.data.total_quantity)
            setOrders(response.data.products.map((item) => {
                item[0] = <Link
                    target='_blank'
                    removeUnderline
                    url={`${process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_URL}/orders/${item[0]}`}
                >
                    {`#${item[0]}`}
                </Link>
                return item;
            }));
        })
    }, [selectedProduct, selectedDates])

    const updateCatText = useCallback(
        (value: string) => {
            setProductInputValue(value);
        },
        [],
    );
    const updateProductSelection = useCallback(

        (selected: string[]) => {
            const selectedValue = selected.map((selectedItem) => {
                const matchedOption = productOptions.find((option) => {
                    updateCatText('');
                    return option.value.match(selectedItem);
                });
                setSelectedProduct(selectedItem);
                return matchedOption && matchedOption.label;
            });
            setProductSelectedOptions(selected);
            setProductInputValue('');
        },
        [productOptions],
    );

    let productVerticalContentMarkup =
        selectedProduct > 0 ? (

            <LegacyStack spacing="extraTight" alignment="center">
                <Tag key={selectedProduct} >
                    {productOptionsLabel[selectedProduct]}
                </Tag>
            </LegacyStack>
        ) : null;

    const productTextField = (
        <Autocomplete.TextField
            onChange={updateCatText}
            value={productinputValue}
            //prefix={<Icon source={SearchIcon} tone="base" />}
            placeholder="Search Product"
            verticalContent={productVerticalContentMarkup}
            autoComplete="off"
            name="shopify_product_id"
            label=''
            key="shopify_product_id"
        />
    );

    return (
        <Box minHeight='100vh' maxWidth="100%" as='section' background="bg">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ maxWidth: "90%", width: '100%', display: 'block', justifyContent: 'center', margin: '25px' }}>
                    <Card padding={'800'} >
                        <div style={{ marginBottom: "10px" }}>
                            <Text variant="heading2xl" alignment="center" as={'h1'} >Scheduled Products</Text>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Popover
                                preferredAlignment="left"
                                active={popoverActive}
                                activator={activator}
                                autofocusTarget="first-node"
                                onClose={togglePopoverActive}
                            >
                                <div style={{ display: 'inline-flex', padding: '10px' }}>
                                    <DatePicker
                                        month={month}
                                        year={year}
                                        onChange={setSelectedDates}
                                        onMonthChange={handleMonthChange}
                                        selected={selectedDates}
                                        allowRange
                                    />
                                </div>
                            </Popover>
                            <div style={{ width: '20%' }}>
                                <Autocomplete
                                    options={productOptions}
                                    selected={productSelectedOptions}
                                    textField={productTextField}
                                    onSelect={updateProductSelection}
                                    listTitle="Suggested Products"
                                />
                            </div>
                        </div>
                        <DataTable
                            columnContentTypes={[
                                'text',
                                'text',
                                'text',
                                'text',
                            ]}
                            headings={[
                                'Order Number',
                                'Product Name',
                                'Quantity',
                                'Schedule Date',
                            ]}
                            rows={orders}
                            totals={['', '', totalQuantity, '']}
                            showTotalsInFooter
                        />
                    </Card>
                </div>
            </div>
        </Box>
    );
}