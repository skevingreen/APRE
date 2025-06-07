// task M-072 - SKG June 6, 2025
// add component to get and display sales data for a given category and customer

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sales-by-category-and-customer',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent],
  template: `
    <h1>Sales by Category and Customer - Tabular</h1>
    <div class="sales-container">
      <!-- form for category and customer selection -->
      <form class="form" [formGroup]="salesByCategoryAndCustomerTabularForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label for="category">Select Category</label>
          <select class="select" formControlName="category" id="category" name="category" request>
            <!-- option value="" disabled selected>Select a Category</option -->
            <option value="Accessories">Accessories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Wearables">Wearables</option>
          </select>
        </div>

        <div class="form__group">
          <label for="category">Select Customer</label>
          <select class="select" formControlName="customer" id="customer" name="customer" request>
            <!-- option value="" disabled selected>Select a customer</option -->
            <option value="Acme Corp">Acme Corp</option>
            <option value="Beta LLC">Beta LLC</option>
            <option value="Chi Co">Chi Co</option>
            <option value="Delta Co">Delta Co</option>
            <option value="Epsilon Ltd">Epsilon Ltd</option>
            <option value="Eta Solutions">Eta Solutions</option>
            <option value="Gamma Inc">Gamma Inc</option>
            <option value="Iota Industries">Iota Industries</option>
            <option value="Kappa Corp">Kappa Corp</option>
            <option value="Lambda LLC">Lambda LLC</option>
            <option value="Mu Inc">Mu Inc</option>
            <option value="Nu Co">Nu Co</option>
            <option value="Omicron Enterprises">Omicron Enterprises</option>
            <option value="Phi Inc">Phi Inc</option>
            <option value="Pi Solutions">Pi Solutions</option>
            <option value="Rho Services">Rho Services</option>
            <option value="Sigma Industries">Sigma Industries</option>
            <option value="Tau Corp">Tau Corp</option>
            <option value="Theta Services">Theta Services</option>
            <option value="Upsilon LLC">Upsilon LLC</option>
            <option value="Xi Ltd">Xi Ltd</option>
            <option value="Zeta Enterprises">Zeta Enterprises</option>
          </select>
        </div>

        <div class="form__actions">
          <button type="submit" class="button button--primary">Get Data</button>
        </div>
      </form>

      <!-- div to display the data -->
      @if (salesData.length > 0) {
        <div class="card chart-card">
          <app-table
            [title]="'Sales for ' + selectedCategory + ' ' + selectedCustomer"
            [data]="salesData"
            [headers]="['region', 'product', 'salesperson', 'channel', 'amount']"
          >
          </app-table>
        </div>
      }
    </div>
  `,
  styles: `
    .sales-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .form, .chart-card {
      width: 50%;
      margin: 20px 0;
      padding: 10px;
    }

    app-table {
      padding: 50px;
    }
  `
})
export class SalesByCategoryAndCustomerTabularComponent {
  salesData: any[] = [];            // array to hold the data returned by the API call

  get selectedCategory(): string {  // getter to return the selected category if truthy or empty string otherwise
    const category = this.salesByCategoryAndCustomerTabularForm.controls['category'].value;
    return category ? category : '';
  }

  get selectedCustomer(): string {  // getter to return the selected customer if truthy or empty string otherwise
    const customer = this.salesByCategoryAndCustomerTabularForm.controls['customer'].value;
    return customer ? customer : '';
  }

  salesByCategoryAndCustomerTabularForm = this.fb.group({ // form for selecting category and customer
    category: [null, Validators.required],
    customer: [null, Validators.required]
  })

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  onSubmit() {                      // call the api to get sales results limited by the provided category and customer
    this.http.get(`${environment.apiBaseUrl}/reports/sales/sales-by-category-and-customer-tabular?category=${this.selectedCategory}&customer=${this.selectedCustomer}`).subscribe({
      next: (data) => {
        this.salesData = data as any[]; // populate salesData with the results
      },
      error: (err) => {
        console.error('Error fetching data from server: ', err);  // log error
      }
    })
  };
}
