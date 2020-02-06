import { NgModule } from '@angular/core';
import { SaleComponent } from './sale.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FuseConfirmDialogModule } from '@fuse/components';

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

    //Swimlane NgxDatatableModule
    NgxDatatableModule,

    FuseSharedModule,
    FuseConfirmDialogModule
  ],
  exports: [
    SaleComponent
  ]
})
export class SaleModule { }
