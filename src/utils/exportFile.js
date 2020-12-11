import FileSaver from 'file-saver';
import XLSX from 'xlsx';

/**
 * 
 * @param {Number} length 表头的数组长度
 * @param {String} name 表格名称
 * @param {String|undefined} id 要导出的表格的id，默认out-table
 */
export default function exportFile(length, name, id) {
  /* generate workbook object from table */
  // 没有值的时候就赋值
  const oTable = document.getElementById(id || 'out-table');
  const wb = XLSX.utils.table_to_book(oTable, {
    skipHeader: true,
    dateNF: 'yyyy-MM-dd hh:mm:ss',
  });
  const sheet = wb.Sheets.Sheet1;
  if (!sheet['!cols']) sheet['!cols'] = [];
  let i = 0;
  while(i < length) {
    if (i == 0) {
      sheet['!cols'][i] = { wch: 5 };
    } else {
      sheet['!cols'][i] = { wch: 20 };
    }
    i ++;
  }
  // this.sheet_to_formulae(sheet);
  /* get binary string as output */
  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array',
  });
  try {
    FileSaver.saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      `${name}.xlsx`,
    );
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e);
  }
}