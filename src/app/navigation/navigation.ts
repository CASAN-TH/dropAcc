import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'systemsummary',
        title    : 'System Summary',
        translate: 'NAV.SYSTEMSUMMARY',
        type     : 'group',
        children : [
            {
                id       : 'dashboard',
                title    : 'Dashboard',
                translate: 'NAV.DASHBOARD.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/dashboard',
                badge    : {
                    title    : '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            }
        ]
    },
    {
        id       : 'dailytask',
        title    : 'Daily',
        translate: 'NAV.DAILY',
        type     : 'group',
        children : [
            {
                id       : 'sale',
                title    : 'Sale',
                translate: 'NAV.SALE.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/sale',
                badge    : {
                    title    : '25',
                    translate: 'NAV.SALE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            }
        ]
    }
];
