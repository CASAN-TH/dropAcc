import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root"
})
export class OchaService {
  constructor(private http: HttpClient) {}

  getShopList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiUrl}/api/interface/ocha/shops`, null)
        .subscribe((res: any) => {
          resolve(res);
        }, reject);
    });
  }

  getSetCookieByShop(shopId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiUrl}/api/interface/ocha/shops/selected`, {
          branch_shop_id: shopId
        })
        .subscribe((res: any) => resolve(res), reject);
    });
  }

  getShopOrderByDate(payload:any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/api/interface/ocha`,payload)
      .subscribe((res: any) => resolve(res), reject);
    })
  }
}
