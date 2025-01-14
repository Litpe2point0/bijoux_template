import React, { createContext, useEffect, useState, useContext, useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
    CButtonGroup,
    CRow,
    CCol,
    CCardHeader,
    CButton,
    CSpinner,
} from '@coreui/react'
import Modal_Button from "../component_items/Modal/ModalButton"
import { image_url } from "../../api/Back_End_Url";
import AvatarInput from "../component_items/Avatar/Avatar";
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import './style/style.css'
import { get_account_list } from "../../api/main/accounts/Account_api";
import { quote_status_creator } from "../component_items/Ag-grid/status_badge";
import { Money } from "phosphor-react";
import { useNavigate } from 'react-router-dom';
import { get_assigned_quote_sale } from "../../api/main/orders/Quote_api";



export const SaleQuotePageContext = createContext();



const state_creator = (table, navigate) => {
    const state = {
        columnDefs: [
            { headerName: "ID", field: "id", flex: 0.3 },
            {
                headerName: "Product ID", field: "product.id", flex: 0.5,
            },
            {
                headerName: "Image", flex: 0.5,
                cellRenderer: (params) => {
                    return (
                        <img className="rounded-3" width={'100%'} src={params.data.product.imageUrl} />)

                },
            },
            {
                headerName: "Customer Name",
                cellRenderer: (params) => {
                    return params.data.account.fullname
                },
            },
            {
                headerName: "Contact Number",
                cellRenderer: (params) => {
                    return params.data.account.phone
                },
            },
            { headerName: "Created", field: "created", flex: 0.4 },
            {
                headerName: "Status",
                cellClass: 'd-flex align-items-center py-1',
                valueGetter: 'data.quote_status.id',
                cellRenderer: (params) => {
                    const quote_status = params.data.quote_status;
                    return quote_status_creator(quote_status);


                },
            },
            {
                headerName: "Pricing",
                cellClass: 'd-flex justify-content-center py-0',
                cellRenderer: (params) => {
                    //console.log(params.data)
                    const quote_status = params.data.quote_status;
                    const quote_id = params.data.id;

                    return (
                        <>
                            {quote_status.id == 2 ?
                                <CButton style={{ border: 'none' }} onClick={() => {

                                    navigate('/quotes_sale_staff/detail/' + quote_id);
                                }} className="border-none h-100">
                                    <Money size={30} color="green " weight="duotone" />
                                </CButton> :

                                <Money size={30} color="gray" weight="duotone" />


                            }
                        </>

                    )

                },
                flex: 0.5,
            }

        ],
        rowData: table

    }
    return state
}



const Quote_Page = () => {
    const [key, setKey] = useState('customize');
    let [state, setState] = useState(null);
    const navigate = useNavigate();
    const handleDataChange = async () => {
        const quoteList = await get_assigned_quote_sale();


        //console.log("quoteList ", quoteList.data)
        setState({
            customize: state_creator(quoteList.data, navigate),
        })
    }

    useEffect(() => {
        handleDataChange()
    }, [])


    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            filter: true,
            autoHeight: true,
            wrapText: true,
            cellClass: 'd-flex align-items-center',
        };
    }, [])
    return (
        <SaleQuotePageContext.Provider value={{ handleDataChange: handleDataChange }}>
            <CRow>
                <CCol xs={12} className="quote-table">
                    {state === null ? <CButton className="w-100" color="secondary" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton> :

                        <Tabs
                            defaultActiveKey="template"
                            id="fill-tab-example"
                            className="mb-3"
                            activeKey={key}
                            fill
                            onSelect={(key) => {
                                setKey(key)
                                resetHeaderProperties();
                            }}

                        >
                            {key === 'customize' &&
                                <Tab eventKey="customize" title="Customize">
                                    <div
                                        id="customize"
                                        style={{
                                            boxSizing: "border-box",
                                            height: "100%",
                                            width: "100%"
                                        }}
                                        className="ag-theme-quartz"
                                    >
                                        <AgGridReact
                                            enableColResize={true}
                                            columnDefs={state.customize.columnDefs}
                                            rowData={state.customize.rowData}
                                            defaultColDef={defaultColDef}
                                            rowHeight={35}
                                            headerHeight={30}
                                            pagination={true}
                                            paginationPageSize={10}
                                            domLayout='autoHeight'
                                            onGridReady={onGridReady('customize')}
                                        />
                                    </div>

                                </Tab>
                            }

                        </Tabs>
                    }

                </CCol>






            </CRow>






        </SaleQuotePageContext.Provider>
    );

}
export default Quote_Page;
