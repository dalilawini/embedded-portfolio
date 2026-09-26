import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { WeatherMonitoringComponent } from './projects/weather-monitoring/weather-monitoring';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Mohamed Ali Lawini | Embedded Software Engineer'
    },

    {
        path: 'projects/:slug',
        component: ProjectDetailComponent,
        title: 'Project | Mohamed Ali Lawini',
        children: [
            {
                path: '',
                component: WeatherMonitoringComponent
            }
        ]
    },

    {
        path: '**',
        redirectTo: ''
    }
];
