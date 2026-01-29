import { message, Modal } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector} from "react-redux";
import * as XLSX from "xlsx";
import moment from "moment";

import { Button, ButtonRow, Overlay, ModalTitle, Error1, ExportExcel, TableRowResize, ExportExcelLink, Money, CellMoney, CellSelect, CellInput, CellDate, DynamicBSIcon} from "../../all";
import { getList, sendRequest } from "../../../services";
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { CustomerSelectItem } from "./SelectItem";

export default function CustomerReceivable(props) {
    const {visible, closeModal, onSearch, data, disabled, selected, date} = props;
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [detail, setDetail] = useState([]);
    const [siteData, setSiteData] = useState([]);
    const [customerMap, setCustomerMap] = useState({});
    const [search, setSearch] = useState({ value: null });
    const { i18n, t } = useTranslation();
    const { user, token }  = useSelector(state => state.login);
    const dispatch = useDispatch();
    const fileInputRef = React.useRef(null);
    
    useEffect(() => {
        let data = [];
        if(selected){
            data.push({...selected, txnAmount: 0, txnType: 'C', descr: ''});
            setDetail(data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [selected]);

    useEffect(() => {
        setColumns([
            { accessor: 'custId', exLabel: t('Харилцагчийн код')},
            { accessor: 'custName', exLabel: t('customer.t_name')},
            { accessor: 'txnDate', exLabel: t('page.date'), Cell: ({ value }) => {return (<div>{value !== null ? moment(value)?.format('yyyy.MM.DD'): ''}</div>)}},  
            { accessor: 'arBalance', exLabel: t('customer.receivable_amt')},
            { accessor: 'txnAmount', exLabel: t('Авлага хаах дүн')},     
            { accessor: 'descr', exLabel: t('tax.note')},
        ]);
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n?.language]);
    
    useEffect(() => {
        getCustomers();
        getSites();
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);
    
    const getSites = async () => {
        setLoading(true);
        const response = await dispatch(getList(user, token, "Site/GetSite"));
        if (response?.error) setError(response?.error);
        else setSiteData(response?.data);
        setLoading(false);
    };

    const getCustomers = async () => {
        const headers = { CustID: -1 };
        const res = await dispatch(getList(user, token, 'Site/GetCustomer', null, headers));
        if (!res?.error && res?.data) {
            const map = {};
            res?.data?.customers?.forEach(c => {
                map[c.custId] = c;
            });
            setCustomerMap(map);
        }
    };

    const checkValid = () => {
         const invalidItems = detail.filter(
            item => !item?.siteID
            );
        if (invalidItems?.length > 0) {
            setError( 'Салбар' + t('error.not_empty'));
            return false;
        }
        if( detail?.length > 0 ){
            let data = [];
            detail?.forEach(item => {
                data.push({
                    siteID: item?.siteID,
                    custID: item?.custId,
                    txnDate: moment(item?.txnDate).format('YYYY.MM.DD'),
                    txnType: item?.txnType,
                    sign: item?.txnType === 'D' ? '1' : '-1',
                    salesDate: moment(item?.txnDate).format('YYYY.MM.DD'),
                    txnAmount: item?.txnAmount,
                    descr: item?.descr,
                })
            })
            return data;
        } else {
            if(detail?.length === 0) setError(t('error.not_empty'))
        }
    }

    const onClickSave = async e => {
        e?.preventDefault();
        let data =checkValid();
        if(data){
            setLoading(true);
            const response = await dispatch(sendRequest(user, token, 'Txn/AddCustomerTxn', data));
            if(response?.error) setError(response?.error);
            else {
                closeModal();
                message.success(t('login.success'));
                let custId = selected?.custId ?? selected?.custID;
                let query = `?BeginDate=${date[0]?.format('yyyy.MM.DD')}&EndDate=${date[1]?.format('yyyy.MM.DD')}&custId=${custId}`;
                onSearch(selected ? query : '' );
            }
            setLoading(false);
        } 
    }

    const onClickImport = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const workbook = XLSX.read(evt.target.result, { type: "binary" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

            const valid = [];
            const invalid = [];

            rows.forEach(r => {
                const custId = r["Харилцагчийн код"];
                if (!custId) return;
                const customer = customerMap[custId];
                if (customer) {
                    valid.push({
                        custId: customer?.custId,
                        custName: customer?.custName,
                        siteID: customer?.siteID,
                        txnDate: r["Огноо"] ? moment(r["Огноо"]).format("YYYY.MM.DD") : moment().format("YYYY.MM.DD"),
                        arBalance: customer?.arBalance,
                        txnAmount: Number(r["Авлага хаах дүн"]) || 0,
                        descr: r["Тайлбар"] ?? '',
                        txnType: 'C'
                    });
                } else {
                    invalid.push(custId);
                }
            });            
            setDetail(valid);
            if (invalid.length > 0) {
                message.warning(`Дараах кодтой харилцагч олдсонгүй: ${invalid.join(", ")}`);
            }
            message.success(`Импорт амжилттай (${valid.length})`);
        };
        reader.readAsBinaryString(file);
        e.target.value = "";
    };
    const excelWidth = [{ wpx: 120 }, { wpx: 300 }, { wpx: 70 }, { wpx: 120 }, { wpx: 120 }, { wpx: 120 } ];

    const custProps = {data: detail, setError, setData: setDetail, search, setSearch, siteData, disabled};
    const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit'};
    const importProps = {  className: 'ih_btn', text: t('page.import'), onClick: onClickImport};
    const exportProps = { text: t('EXCEL FORMAT'), columns: columns, excelData: data, fileName: t('customer.receivable_calc'), width: excelWidth};

    return (
        <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={1000}>
            <Overlay loading={loading}>
            <div className='m_back'>
                <div className='row_between'>
                    <ModalTitle icon='MdSupervisorAccount' title={t('customer.receivable_calc')} style={{marginBottom: 0}} isMD={true}/>
                    {!disabled && <div className='main_row_center'>
                        <Button {...importProps} />
                        <ExportExcelLink {... exportProps}/>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xls,.xlsx,.csv"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </div>}
                </div>
                <CustomerSelect {...custProps}/>
            {error && <Error1 error={error}/>}
            </div>
            <ButtonRow {...btnProps} /> 
            </Overlay>
        </Modal>
    )
   
}   

export function CustomerSelect(props){
    const { data, setData, setEdited, search, setSearch, label, siteData, disabled} = props;
    const { t, i18n } = useTranslation();
    const [columns, setColumns] = useState([]);
    const [types] = useState([{ label: 'Авлага хаах', value: "C" }, { label: 'Авлага нэмэх', value: "D" }]);
    const columnHelper = createColumnHelper();
        
  useEffect(() => {
    setColumns([
      columnHelper.accessor('delete', {
        id: 'delete-col',
        header: '',
        cell: ({ row, table }) => (
          <div className='ac_delete_back'>
            <DynamicBSIcon name='BsDashCircleFill' className='ac_delete' onClick={() => table?.options?.meta?.onClickDelete(row)} />
          </div>
        ),
        enableSorting: false, size: 40,
        meta: { style: { width: 40 } }
      }),
      columnHelper.accessor('custName', { header: t('customer.t_name'), exLabel: t('customer.t_name'), size: 150, }), 
      columnHelper.accessor('arBalance', { header: t('customer.receivable_amt'), exLabel: t('customer.receivable_amt'), size: 110,
        cell: cell => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={cell?.getValue()} /></div>,
      }), 
      columnHelper.accessor('txnDate', { header: t('page.date'), exLabel: t('page.date'), size: 80,
        cell: cell => <CellDate {...cell} />,
      }), 
      columnHelper.accessor('siteID', { header: t('pos.site'), exLabel: t('pos.site'), size: 170,
        cell: cell => <CellSelect {...cell} data={siteData} s_value='siteId' s_descr='name' placeholder={t('pos.site1')} width={170}/>,
        meta: { style: { width: 100, minWidth: 100 } } 
      }), 
      columnHelper.accessor('txnType', { header: t('report.type'), exLabel: t('report.type'), size: 100,
        cell: cell => <CellSelect {...cell} data={types} width={100}/>,
      }), 
      columnHelper.accessor('txnAmount', { header: t('customer.amount'), exLabel: t('customer.amount'), size: 100,
        cell: cell => <CellMoney {...cell} width={100} />,
        meta: { style: { width: 100, minWidth: 100 } } 
      }), 
      columnHelper.accessor('descr', { header: t('system.descr'), exLabel: t('system.descr'), size: 110,
        cell: cell => <CellInput {...cell} width={100}/>,
        meta: { style: { width: 80, minWidth: 80 } }
      }),
    ]);
    return () => {};
  }, [i18n?.language, siteData]);

  const updateData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        let txnDate = columnId === 'txnDate' ? value: old[rowIndex]?.txnDate;
        let txnType = columnId === 'txnType' ? value : old[rowIndex]?.txnType ?? 'C';
        let siteID = columnId === 'siteID' ? value : old[rowIndex]?.siteID;
        let txnAmount = columnId === 'txnAmount' ? value : old[rowIndex]?.txnAmount ?? 0;
        let descr = columnId === 'descr' ? value : old[rowIndex]?.descr;
        return { ...old[rowIndex], txnType ,txnDate, siteID, txnAmount, descr }; 
      } else {
        return row;
      }
    }));
    setEdited && setEdited(true);
    setSearch({ value: null });
  }

  const newItem = (items) => {    
    return {
      custName: items?.custName, custId: items?.custId, txnDate: items?.txnDate, siteID: items?.siteID, txnAmount: items?.txnAmount ?? 0,
      descr: items?.descr ?? '', txnType: "C", arBalance: items?.arBalance, salesDate: items?.salesDate
    };
  }

  const onClickDelete = row => {
    // if(row?.original?.custId !== 0) setDItems(old => [...old, row?.original]);
    setData(old => old?.filter(item => item?.custId !== row?.original?.custId));
    setSearch({ value: null });
  }

  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 7 - 200px)';
//   const defaultColumn = useMemo(() => ({ minWidth: 30, width: 150, maxWidth: 400 }), []);
  const tableInstance = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { updateMyData: updateData, newItem }
  });
  const tableProps = { tableInstance };
  const selectProps = { search, setSearch, data, setData, newItem , setEdited, disabled};

  return (
    <div style={{marginTop: 10}}>
      {label && <p className='title_select_lbl' style={{fontSize: 13, marginTop: 20, color: 'var(--tex1-color)', fontWeight: 500, borderBottom: '1px solid var(--line-color)'}}>{label}</p>}
      <div style={{overflow: 'scroll'}} >

        <div className='table_scroll' id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight, minWidth : 700}}>
          <TableRowResize {...tableProps} />
        </div>
      </div>
      <CustomerSelectItem {...selectProps}/>
    </div>
  )
}