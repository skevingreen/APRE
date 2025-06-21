// task M-106 - SKG June 18, 2025
// test component that gets and displays feedback by selected product type

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FeedbackByProductTabularComponent } from './feedback-by-product-tabular.component';

describe('FeedbackByProductTabularComponent', () => {
  let component: FeedbackByProductTabularComponent;
  let fixture: ComponentFixture<FeedbackByProductTabularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FeedbackByProductTabularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackByProductTabularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Customer Feedback by Product - Tabular"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Customer Feedback by Product - Tabular');
  });

  it('should initialize the productForm with a null value', () => {
    const productControl = component.productForm.controls['product'];
    expect(productControl.value).toBeNull();
    expect(productControl.valid).toBeFalse();
  });

  it('should not submit the form if no product type is selected', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.form__actions button');
    submitButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.productForm.valid).toBeFalse();
  });
});
