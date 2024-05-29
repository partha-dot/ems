import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../service/auth.guard';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'DG', data: { breadcrumb: 'Button' }, loadChildren: () => import('./dg/buttondemo.module').then(m => m.ButtonDemoModule) },
        { path: 'energy', data: { breadcrumb: 'energy' }, loadChildren: () => import('./energy/chartsdemo.module').then(m => m.ChartsDemoModule) },
        { path: 'energy_chart', data: { breadcrumb: 'energy' }, loadChildren: () => import('./energy_chart/chartsdemo1.module').then(m => m.ChartsDemo1Module) },
        { path: 'energy_devInfo', data: { breadcrumb: 'energy' }, loadChildren: () => import('./energy_devInfo/chartsdemo2.module').then(m => m.ChartsDemo2Module) },
        { path: 'energy_billing', data: { breadcrumb: 'File' }, loadChildren: () => import('./energy_billing_rep/filedemo.module').then(m => m.FileDemoModule)},
        { path: 'energy_billing2', data: { breadcrumb: 'File' }, loadChildren: () => import('./energy_billing_rep2/filedemo2.module').then(m => m.FileDemo2Module)},
        { path: 'device_m', data: { breadcrumb: 'Float Label' }, loadChildren: () => import('./m_device_management/floatlabeldemo.module').then(m => m.FloatlabelDemoModule) },
        { path: 'schedul', data: { breadcrumb: 'Form Layout' }, loadChildren: () => import('./stockEntry/formlayoutdemo.module').then(m => m.FormLayoutDemoModule) },
        { path: 'device_s', data: { breadcrumb: 'Input' }, loadChildren: () => import('./m_user_management/inputdemo.module').then(m => m.InputDemoModule) },
        // { path: 'invalidstate', data: { breadcrumb: 'Invalid State' }, loadChildren: () => import('./invalid/invalidstatedemo.module').then(m => m.InvalidStateDemoModule) },
        { path: 'UPS', data: { breadcrumb: 'List' }, loadChildren: () => import('./ups/listdemo.module').then(m => m.ListDemoModule) },
        { path: 'AddDealer', data: { breadcrumb: 'Media' }, loadChildren: () => import('./AddDealer/mediademo.module').then(m => m.MediaDemoModule) },
        // { path: 'message', data: { breadcrumb: 'Message' }, loadChildren: () => import('./messages/messagesdemo.module').then(m => m.MessagesDemoModule) },
        { path: 'AddCustomer', data: { breadcrumb: 'Misc' }, loadChildren: () => import('./AddCustomer/miscdemo.module').then(m => m.MiscDemoModule) },
        // { path: 'overlay', data: { breadcrumb: 'Overlay' }, loadChildren: () => import('./overlays/overlaysdemo.module').then(m => m.OverlaysDemoModule) },
        { path: 'org_setting', data: { breadcrumb: 'Panel' }, loadChildren: () => import('./organizationSetting/panelsdemo.module').then(m => m.PanelsDemoModule) },
        { path: 'alert', data: { breadcrumb: 'Table' }, loadChildren: () => import('./alert/messagesdemo.module').then(m => m.MessagesDemoModule) },
        { path: 'report', data: { breadcrumb: 'Product' }, loadChildren: () => import('./historicData/product.module').then(m => m.ProductModule) },
        { path: 'usr', data: { breadcrumb: 'Model' }, loadChildren: () => import('./UserMaster/model.module').then(m => m.ModelModule) },
        { path: 'org', data: { breadcrumb: 'Tree' }, loadChildren: () => import('./OrganizationMaster/treedemo.module').then(m => m.TreeDemoModule) },
        { path: 'menu', data: { breadcrumb: 'Menu' }, loadChildren: () => import('./menus/menus.module').then(m => m.MenusModule) },
        { path: '**', redirectTo: '/notfound' },
        { path: '', redirectTo: '/company', pathMatch: 'full' },
    ])],
    exports: [RouterModule]
})
export class UIkitRoutingModule { }
