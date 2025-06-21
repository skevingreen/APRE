// task M-106 - SKG June 18, 2025
// add component to get and display feedback by selected product type

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { TableComponent } from '../../../shared/table/table.component';

@Component({
  selector: 'app-feedback-by-product-tabular',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent],
  template: `
    <h1>Customer Feedback by Product - Tabular</h1>
    <div class="feedback-container">
      <!-- form for choosing product to report feedback by - SKG - task M-106 - June 21, 2025 -->
      <form class="form" [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label for="product">Select Product</label>
          <select class="select" formControlName="product" id="product" name="product" required>
            @for (product of products; track product) {
              <option value="{{ product }}">{{ product }}</option>
            }
          </select>
        </div>

        <div class="form__actions">
          <button type="submit" class="button button--primary">Generate Report</button>
        </div>
      </form>

      <!-- table to display results of query - SKG - task M-106 - June 21, 2025 -->
      @if (feedbackByProductData.length > 0) {
        <div class="card chart-card">
          <app-table [title]="'Feedback by Product Data'"
            [data]="feedbackByProductData"
            [headers]="['region', 'category', 'channel', 'salesperson', 'customer', 'feedbackType', 'feedbackText', 'feedbackSource', 'feedbackStatus']"
            [sortableColumns]="['region', 'category', 'channel', 'salesperson', 'customer', 'feedbackType', 'feedbackText', 'feedbackSource', 'feedbackStatus']"
          >
          </app-table>
        </div>
      }
    </div>
  `,
  styles: `
    /* basic styling for the form and table */
    .feedback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .form, .chart-card {
      width: 80%;
      margin: 20px 0;
      padding: 10px;
    }

    app-table {
      padding: 50px;
    }
  `
})
export class FeedbackByProductTabularComponent implements OnInit {
  products: any = [];               // variable to hold the list of distinct products - SKG - task M-106 - June 21, 2025
  feedbackByProductData: any = [];  // variable to hold the data returned from onSubmit() - SKG - task M-106 - June 21, 2025

  productForm = this.fb.group({     // the main form group for this component  - SKG - task M-106 - June 21, 2025
    product: [null, Validators.required ]
  });

  // get a list of products to choose from - SKG - task M-106 - June 21, 2025
  constructor (private http: HttpClient, private fb: FormBuilder) {
      this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/products`).subscribe({
      next: (data: any) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  ngOnInit(): void {
    // not implemented - SKG - task M-106 - June 21, 2025
  }

  // retrieve the data for the report based on selected product type - SKG - task M-106 - June 21, 2025
  onSubmit() {
    const product = this.productForm.controls['product'].value;

    this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/customer-feedback-by-product?product=${product}`).subscribe({
      next: (data) => {
        this.feedbackByProductData = data;
      },
      error: err => {
        console.error('An error occurred while calling the customer feedback by product API', err);
      }
    });
  }
}
