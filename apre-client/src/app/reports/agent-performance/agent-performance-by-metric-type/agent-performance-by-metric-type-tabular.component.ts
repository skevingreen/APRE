// task M-088 - SKG June 13, 2025
// add component to get and display agent metrics for a selected metric type

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableComponent } from './../../../shared/table/table.component';

@Component({
  selector: 'app-agent-performance-by-metric-type-tabular',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent],
  template: `
    <h1>Agent Performance by Metric Type - Tabular</h1>
    <div class="metrics-container">
      <!-- form for metric type selection -->
      <form class="form" [formGroup]="agentPerformanceByMetricTabularForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label for="metricType">Select Metric Type</label>
          <select class="select" formControlName="metricType" id="metricType" name="metricType" request>
            <option value="Customer Satisfaction">Customer Satisfaction</option>
            <option value="Sales Conversion">Sales Conversion</option>
          </select>
        </div>

        <div class="form__actions">
          <button type="submit" class="button button--primary">Get Data</button>
        </div>
      </form>

      <!-- div to display the data -->
      @if (performanceData.length > 0) {
        <div class="card chart-card">
          <app-table
            [title]="'Agent Performance for ' + selectedMetricType"
            [data]="performanceData"
            [headers]="['agentId', 'value', 'region', 'team']"
            [sortableColumns]="['agentId', 'value', 'region', 'team']"
            [headerBackground]="'secondary'"
          >
          </app-table>
        </div>
      }
    </div>
  `,
  styles: `
    .metrics-container {
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
export class AgentPerformanceByMetricTypeTabularComponent {
  performanceData: any[] = [];        // array to hold the data returned from the API call

  get selectedMetricType(): string {  // getter to return the selected metric type if truthy or empty string otherwise
    const metricType = this.agentPerformanceByMetricTabularForm.controls['metricType'].value;
    return metricType ? metricType : '';
  }

  agentPerformanceByMetricTabularForm = this.fb.group({
    metricType: [null, Validators.required]
  })

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  onSubmit() {                                // call the api to get agent performance by selected metric type
    this.http.get(`${environment.apiBaseUrl}/reports/agent-performance/agent-performance-by-metric-type-tabular?metricType=${this.selectedMetricType}`).subscribe({
      next: (data) => {
        this.performanceData = data as any[]; // populate performanceData with the results
        //console.log("performanceData.value: " + this.performanceData.value);
      },
      error: (err) => {
        console.error('Error fetching data from server: ', err);  // log error
      }
    })
  };
}
