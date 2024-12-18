import { Backdrop, createStyles, Fade, makeStyles, Modal, ModalProps } from '@material-ui/core';
import { Close } from 'mdi-material-ui';
import React from 'react';

interface IModalWrapper extends ModalProps {
  title?: string;
  handleClose?: () => void;
  moreClass?: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

const ModalWrapper: React.FC<IModalWrapper> = ({
  children,
  title,
  moreClass,
  ...props
}) => {
  const classes = useStyles();

  return (
    <Modal
      className={classes.modal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      {...props}>
      <Fade in={props.open}>
        <section
          className={`w-9/12 h-auto max-h-full  p-6 bg-white rounded focus:outline-none overflow-y-hidden ${moreClass} flex flex-col`}>
          <section className="flex items-center justify-between w-full ">
            <strong className="font-black text-2xl">{title}</strong>
            <Close
              className="text-gray-500"
              cursor="pointer"
              onClick={(event) =>
                props.onClose && props.onClose(event, 'backdropClick')
              }
            />
          </section>
          <section className="flex-1 mt-6">{children}</section>
        </section>
      </Fade>
    </Modal>
  );
};

export default ModalWrapper;
