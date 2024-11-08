import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorProfileComponent } from './donor-profile.component';

describe('DonorProfileComponent', () => {
  let component: DonorProfileComponent;
  let fixture: ComponentFixture<DonorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
