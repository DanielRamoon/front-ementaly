import { Avatar, Button, Divider, Modal } from '@material-ui/core';

import ReactGA from 'react-ga4';
import { ForumOutline, Pencil, Whatsapp } from 'mdi-material-ui';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { usePatientProfileStyles } from '..';
import ModalWrapper from '../../components/ModalWrapper/ModalWrapper';
import useAuth from '../../hooks/useAuth';
import {
  useMaskFormatter,
  useMaskPatterns,
} from '../../hooks/useMaskFormatter';
import AnamnesisModal from './AnamnesisModal';
import { IPatientProfilePagesProps } from './PatientProfile';

const ViewPatientProfile: React.FC<IPatientProfilePagesProps> = ({
  userData,
  onHeaderButtonHandler,
}) => {
  const [anamnesisIsOpen, setAnamnesisIsOpen] = useState<boolean>(false);

  const classes = usePatientProfileStyles();
  const { currentUser } = useAuth();
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(true);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const whatsappURL = isMobile
    ? 'https://api.whatsapp.com/send?phone=55'
    : 'https://web.whatsapp.com/send?phone=55';

  const handleClosePaymentModal = () => {
    localStorage.setItem('hasShownPaymentModal', 'true');
    setPaymentModalOpen(false);
  };

  useEffect(() => {
    const hasShownModal = localStorage.getItem('hasShownPaymentModal');
    if (!hasShownModal) {
      setPaymentModalOpen(true);
    }
  }, []);

  return (
    <>
      <ModalWrapper
        open={anamnesisIsOpen}
        onClose={() => setAnamnesisIsOpen(false)}
        moreClass="md:w-7/12"
        title=""
        disableEscapeKeyDown
        disableBackdropClick>
        <div style={{ overflowY: 'scroll', maxHeight: '50vh' }}>
          <AnamnesisModal
            onClose={() => setAnamnesisIsOpen(false)}
            userData={userData}
          />
        </div>
      </ModalWrapper>
      <section className="w-full">
        <div className="flex flex-wrap justify-between mb-7">
          <div className="flex gap-6 items-center">
            <Avatar
              className={classes.avatar}
              src={userData?.avatar}
              alt="User photo"
            />
            <div>
              <span className="block text-sm text-gray-500">Nome</span>
              <strong className="block text-base text-gray-900">
                {userData?.name}
              </strong>
            </div>
          </div>
          <div className="flex items-center w-full mt-8 md:mt-0 md:w-auto md:pr-8">
            {currentUser?.type === 'patient' && (
              <Button
                className="focus:outline-none w-full"
                color="primary"
                startIcon={<Pencil />}
                onClick={() => onHeaderButtonHandler()}>
                <FormattedMessage id="professionalProfile.button.edit" />
              </Button>
            )}
            {currentUser?.type === 'professional' && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to={`/chat?to=${userData?.uuid}&name=${userData?.name}&type=patient`}
                  startIcon={<ForumOutline />}
                  style={{ marginRight: 16, minWidth: 96 }}>
                  <FormattedMessage id="professionalProfile.button.chat" />
                </Button>
                {userData?.phoneNumber && (
                  <Button
                    variant="outlined"
                    color="primary"
                    component="a"
                    target="_blank"
                    href={`${whatsappURL}${userData?.phoneNumber}`}
                    startIcon={<Whatsapp />}
                    style={{ marginRight: 16, minWidth: 126 }}>
                    <FormattedMessage id="professionalProfile.button.whatsapp" />
                  </Button>
                )}
                <Button
                  variant="contained"
                  className="focus:outline-none w-full"
                  color="primary"
                  onClick={() => setAnamnesisIsOpen(true)}>
                  <FormattedMessage id="patientProfile.button.anamnese" />
                </Button>
              </>
            )}
          </div>
        </div>
        <Divider />
      </section>
      <div className="w-full xl:w-6/12">
        <span className="block text-sm text-gray-500">
          <FormattedMessage id="field.email" />
        </span>
        <strong className="block text-sm text-gray-500">
          {userData?.email}
        </strong>
      </div>
      <div className="w-full xl:w-6/12">
        <span className="block text-sm text-gray-500">
          <FormattedMessage id="field.document" />
        </span>
        <strong className="block text-sm text-gray-500">
          {userData?.documentNumber}
        </strong>
      </div>
      <div className="w-full xl:w-6/12">
        <span className="block text-sm text-gray-500">
          <FormattedMessage id="field.phone" />
        </span>
        <strong className="block text-sm text-gray-500">
          {useMaskFormatter(
            userData?.phoneNumber || '',
            useMaskPatterns.celphone,
          )}
        </strong>
      </div>
      <div className="w-full xl:w-6/12">
        <span className="block text-sm text-gray-500">
          <FormattedMessage id="field.age" />
        </span>
        <strong className="block text-sm text-gray-500">
          {userData?.birthDate &&
            `${moment().diff(userData.birthDate, 'years')} Anos`}
        </strong>
      </div>
      <div className="w-full xl:w-6/12">
        <span className="block text-sm text-gray-500">
          <FormattedMessage id="field.birthDate" />
        </span>
        <strong className="block text-sm text-gray-500">
          {userData?.birthDate && `${moment(userData.birthDate).format('L')}`}
        </strong>
      </div>

      <Modal
        open={paymentModalOpen}
        onClose={handleClosePaymentModal}
        disableBackdropClick
        disableEscapeKeyDown>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            maxWidth: '20%',
            margin: 'auto',
            marginTop: '20vh',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.8)',
            textAlign: 'center',
          }}>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Estamos atualizando nosso sistema de pagamento interno para melhor
            atendê-los. Para agendar sua consulta, gentileza entrar em contato
            diretamente com o profissional pelo botão de WhatsApp que aparece no
            perfil do mesmo.
          </p>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Qualquer dificuldade, teremos prazer em ajudá-los:
            <br />
            <strong style={{ fontSize: '18px' }}>27 37636376 (WhatsApp)</strong>
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClosePaymentModal}
            style={{ marginTop: '20px' }}>
            OK
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ViewPatientProfile;
