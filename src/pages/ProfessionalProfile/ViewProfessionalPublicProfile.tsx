import { Avatar, Button, Hidden, Typography } from '@material-ui/core';
import {
  Alert,
  CheckAll,
  DivingHelmet,
  Facebook,
  ForumOutline,
  HumanCane,
  HumanMaleFemale,
  Instagram,
  Linkedin,
  LinkVariant,
  Pencil,
  ProgressClose,
  StarCircle,
  TrashCanOutline,
  Whatsapp,
} from 'mdi-material-ui';
import ReactGA from 'react-ga4';
import { isMobile } from 'react-device-detect';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  ProfessionalProfileApprovalDialog,
  ProfessionalProfileWaitingApprovalDialog,
} from '../../components';
import useAuth from '../../hooks/useAuth';
import { IProfessional, UserTypes } from '../../libs';
import { getProfessionalCertification } from '../../utils/getProfessionalCertification';
import { useProfessionalProfileStyles } from './useProfessionalProfileStyles';
import { DeleteProfessional } from '../../components/Dialogs/DeleteProfessional';
import { UserApi } from '../../apis';

interface Props {
  user: IProfessional;
}

const SocialMediaLogos: Record<string, any> = {
  linkedin: <Linkedin />,
  facebook: <Facebook />,
  instagram: <Instagram />,
  externalUrl: <LinkVariant />,
};

const ViewProfessionalProfile: React.FC<Props> = ({ user, ...props }) => {
  const classes = useProfessionalProfileStyles();

  const formatPhoneNumber = (phone?: string): string => {
    if (!phone || phone.length < 10) return phone || '';
    const prefix = phone.substring(0, 2);
    const firstPart = phone.substring(2, phone.length === 10 ? 6 : 7);
    const lastPart = phone.substring(phone.length === 10 ? 6 : 7);
    return `(${prefix}) ${firstPart}-${lastPart}`;
  };

  const socialMediaLinks = [
    { type: 'linkedin', url: user.linkedin },
    { type: 'facebook', url: user.facebook },
    { type: 'instagram', url: user.instagram },
    { type: 'externalUrl', url: user.externalUrl },
  ];

  const hasSocialMedia = socialMediaLinks.some(
    (link) => link.url?.length !== 0,
  );

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <section
      id="professional"
      className="h-full bg-white px-8 divide-y divide-gray-300 rounded xl:mx-8">
      <div
        id="personal-data"
        className="flex justify-between items-center py-6 flex-col sm:flex-row">
        <Avatar alt={user.name} src={user.avatar} className={classes.large} />
        <section className="mb-4 self-start sm:self-auto sm:mb-0 md:ml-8 xl:w-80">
          <div className="flex flex-col xl:flex-row">
            <h5 className="text-gray-500 font-light text-base">
              {user?.actAs?.map((act, index) => (
                <div key={act}>
                  {index > 0 && ' / '}
                  <FormattedMessage
                    id={`professionalProfile.professional.${act}`}
                    key={act}
                  />
                </div>
              ))}
            </h5>
            {user.status === 'verified' && (
              <p className="font-bold text-primary mb-1 text-sm xl:mt-0 xl:ml-2">
                <StarCircle fontSize="small" />
                <FormattedMessage id="professionalProfile.checked" />
              </p>
            )}
          </div>
          <h2 className="font-bold text-xl">{user.name}</h2>
          <h4 className="text-gray-500 font-light text-base">
            {getProfessionalCertification(user)}
          </h4>
        </section>
        <section className="mb-4 self-start sm:mb-0 sm:self-auto mr-8">
          <p className="text-gray-500 font-light">
            <FormattedMessage id="professionalProfile.amount" />
          </p>
          <h3 className="text-gray-600 font-black text-base">
            <FormattedMessage id="txt.amountSymbol" />
            {user.charges}
          </h3>
        </section>
        <section className="mb-4 self-start sm:mb-0  sm:self-auto">
          <p className="text-gray-500 font-light">
            <FormattedMessage id="professionalProfile.duration" />
          </p>
          <h3 className="text-gray-600 font-black text-base">
            {user.sessionDuration === 3600 ? (
              <FormattedMessage id="txt.hourText" />
            ) : (
              <>
                {user.sessionDuration} <FormattedMessage id="txt.minuteText" />
              </>
            )}
          </h3>
        </section>
      </div>
      <div className="py-6">
        <section className="mb-4 self-start sm:mb-0 sm:self-auto mr-8">
          <p className="text-gray-500 font-light">
            <FormattedMessage id="professionalProfile.email" />
          </p>
          <h3 className="text-gray-600 font-black text-base">
            {user.user.email}
          </h3>
        </section>
        {user.showWhatsapp && user.whatsapp && (
          <section className="mb-4 self-start sm:mb-0 sm:self-auto mr-8">
            <p className="text-gray-500 font-light">
              <FormattedMessage id="professionalProfile.whatsapp" />
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              <h3 className="text-gray-600 font-black text-base">
                {formatPhoneNumber(user.whatsapp)}
              </h3>
            </div>
          </section>
        )}
      </div>

      {hasSocialMedia && (
        <div className="py-6">
          <h2 className="font-bold text-lg mb-4">Redes Sociais</h2>
          <div>
            {socialMediaLinks.map((link) => {
              if (!link.url) return null;
              return (
                <a
                  href={
                    link.url.startsWith('http')
                      ? link.url
                      : `https://${link.url}`
                  }
                  key={link.type}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-800 font-black text-base mr-4">
                  {SocialMediaLogos[link.type]}
                </a>
              );
            })}
          </div>
        </div>
      )}
      <div id="skills" className="flex justify-between py-6">
        <section className="w-full">
          <h2 className="font-bold text-lg">
            <FormattedMessage id="professionalProfile.canIHelpYou" />
          </h2>
          <div className="flex w-full flex-wrap">
            {user.expertises.map((expertise) => (
              <span
                className="border-2 border-solid border-gray-200 rounded p-2 m-1 text-xs "
                key={expertise.uuid}>
                {expertise.name}
              </span>
            ))}
          </div>
        </section>
        <section className="w-2/5 flex flex-col">
          <h4 className="text-gray-500 ml-1 text-base">
            <FormattedMessage id="professionalProfile.attendanceText" />
          </h4>
          {user.worksWith.map((work) => (
            <span
              className="flex mt-4 text-gray-500 items-center text-base"
              key={work}>
              {work === 'adult' && <HumanMaleFemale />}
              {work === 'elderly' && <HumanCane />}
              <FormattedMessage id={`professionalProfile.attendance.${work}`} />
            </span>
          ))}
        </section>
      </div>
      <div id="courses" className="py-6">
        <h2 className="font-bold text-lg">
          <FormattedMessage id="professionalProfile.academicFormation" />
        </h2>
        {user.education.map((course) => (
          <div className="mt-4" key={course.uuid}>
            <h3 className="font-bold text-base mt-1">{course.name}</h3>
            <h4 className="my-1">
              {moment(course.from).format('DD/MM/YYYY')} -{' '}
              {course.until
                ? ` ${moment(course.until).format('DD/MM/YYYY')}`
                : ` até o momento`}
            </h4>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
      <div id="about-me" className="py-6">
        <h2 className="font-bold text-lg">
          <FormattedMessage id="professionalProfile.aboutMe" />
        </h2>
        <p>{user.aboutMe}</p>
      </div>
    </section>
  );
};

export default ViewProfessionalProfile;
