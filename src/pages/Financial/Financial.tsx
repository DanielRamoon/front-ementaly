import React, { useCallback, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';

import { FormattedMessage, useIntl } from 'react-intl';
import { ProfessionalApi } from '../../apis';
import { ScheduleApi } from '../../apis/ScheduleApi';
import { BoxWrapperDashboard, TitleDashboard } from '../../components';
import useAuth from '../../hooks/useAuth';
import { ISchedule } from '../../libs';
import FinancialReceipts from './FinancialReceipts/FinancialReceipts';

export const Financial: React.FC = () => {
  const { formatMessage } = useIntl();

  const { currentUser } = useAuth();

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <section className="h-full">
      <TitleDashboard>
        <FormattedMessage id="financial.receipts.title" />
      </TitleDashboard>

      <BoxWrapperDashboard>
        <section className="w-full h-full bg-white py-5 px-8 m-8 justify-center">
          <div className="flex flex-wrap gap-6 justify-between">
            <h2 className="text-lg font-black text-gray-700">
              <FormattedMessage id="financial.receipts.subtitle" />
            </h2>
            <FinancialReceipts />
          </div>
        </section>
      </BoxWrapperDashboard>
    </section>
  );
};
