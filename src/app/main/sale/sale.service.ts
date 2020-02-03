import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import * as XLSX from "xlsx";
import { environment } from 'environments/environment';

@Injectable({
  providedIn: "root"
})
export class SaleService {
  constructor(private http: HttpClient) {}

  csvReader(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let records: Array<any>;
      let reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);
        records = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow
        );
        resolve(records);
      };

      reader.onerror = function() {
        console.log("error is occured while reading file!");
        reject();
      };
    });
  }

  private getDataRecordsArrayFromCSVFile(
    csvRecordsArray: any,
    headersRow: any
  ) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split("	");
      if (curruntRecord.length == headersRow.length) {
        var csvRecord = {};
        var idx = 0;
        headersRow.forEach(function(key) {
          csvRecord[
            key
              .replace(key[0], key[0].toString().toLowerCase())
              .replace(" ", "")
              .replace(".", "")
          ] = curruntRecord[idx];
          idx++;
        });
        // console.log(csvRecord);
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  private getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split("	");
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  xlsxReader(file: any): Promise<any> {
    let json: any;
    let result: Array<any> = [];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
      try {
        reader.onload = (event: any) => {
          const oReq = new XMLHttpRequest();
          oReq.open("GET", event.target.result, true);
          oReq.responseType = "arraybuffer";

          oReq.onload = async e => {
            const arraybuffer = oReq.response;
            /* convert data to binary string */
            const data = new Uint8Array(arraybuffer);
            const arr = new Array();
            for (let i = 0; i !== data.length; ++i) {
              arr[i] = String.fromCharCode(data[i]);
            }
            const bstr = arr.join("");
            const workbook = XLSX.read(bstr, { type: "binary" });

            json = XLSX.utils.sheet_to_json(
              workbook.Sheets[workbook.SheetNames[0]]
            );
            // console.log(json);
            let transDate = `${json[0]["__EMPTY_2"].split("-")[2]}-${json[0]["__EMPTY_2"].split("-")[1]}-${json[0]["__EMPTY_2"].split("-")[0]}`;
            let posDebt = json[2]["__EMPTY_2"];
            for (let index = 0; index < json.length; index++) {
              const row = json[index];
              if (
                JSON.stringify(row).includes("ลำดับ") &&
                JSON.stringify(row).includes("ชื่อสินค้า") &&
                JSON.stringify(row).includes("จำนวน") &&
                JSON.stringify(row).includes("น้ำหนัก") &&
                JSON.stringify(row).includes("ยอดขาย")
              ) {
                let jsonData = XLSX.utils.sheet_to_json(
                  workbook.Sheets[workbook.SheetNames[0]],
                  { range: row.__rowNum__ }
                );
                // result = jsonData;
                // console.log(jsonData);
                let prodName = "";
                let idx = 1;
                jsonData.forEach(item => {
                  // console.log(item);
                  if (typeof item["ลำดับ"] === "number") {
                    // console.log(item["ลำดับ"]);
                    prodName = item["ชื่อสินค้า"];
                  } else if (item["ลำดับ"] === "") {
                    result.push({
                      no: idx,
                      createdAt: transDate,
                      status: "shipped",
                      customerName: posDebt,
                      // customerPhone: "086-7939115",
                      // customerEmail: "",
                      // customerAddress:
                      //   "55/185 หมู่บ้านพลีโน่ สุขสวัสดิ์ 66 ถนนสุขสวัสดิ์ ตำบลบางครุ อำเถอพระประแดง จังหวัดสมุทรปราการ 10130",
                      // trackingNumber: "TH02044QQSD1D/TH21014QQHM9B",
                      paymentProvider: "cash",
                      // accountNo: "063-0-339919",
                      // accountName: "ธรรมธุรกิจ วิสาหกิจเพื่อสังคม",
                      // shippingOption: "",
                      // shippingCost: "240.0",
                      subtotal: item["ยอดขาย"],
                      // discount: "200.0",
                      total: item["ยอดขาย"],
                      paidAt: transDate,
                      paidAmount: item["ยอดขาย"],
                      note: "",
                      itemCode: `${prodName}${item["ชื่อสินค้า"]}`,
                      variantName: item["ชื่อสินค้า"].replace(" - ",""),
                      itemName: `${prodName}${item["ชื่อสินค้า"]}`.replace("- ราคาที่กำหนดเอง 1",""),
                      itemQty: item["จำนวน"],
                      itemPrice:
                        parseInt(item["ยอดขาย"]) / parseInt(item["จำนวน"]),
                      itemSubtotal: item["ยอดขาย"],
                      itemNote: ""
                    });
                    idx++;
                  }
                });
                // for (let i = 1; i < jsonData.length; i++) {
                //   console.log(jsonData[index]);
                //   const item = jsonData[index];
                //   // if (item["ลำดับ"] === "") {

                //   // }

                // }
                break;
              }
            }

            resolve(result);
          };
          oReq.send();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  importData(data: any): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/api/import/sales`, data).subscribe((res: any) => {
        // console.log(res);
        resolve(res.data);
      }, reject);
    });

  }
}
