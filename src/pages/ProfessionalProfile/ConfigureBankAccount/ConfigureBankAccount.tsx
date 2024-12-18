import { Button, Grid, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import banks from 'bancos-brasileiros/bancos.json';
import { Formik, FormikHelpers } from 'formik';
import { InformationOutline } from 'mdi-material-ui';
import Pencil from 'mdi-material-ui/Pencil';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import ReactGA from 'react-ga4';

import { ProfessionalApi } from '../../../apis';
import {
  DocumentNumberTextField,
  LoadingContainer,
  Select,
  TextField,
} from '../../../components';
import { BankAccountTypes, CreateBankAccountDTO } from '../../../libs';
import { transformClassValidatorToFormikErrors } from '../../../utils/transformClassValidatorToFormikErrors';
import { useField } from '../../../utils/useField';
import { getBankAccountSchema } from './getBankAccountSchema';

interface ConfigureBankAccountProps {
  readonly: boolean;
}

export const ConfigureBankAccount: React.FC<ConfigureBankAccountProps> = (
  props,
) => {
  const [isLoading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<CreateBankAccountDTO>({
    holderName: '',
    documentNumber: '',
    bank: '',
    agency: '',
    agencyDigit: '',
    accountType: '',
    account: '',
    accountDigit: '',
  });
  const intl = useIntl();

  const { current: schema } = React.useRef(getBankAccountSchema(intl));

  const findBankAccount = async (): Promise<void> => {
    try {
      setLoading(true);
      const bankAccount = await ProfessionalApi.findBankAccount();

      setInitialValues(bankAccount);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findBankAccount();
  }, []);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const onSubmit = async (
    values: CreateBankAccountDTO,
    bag: FormikHelpers<CreateBankAccountDTO>,
  ): Promise<void> => {
    try {
      await ProfessionalApi.setBankAccount(values);

      toast.info('Informações atualizadas');

      window.location.reload();
    } catch (error) {
      toast.error('Não foi possível processar sua requisição. Tente novamente');
      bag.setErrors(transformClassValidatorToFormikErrors(error));
    }
  };

  return (
    <div className="h-full bg-white p-4 lg:p-8 rounded">
      <LoadingContainer loading={isLoading}>
        <div className="bg-blue-50 rounded-md px-8 py-4 flex text-blue-500 mb-4">
          <InformationOutline style={{ color: 'inherit', marginRight: 8 }} />
          <Typography style={{ flex: 1, color: 'inherit' }}>
            <FormattedMessage id="configureBankAccount.info" />
          </Typography>
        </div>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={onSubmit}>
          <BankAccountForm {...props} />
        </Formik>
      </LoadingContainer>
    </div>
  );
};

export const BankAccountForm: React.FC<ConfigureBankAccountProps> = (
  props: ConfigureBankAccountProps,
) => {
  const { formatMessage } = useIntl();

  const { value, hasError, helperText, formik } = useField({ name: 'bank' });

  useEffect(() => {
    formik.setSubmitting(props.readonly);
  }, [props.readonly]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className="my-4 flex justify-end">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => formik.setSubmitting(false)}
            startIcon={<Pencil />}>
            <FormattedMessage id="professionalProfile.button.edit" />
          </Button>
        </div>
      </Grid>

      <Grid item xs={12} sm={7} lg={8}>
        <TextField
          name="holderName"
          label={formatMessage({
            id: 'configureBankAccount.field.legalName.label',
          })}
        />
      </Grid>

      <Grid item xs={12} sm={5} lg={4}>
        <DocumentNumberTextField
          name="documentNumber"
          label={formatMessage({
            id: 'configureBankAccount.field.documentNumber.label',
          })}
        />
      </Grid>

      <Grid item xs={12} sm={6} lg={6}>
        <Autocomplete
          options={banks}
          getOptionLabel={(option) => `${option.Code} - ${option.Name}`}
          value={banks.find((bank) => bank.Code === value) ?? null}
          disabled={formik.isSubmitting}
          getOptionSelected={(option, selected) => {
            return option.Code === selected?.Code;
          }}
          onChange={(_: any, bank: typeof banks[0] | null) => {
            formik.setFieldValue('bank', bank?.Code);
          }}
          noOptionsText={formatMessage({ id: 'loadingContainer.empty' })}
          renderInput={(inputProps) => (
            <TextField
              {...inputProps}
              name="bank"
              error={hasError}
              onBlur={formik.handleBlur}
              helperText={helperText}
              label={formatMessage({
                id: 'configureBankAccount.field.bankCode.label',
              })}
            />
          )}
        />
      </Grid>

      <Grid item xs={9} sm={4} lg={4}>
        <TextField
          name="agency"
          label={formatMessage({
            id: 'configureBankAccount.field.agency.label',
          })}
        />
      </Grid>

      <Grid item xs={3} sm={2} lg={2}>
        <TextField
          name="agencyDigit"
          label={formatMessage({
            id: 'configureBankAccount.field.agencyDigit.label',
          })}
        />
      </Grid>

      <Grid item xs={12} sm={6} lg={6}>
        <Select
          name="accountType"
          label={formatMessage({
            id: 'configureBankAccount.field.type.label',
          })}
          options={Object.values(BankAccountTypes).map((type) => ({
            value: type,
            label: formatMessage({
              id: `bankAccountTypes.${type}`,
            }),
          }))}
        />
      </Grid>

      <Grid item xs={9} sm={4} lg={4}>
        <TextField
          name="account"
          label={formatMessage({
            id: 'configureBankAccount.field.account.label',
          })}
        />
      </Grid>

      <Grid item xs={3} sm={2} lg={2}>
        <TextField
          name="accountDigit"
          label={formatMessage({
            id: 'configureBankAccount.field.accountDigit.label',
          })}
        />
      </Grid>

      <Grid container item justify="flex-end">
        <Button
          size="large"
          disabled={formik.isSubmitting}
          style={{ marginRight: 16 }}
          onClick={() => {
            formik.resetForm();
            formik.setSubmitting(true);
          }}>
          {formatMessage({ id: 'configureBankAccount.button.cancel.label' })}
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={formik.isSubmitting}
          onClick={() => formik.handleSubmit()}>
          {formatMessage({ id: 'configureBankAccount.button.submit.label' })}
        </Button>
      </Grid>
    </Grid>
  );
};
