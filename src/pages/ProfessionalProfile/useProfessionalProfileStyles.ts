import { makeStyles } from '@material-ui/core/styles';

export const useProfessionalProfileStyles = makeStyles((theme) => {
  return {
    input: {
      display: 'none',
    },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },
  };
});
