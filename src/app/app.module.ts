import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { SPServicio } from './servicios/sp-servicio';
import { MatRadioModule, MatFormFieldModule, MatAutocompleteModule, MatOptionModule, MatInputModule, MatTableModule, MatListModule, MatToolbarModule, MatPaginatorModule, MatExpansionModule, MatDialogModule, MatSelectModule, MatCheckboxModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    MatRadioModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatInputModule,
    MatTableModule,
    MatListModule,
    MatToolbarModule, 
    MatPaginatorModule, 
    MatExpansionModule, 
    MatDialogModule, 
    MatSelectModule, 
    MatCheckboxModule
  ],
  providers: [SPServicio],
  bootstrap: [AppComponent]
})
export class AppModule { }
