import { Component, OnInit } from "@angular/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";

import { locale as english } from "./i18n/en";
import { locale as thai } from "./i18n/th";
import { OchaService } from "./ocha.service";
import { O_DIRECT } from "constants";
import { SaleService } from "../sale/sale.service";

@Component({
  selector: "app-ochainterface",
  templateUrl: "./ochainterface.component.html",
  styleUrls: ["./ochainterface.component.scss"]
})
export class OchainterfaceComponent implements OnInit {
  start_time: any = 1580490000;
  end_time: any = 1582995599;

  shop_orders: Array<any> = [];
  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private ocha: OchaService,
    private saleService: SaleService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  async ngOnInit(): Promise<void> {
    const res = await this.getData();
    if (res.error) {
      console.log(res.error);
      return;
    }
    this.shop_orders = res.data;
  }

  async getData() {
    try {
      let orders: Array<any> = [];
      // 1. อ่านข้อมูลหน้าร้านทั้งหมดจาก ocha owner account
      const shops: Array<any> = await this.ocha.getShopList();
      for (var i = 0; i < shops.length; i++) {
        let shop = shops[i];
        // 2. Auth เข้าทีละร้านเพื่ออ่าน  Set-Cookie ใน Response Header
        let cookie = await this.ocha.getSetCookieByShop(shops[i].shop_id);

        // 3. อ่านข้อมูล Orders แต่ละร้านค้าจาก cookies param
        let payload = {
          posocha: cookie.posocha,
          filter: { start_time: this.start_time, end_time: this.end_time },
          pagination: {
            page_size: 15,
            pagination_result_count: 100,
            page_begin: null
          }
        };
        let res = await this.ocha.getShopOrderByDate(payload);

        // 4. ปั้นข้อมูลของแต่ละร้าน เพื่อแสดงผล และนำไป importData
        let order = {
          shopId: shop.shop_id,
          shopName: shop.profile.shop_name,
          orders: res
        };

        orders.push(order);
      }
      return { error: null, data: orders };
    } catch (error) {
      // throw new Error(error.message);
      return { error: error.message };
    }
  }

  async importData() {
    try {
      let orders: Array<any> = [];
      let results = 0;
      this.shop_orders.forEach(shop => {
        shop.orders.forEach(order => {
          order.shopId = shop.shopId;
          order.shopName = shop.shopName;
          orders.push(order);
        });
      });

      while (orders.length) {
        const payLoad = orders.splice(0, 50);
        const res: Array<any> = await this.saleService.importData(payLoad);
        results += res.length;
      }
      return { error: null, data: results };
    } catch (error) {
      return { error: error.message };
    }
  }

  async confirmImportClick() {
    const res = await this.importData();
    if (res.error) {
      console.log(res.error);
      return;
    }
    alert("Import successfully :" + res.data);
  }

  async cancelImportClick() {
    this.shop_orders = [];
    const res = await this.getData();
  }
}
