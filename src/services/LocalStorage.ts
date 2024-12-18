import { IAuthenticationToken, UserType } from '../libs';

const permissionsKey = 'ementaly.user.permissions';
const emailKey = 'ementaly.email';
const accessTokenKey = 'ementaly.accessToken';
const devicesKey = 'ementaly.devices';
const typeKey = 'ementaly.type';
const userKey = 'ementaly.user';

export const LocalStorage = {
  setRoles: (permissions: string[]): void => {
    localStorage.setItem(permissionsKey, permissions.join());
  },

  getRoles: (): string[] => {
    const item = localStorage.getItem(permissionsKey);

    return !item ? [] : item.split(',');
  },

  setToken: (token: string): void => {
    localStorage.setItem(accessTokenKey, token);
  },

  setUser: (options: IAuthenticationToken): void => {
    localStorage.setItem(userKey, JSON.stringify(options));

    localStorage.setItem(emailKey, options.email);

    LocalStorage.setRoles(options.roles);
    LocalStorage.setType(options.type as UserType);
  },

  getUser: () => {
    return JSON.parse(localStorage.getItem(userKey) || '{}');
  },

  getEmail: (): string | null => {
    return localStorage.getItem(emailKey);
  },

  getToken: (): string | null => {
    return localStorage.getItem(accessTokenKey);
  },

  setDeviceTokens: (devices: Record<string, boolean>): void => {
    localStorage.setItem(
      devicesKey,
      Object.keys(devices)
        .map((device) => devices[device] === true)
        .join(','),
    );
  },

  getDeviceTokens: (): string[] => {
    const devices = localStorage.getItem(devicesKey) || '';

    return devices.split(',');
  },

  setType: (type: UserType): void => {
    localStorage.setItem(typeKey, type);
  },

  getType: (): UserType => {
    const type = localStorage.getItem(typeKey);
    return type as UserType;
  },

  clear: (): void => {
    localStorage.clear();
  },
};
