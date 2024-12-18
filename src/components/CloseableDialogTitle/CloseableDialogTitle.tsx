import { DialogTitle, IconButton } from '@material-ui/core';
import { Close } from 'mdi-material-ui';
import React from 'react';

interface CloseableDialogTitleProps {
  onClose: () => void;
  children?: any;
}

export const CloseableDialogTitle = (props: CloseableDialogTitleProps) => {
  return (
    <div className="flex items-center mr-2">
      <DialogTitle style={{ flex: 1 }}>
        <b>{props.children}</b>
      </DialogTitle>

      <div>
        <IconButton onClick={props.onClose}>
          <Close />
        </IconButton>
      </div>
    </div>
  );
};
