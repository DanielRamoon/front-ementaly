import { makeStyles } from '@material-ui/core/styles';

export const useListProfessionalsStyles = makeStyles((theme) => {
  return {
    button: {
      backgroundColor: '#fff',
    },
    input: {
      display: 'none',
    },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },
  };
});
