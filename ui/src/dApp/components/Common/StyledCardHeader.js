import { CardHeader } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export const StyleCardHeader = withStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    padding: '50px',
  },
  title: {
    fontSize: '50px',
  },
})(CardHeader);

// TODO: Is this proper
export default StyleCardHeader;
