import { NgModule } from '@angular/core';
import { OchainterfaceComponent } from './ochainterface.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';
import {MatTabsModule, MatExpansionModule} from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const routes = [
  {
      path     : '**',
      component: OchainterfaceComponent,
      // canActivate: [AuthenGuardService]
  }
];

@NgModule({
  declarations: [OchainterfaceComponent],
  imports: [
    RouterModule.forChild(routes),

    TranslateModule,

    FuseSharedModule,

    //Swimlane NgxDatatableModule
    NgxDatatableModule,

    MatTabsModule,
    MatExpansionModule
  ],
  exports: [
    OchainterfaceComponent
  ]
})
export class OchainterfaceModule { }
