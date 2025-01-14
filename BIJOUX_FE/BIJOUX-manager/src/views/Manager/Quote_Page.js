import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardImage,
    CCardTitle,
    CCardText,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CRow,
    CCol,
    CCardHeader,
    CSpinner,
} from '@coreui/react'
import Modal_Button from "../component_items/Modal/ModalButton"
import { UsersThree, Eye, UserCirclePlus, CalendarX } from "phosphor-react";
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import './style/style.css'
import StaffUpdate from "./Modal_body/StaffUpdate";
import { quote_status_creator } from "../component_items/Ag-grid/status_badge";
import AssignForm from "./Modal_body/QuoteAssign";
import QuoteCancel from "./Modal_body/QuoteCancel";
import { get_account_list } from "../../api/main/accounts/Account_api";
import { get_quote_list_manager } from "../../api/main/orders/Quote_api";



export const QuotePageContext = createContext();

const state_creator = (table) => {
    const state = {
        columnDefs: [
            { headerName: "ID", field: "id", flex: 0.4 },
            { headerName: "Product ID", field: "product.id", flex: 0.6 },
            {
                headerName: "Image", flex: 0.5,
                cellRenderer: (params) => {
                    return (
                        <img className="rounded-3" width={'100%'} src={params.data.product.imageUrl} />)
                },
            },
            { headerName: "Customer", field: "account.fullname" },
            { headerName: "Phone", field: "account.phone" },
            { headerName: "Created", field: "created" },
            {
                headerName: "Status",
                valueGetter: 'data.quote_status.id',
                cellClass: 'd-flex align-items-center py-1',
                cellRenderer: (params) => {
                    const quote_status = params.data.quote_status;
                    return quote_status_creator(quote_status);
                }
            },
            {
                headerName: "Option",
                cellClass: 'd-flex justify-content-center py-0',
                cellRenderer: (params) => {
                    const assign_props = {
                        assignForm: <AssignForm quote={params.data} />,
                        title: 'Assign Staff For Quote [ID: #' + params.data.id + ']',
                        button: <UsersThree size={30} color={params.data.saleStaff_id != null && params.data.designStaff_id != null && params.data.productionStaff_id != null  ? 'gray' : "purple"} weight="duotone" />,
                        update_button_color: 'white',
                        status: params.data.quote_status.id,
                    }
                    const cancel_props = {
                        assignForm: <QuoteCancel quote={params.data} />,
                        title: 'Cancel Quote [ID: #' + params.data.id + ']',
                        button: <CalendarX size={30} color={params.data.quote_status.id == 4 || params.data.quote_status.id == 5 ? 'gray' : 'crimson'} weight="duotone" />,
                        update_button_color: 'white',
                        status: params.data.quote_status.id,
                    }
                    return (

                        <CButtonGroup style={{ width: '100%', height: "100%" }} role="group" aria-label="Basic mixed styles example">
                            <Modal_Button
                                disabled={false}
                                title={assign_props.title}
                                content={assign_props.button}
                                color={assign_props.color} >
                                {assign_props.assignForm}
                            </Modal_Button>
                            <Modal_Button
                                disabled={assign_props.status == 4 || assign_props.status == 5}
                                title={cancel_props.title}
                                content={cancel_props.button}
                                color={cancel_props.color} >
                                {cancel_props.assignForm}
                            </Modal_Button>
                        </CButtonGroup>
                    )

                },
                flex: 0.8,
            }

        ],
        rowData: table

    }
    return state
}

const Quote_Page = () => {
    const [key, setKey] = useState('customize');
    const [quoteList, setQuoteList] = useState(null);
    let [state, setState] = useState(null);

    const handleDataChange = async () => {
        
        const quoteList = await get_quote_list_manager();
        setQuoteList(quoteList.data);

        setState({
            customize: state_creator(quoteList.data)
        })
        //alert("ON DATA CHANGE NÈ")
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
        <QuotePageContext.Provider value={{ handleDataChange: handleDataChange }}>
            <CRow>
                <CCol xs={12}>
                    {state === null ? <CButton className="w-100" color="secondary" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton> :

                        <Tabs
                            defaultActiveKey="customize"
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
                                <Tab eventKey="customize" title="Customize Staff Assignment">
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
        </QuotePageContext.Provider>

    );

}
export default Quote_Page;
