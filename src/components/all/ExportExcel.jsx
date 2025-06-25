import React from "react";
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';

import { Button } from "./Button";

export function ExportExcel(props){
  const { className, text, excelData, excelName, columns } = props;
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    let excelData1 = excelData?.map(item => {
      let newItem = {};
      columns?.forEach(col => { if(col?.exLabel) newItem[col.exLabel] = item[col.accessorKey] });
      return newItem;
    });
    const ws = XLSX.utils.json_to_sheet(excelData1);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] } ;
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, excelName + fileExtension);
  }

  return (<Button className={className ?? 'ih_btn'} text={text} onClick={exportToExcel} />);
}

export function InventoryExcel(props){
  const { excelData, columns, excelName, text, width } = props;
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    let excelData1 = excelData?.map(item => {
      let newItem = {};
      columns?.forEach(col => {
        if(col?.exLabel){
          let accessorKey = col.accessorKey?.split('.');
          newItem[col.exLabel] = item[accessorKey[0]][accessorKey[1]];
        }
      });
      return newItem;
    });
    const ws = XLSX.utils.json_to_sheet(excelData1);
    ws['!cols'] = width;
    ws["A1"].s = { font: { sz: '14', bold: true }};
    ws["B1"].s = { font: { sz: '14', bold: true }};
    ws["C1"].s = { font: { sz: '14', bold: true }};
    ws["D1"].s = { font: { sz: '14', bold: true }};
    ws["E1"].s = { font: { sz: '14', bold: true }};
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] } ;
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, excelName + fileExtension);
  }

  return (<Button className='ih_btn' text={text} onClick={exportToExcel} />);
}