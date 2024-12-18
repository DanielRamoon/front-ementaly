import { makeStyles } from '@material-ui/core';
import { cyan, grey } from '@material-ui/core/colors';

export const useChatStyle = makeStyles((theme) => {
  const borderStyle = `1px solid ${grey[200]}`;

  const isMobile = theme.breakpoints.down('sm');

  const appBarHeight = isMobile ? 56 : 64;

  return {
    onGoingChatsRoot: {
      flex: 0.3,
      borderRight: borderStyle,
    },

    onGoingChatsTopBar: { borderBottom: borderStyle },
    onGoingChatsSecondaryAction: { textAlign: 'center' },
    inputBar: { background: grey[200] },
    contentContainer: {
      display: 'flex',
      flexDirection: 'column',
      flex: 0.7,
      height: `calc(100vh - ${appBarHeight}px - 72px)`,
      [theme.breakpoints.down('sm')]: {
        height: `calc(100vh - ${appBarHeight}px - 8px)`,
      },
      width: '100%',
    },
    chatContentTopBar: { borderBottom: borderStyle },
    chatContentScrollContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column-reverse',
      justifyContent: 'space-between',
      overflowY: 'scroll',
      padding: 16,
    },
    chatContentInfiniteScroll: {
      display: 'flex',
      flexDirection: 'column-reverse',
    },
    chatMessage: {
      maxWidth: '80%',
    },
    messageByOtherUser: {
      backgroundColor: grey[200],
      borderTopLeftRadius: 0,
    },
    messageByCurrentUser: {
      backgroundColor: cyan[200],
      borderTopRightRadius: 0,
    },
  };
});
