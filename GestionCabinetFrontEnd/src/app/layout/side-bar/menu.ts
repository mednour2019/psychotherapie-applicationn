export const Menu = [
  {
    label: 'dashboard',
    icon: 'nav-icon fas fa-tachometer-alt',
    class: 'nav-link active',
    show:true,
    subMenu: [
      {
        label: 'dashboard1',
        url: 'stat',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
    ],
  },
  {
    label: 'office management',
    icon: 'fa fa-cog',
    class: 'nav-link ',
    show:true,
    subMenu: [
      {
        label: 'Patient management',
        url: 'patient',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
      {
        label: 'appointement management',
        url: 'rdv',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
      {
        label: 'consultation management',
        url: 'conslt',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
      {
        label: 'prescription management',
        url: 'ord',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
      {
        label: 'invoice management',
        url: 'fctr',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      }
    ],
  },
  {
    label: 'patient management',
    icon: 'nav-icon fas fa-tachometer-alt',
    class: 'nav-link active',
    show:true,
    subMenu: [
      {
        label: 'make appointement',
        url: 'prd-rdv',
        classa: 'nav-link',
        classi: 'far fa-circle nav-icon',
        show:true
      },
    ],
  }
];
