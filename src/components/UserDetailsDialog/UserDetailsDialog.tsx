import { Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { IUser } from '../../libs/IUser';
import { CloseableDialogTitle } from '../CloseableDialogTitle/CloseableDialogTitle';

interface UserDetailsDialogProps {
  open: boolean;

  user: IUser;

  onClose: () => void;
}

export const UserDetailsDialog = (props: UserDetailsDialogProps) => {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <CloseableDialogTitle onClose={props.onClose}>
        <FormattedMessage id="userDetailsDialog.title" />
      </CloseableDialogTitle>
      <DialogContent>
        <div className="mb-4">
          <Typography variant="caption">
            <FormattedMessage id="userDetailsDialog.name" />
          </Typography>

          <Typography>
            <b>{props.user.name}</b>
          </Typography>
        </div>

        <div className="mb-4">
          <Typography variant="caption">
            <FormattedMessage id="userDetailsDialog.email" />
          </Typography>

          <Typography>
            <b>{props.user.email}</b>
          </Typography>
        </div>
        <div className="flex">
          <div className="mb-4 mr-4">
            <Typography variant="caption">
              <FormattedMessage id="userDetailsDialog.type" />
            </Typography>

            <Typography>
              <b>
                <FormattedMessage id={`userType.${props.user.type}`} />
              </b>
            </Typography>
          </div>
          <div className="mb-4">
            <Typography variant="caption">
              <FormattedMessage id="userDetailsDialog.lastSignIn" />
            </Typography>

            <Typography>
              <b>
                {Moment(props.user.lastSignInAt).format('DD/MM/YYYY HH:mm')}
              </b>
            </Typography>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
