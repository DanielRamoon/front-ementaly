import { makeStyles } from '@material-ui/core';

export const useNotificationsStyle = makeStyles(() => {
  return {
    list: {
      width: 350,
    },
    listItem: { alignItems: 'flex-start' },
    avatar: { marginTop: 8 },
  };
});
