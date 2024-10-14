export const adminMenu = [
    {
        name: 'menu.admin.user',
        menus: [
            {
                name: 'menu.admin.manage-user',
                link: '/system/user-manage',
            },
            {
                name: 'menu.admin.manage-doctor',
                link: '/system/doctor-manage',
            },
            {
                name: 'menu.doctor.manage-schedule',
                link: '/system/doctor/schedule-manage',
            },
            {
                name: 'menu.admin.manage-admin',
                link: '/system/admin-manage',
            },
            {
                name: 'menu.admin.manage-patient',
                link: '/system/patient-manage',
            },
        ],
    },
    {
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.add-clinic',
                link: '/system/add-clinic',
            },
            {
                name: 'menu.admin.manage-clinic',
                link: '/system/clinic-manage',
            },
        ],
    },
    {
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty',
                link: '/system/specialty-manage',
            },
        ],
    },
    {
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook',
                link: '/system/handbook-manage',
            },
        ],
    },
];

export const doctorMenu = [
    {
        name: 'menu.doctor.manage-schedule',
        link: '/system/doctor/schedule-manage',

        // menus: [
        //     {
        //         name: 'menu.doctor.manage-schedule',
        //         link: '/system/doctor/schedule-manage',
        //     },
        // ],
    },
    {
        name: 'menu.doctor.manage-appointment',
        link: '/system/doctor/appointment-manage',

        // menus: [
        //     {
        //         name: 'menu.doctor.manage-appointment',
        //         link: '/system/doctor/appointment-manage',
        //     },
        // ],
    },
];
