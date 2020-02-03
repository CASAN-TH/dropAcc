import { Component, OnInit } from "@angular/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";

import { locale as english } from "./i18n/en";
import { locale as thai } from "./i18n/th";
import { SaleService } from "./sale.service";

@Component({
  selector: "app-sale",
  templateUrl: "./sale.component.html",
  styleUrls: ["./sale.component.scss"]
})
export class SaleComponent implements OnInit {
  fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  records: any = [];
  summary: any = [];
  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private saleService: SaleService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  ngOnInit(): void {}

  async drop(ev) {
    ev.preventDefault();
    const files = ev.dataTransfer.files;
    console.log(files);

    if (this.isValidCSVFile(files[0])) {
      this.saleService.csvReader(files[0]).then((data: any) => {
        this.records = data;
        this.summary = this.summaryData(data);
      });
    } else if(this.isValidXLSXFile(files[0])) {
      this.saleService.xlsxReader(files[0]).then((data: any) => {
        console.log(data);
        this.records = data;
        this.summary = this.summaryData(data);
      })
    }else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  summaryData(data) {
    var result = [];
    data.reduce(function(res, value) {
      if (!res[value.itemCode]) {
        res[value.itemCode] = {
          itemCode: value.itemCode,
          itemName: value.itemName,
          itemQty: 0,
          itemSubtotal: 0
        };
        result.push(res[value.itemCode]);
      }
      res[value.itemCode].itemQty += parseInt(value.itemQty);
      res[value.itemCode].itemSubtotal += parseInt(value.itemSubtotal);
      return res;
    }, {});
    return result;
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  isValidXLSXFile(file: any) {
    if (file.type === this.fileType) {
      return true;
    } else {
      return false;
    }
  }

  fileReset() {
    this.records = [];
  }
}
