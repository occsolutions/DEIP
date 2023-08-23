
import * as XLSX from 'xlsx'

export default (data: any, sheetname: string, fileName: string, isObjRows: boolean) => {
  // Calculate max width for all columns
  const objectMaxLength: any = []
  for (const value of data) {
    if (isObjRows) {
      const headers: any = []
      const cols: any = []
      for (const header of Object.keys(value)) {
        const col = value[header]
        headers.push(header)
        cols.push(col)
      }

      // Loop headers row
      for (let i = 0; i < headers.length; i++) {
        objectMaxLength[i] = objectMaxLength[i] >= headers[i].length ? objectMaxLength[i] : headers[i].length
      }
      // Loop data rows
      for (let j = 0; j < cols.length; j++) {
        if (cols[j] && typeof cols[j] !== 'number') {
          objectMaxLength[j] = objectMaxLength[j] >= cols[j].length ? objectMaxLength[j] : cols[j].length
        }
      }
    } else {
      for (let j = 0; j < value.length; j++) {
        if (typeof value[j] === 'number') {
          objectMaxLength[j] = 10
        } else {
          objectMaxLength[j] = objectMaxLength[j] >= value[j].length ? objectMaxLength[j] : value[j].length
        }
      }
    }
  }

  const wscols: any = []
  for (const width of objectMaxLength) {
    wscols.push({ width: width })
  }

  // Generate file
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { skipHeader: false })
  ws['!cols'] = wscols
  const wb: XLSX.WorkBook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetname)

  XLSX.writeFile(wb, fileName)
}
