import { makeStyles } from '@material-ui/core/styles';

export const useFinancialReceiptsStyles = makeStyles((theme) => {
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
