import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SalesByCategoryAndCustomerTabularComponent } from './sales-by-category-and-customer-tabular.component';

describe('SalesByCategoryAndCustomerComponent', () => {
  let component: SalesByCategoryAndCustomerTabularComponent;
  let fixture: ComponentFixture<SalesByCategoryAndCustomerTabularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SalesByCategoryAndCustomerTabularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByCategoryAndCustomerTabularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Sales by Category and Customer - Tabular"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Sales by Category and Customer - Tabular');
  });

  it('should initialize the salesByCategoryAndCustomerTabularForm with a null value', () => {
    const regionControl = component.salesByCategoryAndCustomerTabularForm.controls['category'];
    expect(regionControl.value).toBeNull();
    expect(regionControl.valid).toBeFalse();
  });

  it('should initialize the salesByCategoryAndCustomerTabularForm with a null value', () => {
    const regionControl = component.salesByCategoryAndCustomerTabularForm.controls['customer'];
    expect(regionControl.value).toBeNull();
    expect(regionControl.valid).toBeFalse();
  });

  it('should not submit the form if no category and customer selected', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.form__actions button');
    submitButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.salesByCategoryAndCustomerTabularForm.valid).toBeFalse();
  });
});
