import { Box, Button, Typography } from '@material-ui/core';
import { AlertOutline, ArrowRight, ChevronLeft } from 'mdi-material-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { ProfessionalApi } from '../../apis';
import useAuth from '../../hooks/useAuth';
import { UserTypes } from '../../libs';

interface TitleProps {
  back?: boolean;
}

export const TitleDashboard: React.FC<TitleProps> = ({
  children,
  back = true,
}) => {
  const [isAlertVisible, setAlertVisible] = useState(false);

  const goBack = useCallback(() => {
    window.history.go(-1);
  }, []);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.type !== UserTypes.professional) return;

    ProfessionalApi.show(currentUser.uuid, { ignoreObjectNotFound: true })
      .then((professional) => {
        const hasRecipient = Boolean(professional.recipient);
        const hasSchedule = Object.keys(
          professional.workingSchedule || {},
        ).reduce((hasHourInWeek, dayOfWeek) => {
          const day = professional.workingSchedule[dayOfWeek];

          const hasHourInDay = day.hours.reduce(
            (prev, hour) => hour.selected || prev,
            false,
          );

          return hasHourInWeek || hasHourInDay;
        }, false);

        if (professional.status === 'verified') {
          return;
        }

        setAlertVisible(!hasRecipient || !hasSchedule);
      })
      .catch(() => setAlertVisible(true));
  }, []);

  return (
    <>
      {isAlertVisible && (
        <Box color="white">
          <div className="md:flex items-center p-4 bg-red-500">
            <div className="flex-1 flex items-center">
              <AlertOutline style={{ marginRight: 16 }} />
              <Typography>
                <FormattedMessage id="professionalProfile.missingSettings" />
              </Typography>
            </div>

            {/* <div>
              <Button
                component={Link}
                to="/professional/profile"
                endIcon={<ArrowRight />}
                color="inherit">
                <FormattedMessage id="professionalProfile.button.settings" />
              </Button>
            </div> */}
          </div>
        </Box>
      )}
      <div className="flex bg-white px-8 py-2 items-center ">
        {back && <ChevronLeft onClick={goBack} className="cursor-pointer" />}
        <h1 className="text-2xl font-black text-gray-700 py-4 bg-white px-8 flex items-center justify-between w-full">
          {children}
        </h1>
      </div>
    </>
  );
};
