import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorSignInComponent } from './donor-sign-in.component';

describe('DonorSignInComponent', () => {
  let component: DonorSignInComponent;
  let fixture: ComponentFixture<DonorSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorSignInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
