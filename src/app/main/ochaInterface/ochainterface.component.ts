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
    await this.getData();
  }

  async getData() {
    this.ocha.getShopList().then(async (shops: Array<any>) => {
      for (var i = 0; i < shops.length; i++) {
        let shop = shops[i];
        let cookie = await this.ocha.getSetCookieByShop(shops[i].shop_id);
        // console.log(cookie.posocha);
        let payload = {
          posocha: cookie.posocha,
          filter: { start_time: this.start_time, end_time: this.end_time },
          pagination: {
            page_size: 15,
            pagination_result_count: 100,
            page_begin: null
          }
        };
        // console.log(payload);

        let res = await this.ocha.getShopOrderByDate(payload);
        let order = {
          shopId: shop.shop_id,
          shopName: shop.profile.shop_name,
          orders: res
        };

        this.shop_orders.push(order);
        console.log(JSON.stringify(this.shop_orders));
      }
    });
  }

  confirmImportClick() {
    let orders : Array<any> = [];
    this.shop_orders.forEach(shop => {
      // this.saleService.importData(shop);
      shop.orders.forEach(order => {
        order.shopId = shop.shopId;
        order.shopName = shop.shopName;
        orders.push(order)
      });
    });
    console.log(JSON.stringify(orders));
    while (orders.length) {
      const payLoad = orders.splice(0, 50);
      this.saleService.importData(payLoad).then((res: any) => {
        console.log(res);
      });
    }
  }
}
