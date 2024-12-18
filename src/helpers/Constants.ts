export const Constants = {
  roles: {
    patient: [
      '/agenda',
      '/professionals',
      '/chat',
      '/finances',
      '#linkedProfessionals',
    ],
    admin: ['/professionals', '/patients'],
    professional: ['/agenda', '/patients', '/chat', '/finances'],
  },

  vapidKey: process.env.REACT_APP_FIREBASE_VAPIDKEY || '',
};
