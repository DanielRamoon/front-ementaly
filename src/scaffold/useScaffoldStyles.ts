import { makeStyles } from '@material-ui/core';
import Color from 'color';

export const useScaffoldStyles = makeStyles((theme) => {
  const drawerWidth = 256;
  const appBarHeight = 64;

  return {
    root: {
      display: 'flex',
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
      backgroundColor: '#282832',
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    title: {
      flexGrow: 1,
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      zIndex: 1,
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: 0,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: '100vh',
      paddingTop: appBarHeight,
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 240,
    },
    logout: {
      color: theme.palette.error.main,
    },
    listContainer: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: appBarHeight,
    },
    list: {
      flex: 1,
    },
    listFooter: {
      padding: 16,
    },
    footerItem: {
      fontWeight: 'bold',
    },
    sideMenuItemIcon: {
      color: 'white',
    },
    sideMenuItemSelected: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      fillColor: 'white',
      borderRadius: 4,
      '&:hover': {
        backgroundColor: Color(theme.palette.primary.main)
          .darken(0.2)
          .toString(),
      },
    },
  };
});
