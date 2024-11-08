import { Routes } from '@angular/router';
import { DonorFormComponent} from './donor-registration/donor-registration.component';
import { DonorSignInComponent } from './donor-sign-in/donor-sign-in.component';
import { DonorDashboardComponent } from './donor-dashboard/donor-dashboard.component';
import { DonorProfileComponent } from './donor-profile/donor-profile.component';
import { DonorEditComponent } from './donor-edit/donor-edit.component';
import { DonorHealthTipsComponent } from './donor-health-tips/donor-health-tips.component';
import { DonorCampaignsComponent } from './donor-campaigns/donor-campaigns.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { PlaceAppointmentComponent } from './place-appointment/place-appointment.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ViewEmerganzyBloodNeedComponent } from './view-emerganzy-blood-need/view-emerganzy-blood-need.component';
import { CampaignsComponent } from './campaigns/campaigns.component';

export const routes: Routes = [
    {
        path : "",
        component : DonorSignInComponent
    },

    {
        path : "donor-registration",
        component : DonorFormComponent
    },

    {
        path: 'donor-profile', 
        component: DonorProfileComponent
    },

    {
        path: 'donor-dashboard',
        component: DonorDashboardComponent
    },

    {
        path: 'login',
        component: DonorSignInComponent 
    },

    {
        path : 'donor-edit',
        component: DonorEditComponent
    },

    {
        path: 'health-tips',
        component: DonorHealthTipsComponent
    },

    {
        path: 'campaigns',
        component: CampaignsComponent
    },
    {
        path: 'appointment',
        component: AppointmentComponent
    },
    {
        path: 'place-appointment',
        component: PlaceAppointmentComponent
    },
    {
        path: 'notifications',
        component: NotificationsComponent
    },
    {
        path: 'emerganzy',
        component: ViewEmerganzyBloodNeedComponent
    }
];
