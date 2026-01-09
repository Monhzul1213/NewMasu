import React from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { Button } from "./Button";

export function ExportExcel(props){
  const { excelData, columns, excelName, text, width } = props;
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

const exportToExcel = () => {

  // 1. Header row
  const header = columns
    ?.filter(c => c.exLabel)
    .map(c => c.exLabel);

  // 2. Body rows
  const body = excelData?.map(item =>
    columns
      ?.filter(c => c.exLabel)
      .map(col => {
        const keys = col.accessorKey?.split('.');
        return keys?.length === 2
          ? item?.[keys[0]]?.[keys[1]]
          : item?.[col.accessorKey];
      })
  );

  // 3. Sheet data
  const sheetData = [header, ...body];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // column width
  ws['!cols'] = width;

  // 4. Header style (зарим Excel дээр л харагдана)
  header.forEach((_, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
    ws[cellAddress].s = {
      font: { bold: true },
      alignment: { horizontal: "center" }
    };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "data");

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
    cellStyles: true
  });

  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, excelName + fileExtension);
};


  return (<Button className='ih_btn' text={text} onClick={exportToExcel} />);
}