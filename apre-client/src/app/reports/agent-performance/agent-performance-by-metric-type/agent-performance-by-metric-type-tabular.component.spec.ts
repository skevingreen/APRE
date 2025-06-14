import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AgentPerformanceByMetricTypeTabularComponent } from './agent-performance-by-metric-type-tabular.component';

describe('AgentPerformanceByMetricTypeTabularComponent', () => {
  let component: AgentPerformanceByMetricTypeTabularComponent;
  let fixture: ComponentFixture<AgentPerformanceByMetricTypeTabularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentPerformanceByMetricTypeTabularComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentPerformanceByMetricTypeTabularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Agent Performance by Metric Type - Tabular"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Agent Performance by Metric Type - Tabular');
  });

  it('should initialize the agentPerformanceByMetricTabularForm with a null value', () => {
    const regionControl = component.agentPerformanceByMetricTabularForm.controls['metricType'];
    expect(regionControl.value).toBeNull();
    expect(regionControl.valid).toBeFalse();
  });

  it('should not submit the form if no metric type is selected', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.form__actions button');
    submitButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.agentPerformanceByMetricTabularForm.valid).toBeFalse();
  });
});
