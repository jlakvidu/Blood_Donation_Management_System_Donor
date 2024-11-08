import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorEditComponent } from './donor-edit.component';

describe('DonorEditComponent', () => {
  let component: DonorEditComponent;
  let fixture: ComponentFixture<DonorEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
