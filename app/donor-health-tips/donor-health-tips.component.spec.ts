import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorHealthTipsComponent } from './donor-health-tips.component';

describe('DonorHealthTipsComponent', () => {
  let component: DonorHealthTipsComponent;
  let fixture: ComponentFixture<DonorHealthTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorHealthTipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorHealthTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
