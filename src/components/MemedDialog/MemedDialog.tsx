import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { PrescriptionApi, ProfessionalApi } from '../../apis';
import { IPatient } from '../../libs';
import { CloseableDialogTitle } from '../CloseableDialogTitle/CloseableDialogTitle';
import { LoadingContainer } from '../LoadingContainer/LoadingContainer';

interface MemedDialogProps {
  open: boolean;
  onClose: () => void;

  patient: IPatient;
}

export const MemedDialog = (props: MemedDialogProps) => {
  return (
    <Dialog
      open={props.open}
      disableBackdropClick
      disableEscapeKeyDown
      onClose={props.onClose}
      maxWidth="lg"
      fullWidth>
      <CloseableDialogTitle onClose={props.onClose} />
      <DialogContent>
        <MemedContent {...props} />
      </DialogContent>
    </Dialog>
  );
};

export const MemedContent = (props: MemedDialogProps) => {
  const [isLoading, setLoading] = useState(false);

  const initEvents = () => {
    MdSinapsePrescricao.event.add(
      'core:moduleInit',
      async (data: ModuleInitEventPayload) => {
        setLoading(false);

        if (data.name === 'plataforma.prescricao') {
          await MdHub.command.send('plataforma.prescricao', 'setPaciente', {
            nome: props.patient.name,
            idExterno: props.patient.uuid,
          });

          await MdHub.command.send(
            'plataforma.prescricao',
            'setFeatureToggle',
            {
              deletePatient: false,
              removePatient: false,
              editPatient: false,
              buttonClose: false,
            },
          );

          MdHub.event.add(
            'prescricaoImpressa',
            async (prescription: PrescriptionPrintingEventPayload) => {
              if (!prescription.reimpressao) {
                await PrescriptionApi.save({
                  externalId: `${prescription.prescricao.id}`,
                  data: prescription.prescricao,
                  patient: props.patient.uuid,
                });
              }
            },
          );

          MdHub.module.show('plataforma.prescricao');
        }
      },
    );

    MdSinapsePrescricao.event.add(
      'core:moduleHide',
      (data: ModuleHideEventPayload) => {
        console.log('Data: ', data);

        if (data.moduleName === 'plataforma.prescricao') {
          props.onClose();
        }
      },
    );
  };

  const { formatMessage } = useIntl();

  const init = async () => {
    try {
      setLoading(true);

      const { token } = await ProfessionalApi.findMemedToken();

      const script = document.createElement('script');

      script.setAttribute('type', 'text/javascript');
      script.setAttribute('data-color', '#00B0AB');
      script.setAttribute('data-token', token);
      script.setAttribute('data-container', 'memed-container');
      script.src =
        'https://memed.com.br/modulos/plataforma.sinapse-prescricao/build/sinapse-prescricao.min.js';

      script.onload = () => {
        console.log('Loaded script!');

        initEvents();
      };

      document.body.appendChild(script);

      return () => {
        MdHub.server.unbindEvents();

        document.body.removeChild(script);

        delete (window as any).MdHub;
      };
    } catch {
      toast.error(formatMessage({ id: 'genericError' }));

      setLoading(false);

      props.onClose();

      return () => {};
    }
  };

  useEffect(() => {
    if (!props.open) return () => {};

    let unsubscribe: () => void | undefined;

    init().then((cleanUp) => {
      unsubscribe = cleanUp;
    });

    return () => {
      unsubscribe?.();
    };
  }, [props.open, props.patient]);

  return (
    <>
      <LoadingContainer loading={isLoading}>
        <div />
      </LoadingContainer>
      <div id="memed-container" style={{ height: !isLoading ? 700 : 0 }} />
    </>
  );
};
