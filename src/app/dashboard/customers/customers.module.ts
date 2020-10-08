import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddCustomerPopupComponent } from './add-customer-popup/add-customer-popup.component';


@NgModule({
  declarations: [
    AddComponent,
    ListComponent,
    EditComponent,
    AddCustomerPopupComponent,
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
  ],
  exports: [
    AddComponent,
    AddCustomerPopupComponent,
  ],
  entryComponents: [
    AddCustomerPopupComponent,
  ]
})
export class CustomersModule { }
