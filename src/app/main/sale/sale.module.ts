import { NgModule } from '@angular/core';
import { SaleComponent } from './sale.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';
import { MatIconModule, MatMenuModule } from '@angular/material';

const routes = [
  {
      path     : '**',
      component: SaleComponent,
      // canActivate: [AuthenGuardService]
  }
];

@NgModule({
  declarations: [SaleComponent],
  imports: [
    RouterModule.forChild(routes),

    TranslateModule,

    MatIconModule,
    MatMenuModule,

    FuseSharedModule
  ],
  exports: [
    SaleComponent
  ]
})
export class SaleModule { }
