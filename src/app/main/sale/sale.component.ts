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
  fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  records: any = [];
  fileDescription:any = {};

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private saleService: SaleService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  ngOnInit(): void {}

  detectFiles(ev) {
    const files = ev.target.files;
    console.log(files);
    this.validateFile(files);
  }
  drop(ev) {
    ev.preventDefault();
    const files = ev.dataTransfer.files;
    console.log(files);
    this.validateFile(files);
  }

  validateFile(files){
    if (this.isValidCSVFile(files[0])) {
      this.saleService.csvReader(files[0]).then((data: any) => {
        // console.log(data);
        this.fileDescription.sourceType = "Page365";
        this.fileDescription.fileInfo = files[0];
        this.records = data;
        
      });
    } else if (this.isValidXLSXFile(files[0])) {
      this.saleService.xlsxReader(files[0]).then((data: any) => {
        // console.log(data);
        this.fileDescription.sourceType = "Ocha";
        this.fileDescription.fileInfo = files[0];
        this.records = data;
        
      });
    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  confirmImportClick(){
    this.importData(this.records);
  }

  importData(data){
    while (data.length) {
      const payLoad = data.splice(0, 100);
      this.saleService.importData(payLoad).then((res: any) => {
        console.log(res);
      });
    }
  }

  cancelImportClick(){
    this.records=[];
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
