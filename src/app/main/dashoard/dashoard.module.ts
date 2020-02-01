import { NgModule } from '@angular/core';
import { DashoardComponent } from './dashoard.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';

const routes = [
  {
      path     : 'dashboard',
      component: DashoardComponent
  }
];

@NgModule({
  declarations: [DashoardComponent],
  imports: [
    RouterModule.forChild(routes),

    TranslateModule,

    FuseSharedModule
  ],
  exports: [
    DashoardComponent
  ]
})
export class DashoardModule { }
