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
import { get_product_list, update_product_list } from "../../api/ProductApi";
import Modal_Button from "../component_items/Modal/ModalButton"
import { UsersThree, Eye, UserCirclePlus, CalendarX } from "phosphor-react";
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import './style/style.css'
import StaffUpdate from "./Modal_body/StaffUpdate";
import { order_status_creator, quote_status_creator } from "../component_items/Ag-grid/status_badge";
import AssignForm from "./Modal_body/QuoteAssign";
import QuoteCancel from "./Modal_body/QuoteCancel";
import { get_account_list } from "../../api/main/accounts/Account_api";
import OrderAssign from "./Modal_body/OrderAssign";
import OrderCancel from "./Modal_body/OrderCancel";
import { get_order_list_manager } from "../../api/main/orders/Order_api";
import { CurrencyFormatter, CurrencyFormatterLowercase } from "../component_items/Ag-grid/money_formatter";



export const OrderPageContext = createContext();

const state_creator = (table) => {
  const state = {
    columnDefs: [
      { headerName: "ID", field: "id", flex: 0.5 },
      { headerName: "Product ID", field: "product.id", flex: 0.6 },
      {
        headerName: "Image", flex: 0.6,
        cellRenderer: (params) => {
          return (
            <img className="rounded-3" width={'100%'} src={params.data.product.imageUrl} />)

        },
      },
      { headerName: "Customer", field: "account.fullname" },
      {
        headerName: "Materials Cost", field: "product_price", cellClass: 'd-flex align-items-center fw-bold text-primary'
        , cellRenderer: (params) => {
          return (
            <CurrencyFormatter value={params.data.product_price} />
          )
        }
      },
      { headerName: "Profit Rate %", field: "profit_rate", cellClass: 'd-flex align-items-center fw-bold text-primary' },
      {
        headerName: "Production Cost", field: "production_price", cellClass: 'd-flex align-items-center fw-bold text-primary'
        , cellRenderer: (params) => {
          return (
            <CurrencyFormatter value={params.data.production_price} />
          )
        }
      },
      {
        headerName: "Total Cost", field: "total_price", cellClass: 'd-flex align-items-center fw-bold text-danger'
        , cellRenderer: (params) => {
          return (
            <CurrencyFormatter value={params.data.total_price} />
          )
        }
      },
      { headerName: "Created", field: "created" },
      {
        headerName: "Status",
        valueGetter: 'data.order_status.id',
        cellClass: 'd-flex align-items-center py-1',
        cellRenderer: (params) => {
          const order_status = params.data.order_status;
          //console.log(order_status)
          return order_status_creator(order_status);
        }
      },
      {
        headerName: "Option",
        cellClass: 'd-flex justify-content-center py-0',
        cellRenderer: (params) => {
          const assign_props = {
            assignForm: <OrderAssign order={params.data} />,
            title: 'Order Detail [ID: #' + params.data.id + ']',
            button:
              params.data.productionStaff_id == null ?
                <UsersThree size={30} color={"purple"} weight="duotone" />
                : <Eye size={30} color={"purple"} weight="duotone" />

            ,
            update_button_color: 'white',
            status: params.data.order_status.id,
          }
          const cancel_props = {
            assignForm: <OrderCancel order={params.data} />,
            title: 'Cancel Order [ID: #' + params.data.id + ']',
            button: <CalendarX size={30} color={params.data.order_status.id == 6 ? 'gray' : 'crimson'} weight="duotone" />,
            update_button_color: 'white',
            status: params.data.order_status.id,
          }
          return (

            <CButtonGroup style={{ width: '100%', height: "100%" }} role="group" aria-label="Basic mixed styles example" >
              <Modal_Button
                disabled={false}
                title={assign_props.title}
                content={assign_props.button}
                color={assign_props.color} >
                {assign_props.assignForm}
              </Modal_Button>
              <Modal_Button
                disabled={params.data.order_status.id == 6}
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




const Order_Page = () => {
  const [key, setKey] = useState('template');
  const [orderList, setOrderList] = useState(null);
  let [state, setState] = useState(null);

  const handleDataChange = async () => {
    const orderList = await get_order_list_manager();
    setOrderList(orderList.data);

    setState({
      template: state_creator(orderList.data.template_order_list),
      customize: state_creator(orderList.data.customize_order_list)
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
    <OrderPageContext.Provider value={{ handleDataChange: handleDataChange }}>
      <CRow>
        <CCol xs={12}>
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

              <Tab eventKey="template" title="By Template Orders">
                {
                  key === 'template' && <div
                    id="template"
                    style={{
                      boxSizing: "border-box",
                      height: "100%",
                      width: "100%"
                    }}
                    className="ag-theme-quartz"
                  >
                    <AgGridReact
                      enableColResize={true}
                      columnDefs={state.template.columnDefs}
                      rowData={state.template.rowData}
                      defaultColDef={defaultColDef}
                      rowHeight={35}
                      headerHeight={30}
                      pagination={true}
                      paginationPageSize={10}
                      domLayout='autoHeight'
                      onGridReady={onGridReady('template')}
                    />
                  </div>
                }
              </Tab>


              <Tab eventKey="customize" title="Customize Orders">
                {
                  key === 'customize' &&
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
                }
              </Tab>

            </Tabs>
          }

        </CCol>
      </CRow>
    </OrderPageContext.Provider>

  );

}
export default Order_Page;
