import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartComponent } from '../../../shared/chart/chart.component';

@Component({
  selector: 'app-sales-by-region',
  standalone: true,
  imports: [ReactiveFormsModule, ChartComponent],
  template: `
    <h1>Sales by Region</h1>
    <div class="region-container">
      <form class="form" [formGroup]="regionForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label class="label" for="region">Region</label>
          <!-- m-020 1 of 4: add the "required" attribute to the select element - SKG June 10, 2025 -->
          <select required class="select" formControlName="region" id="region" name="region">
            <!-- m-020 2 of 4: add a disabled option with an empty string value to display placeholder
                   text as demonstrated by Professor Krasso - SKG June 10, 2025 -->
            <option value="" disabled>Select region</option>
            @for(region of regions; track region) {
              <option value="{{ region }}">{{ region }}</option>
            }
          </select>
        </div>
        <div class="form__actions">
          <button class="button button--primary" type="submit">Submit</button>
        </div>
      </form>

      @if (totalSales.length && salesPeople.length) {
        <div class="card chart-card">
          <app-chart
            [type]="'bar'"
            [label]="'Sales by Region'"
            [data]="totalSales"
            [labels]="salesPeople">
          </app-chart>
        </div>
      }
    </div>
  `,
  styles: [`
    .region-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .form, .chart-card {
      width: 50%;
      margin: 20px 0;
    }

    /* m-020 3 of 4: the placeholder option will be invalid since it is disabled; make it gray
         to distinguish from valid options and to match other placeholders - SKG June 10, 2025 */
    select:invalid {
      color: gray;
    }
  `]
})
export class SalesByRegionComponent implements AfterViewInit {
  totalSales: number[] = [];
  salesPeople: string[] = [];
  regions: string[] = [];

  /*  m-020 4 of 4: change the default value of region from null to '' so that instead of
        being blank, the text for the placeholder option will be selected and displayed - SKG June 10, 2025 */
  regionForm = this.fb.group({
    region: ['', Validators.compose([Validators.required])]
  });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.http.get(`${environment.apiBaseUrl}/reports/sales/regions`).subscribe({
      next: (data: any) => {
        this.regions = data;
      },
      error: (err) => {
        console.error('Error fetching regions:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    // No need to create chart here, it will be handled by ChartComponent
  }

  onSubmit() {
    const region = this.regionForm.controls['region'].value;
    this.http.get(`${environment.apiBaseUrl}/reports/sales/regions/${region}`).subscribe({
      next: (data: any) => {
        this.totalSales = data.map((s: any) => s.totalSales);
        this.salesPeople = data.map((s: any) => s.salesperson);

        console.log('totalSales', this.totalSales);
        console.log('salesPeople', this.salesPeople);

        // Trigger change detection
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching sales data:', err);
      }
    });
  }
}