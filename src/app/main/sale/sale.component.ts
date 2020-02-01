import { Component, OnInit } from "@angular/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";

import { locale as english } from "./i18n/en";
import { locale as thai } from "./i18n/th";

@Component({
  selector: "app-sale",
  templateUrl: "./sale.component.html",
  styleUrls: ["./sale.component.scss"]
})
export class SaleComponent implements OnInit {
  records: any = [];
  summary: any = [];
  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  ngOnInit(): void {}

  drop(ev) {
    ev.preventDefault();
    const files = ev.dataTransfer.files;
    console.log(files);

    if (this.isValidCSVFile(files[0])) {
      let reader = new FileReader();
      reader.readAsText(files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
        console.log(this.records);

        var result = [];
        this.records.reduce(function(res, value) {
          if (!res[value.itemCode]) {
            res[value.itemCode] = { itemCode: value.itemCode, itemName: value.itemName, itemQty: 0, itemSubtotal : 0 };
            result.push(res[value.itemCode]);
          }
          res[value.itemCode].itemQty += parseInt(value.itemQty);
          res[value.itemCode].itemSubtotal += parseInt(value.itemSubtotal)
          return res;
        }, {});

        this.summary = result;

        console.log(result);
      };

      reader.onerror = function() {
        console.log("error is occured while reading file!");
      };
    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split("	");
      if (curruntRecord.length == headerLength) {
        let csvRecord = {
          no: curruntRecord[0],
          createdAt: curruntRecord[1],
          status: curruntRecord[2],
          customerName: curruntRecord[3],
          customerPhone: curruntRecord[4],
          customerEmail: curruntRecord[5],
          customerAddress: curruntRecord[6],
          trackingNumber: curruntRecord[7],
          paymentProvider: curruntRecord[8],
          accountNo: curruntRecord[9],
          accountName: curruntRecord[10],
          shippingOption: curruntRecord[11],
          shippingCost: curruntRecord[12],
          subtotal: curruntRecord[13],
          discount: curruntRecord[14],
          total: curruntRecord[15],
          paidAt: curruntRecord[16],
          paidAmount: curruntRecord[17],
          note: curruntRecord[18],
          itemCode: curruntRecord[19],
          variantName: curruntRecord[20],
          itemName: curruntRecord[21],
          itemQty: curruntRecord[22],
          itemPrice: curruntRecord[23],
          itemSubtotal: curruntRecord[24],
          itemNote: curruntRecord[25]
        };
        csvArr.push(csvRecord);
        //console.log(curruntRecord[0]);
      }
    }
    return csvArr;
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split("	");
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.records = [];
  }
}
