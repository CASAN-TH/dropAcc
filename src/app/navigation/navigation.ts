import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    // {
    //     id       : 'Dashboard',
    //     title    : 'Dashboard',
    //     translate: 'NAV.DASHBOARD',
    //     type     : 'group',
    //     children : [
            
    //     ]
    // },
    // {
    //     id: 'HR',
    //     title: 'HR',
    //     translate: 'NAV.HR',
    //     type: 'group',
    //     children: [
            
    //     ]
    // },
    // {
    //     id: 'CRM',
    //     title: 'CRM',
    //     translate: 'NAV.CRM',
    //     type: 'group',
    //     children: [
            
    //     ]
    // },
    {
        id: 'accounting',
        title: 'Accounting',
        translate: 'NAV.ACCOUNTING',
        type: 'group',
        children: [
            {
                id       : 'dashboad-accounting',
                title    : 'Dashboard Accounting',
                translate: 'นำเข้าข้อมูลการขาย',
                type     : 'item',
                icon     : 'cloud_download',
                url      : '/sale',
                
            }
        ]
    }
];
