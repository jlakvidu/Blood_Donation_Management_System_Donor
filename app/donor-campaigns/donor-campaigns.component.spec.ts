import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorCampaignsComponent } from './donor-campaigns.component';

describe('DonorCampaignsComponent', () => {
  let component: DonorCampaignsComponent;
  let fixture: ComponentFixture<DonorCampaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorCampaignsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
