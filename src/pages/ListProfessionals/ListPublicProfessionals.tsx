import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import ReactGA from 'react-ga4';
import {
  Alert,
  ArrowRight,
  HumanCane,
  HumanMaleFemale,
  Magnify,
  StarCircle,
} from 'mdi-material-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { ExpertiseApi, ProfessionalApi } from '../../apis';
import { BoxWrapperDashboard, TitleDashboard } from '../../components';
import ModalWrapper from '../../components/ModalWrapper/ModalWrapper';
import { IExpertise, IFilterProfessionalsDTO, IProfessional } from '../../libs';
import { ProfessionalType } from '../../libs/IProfessionalType';
import { getProfessionalCertification } from '../../utils/getProfessionalCertification';
import { ProfessionalSmartSearchSuccess } from './ProfessionalSmartSearchSuccess';
import { ProfessionalsSmartSearch } from './ProfessionalsSmartSearch';
import { useListProfessionalsStyles } from './useListProfessionals';
import { WarningDangerDialog } from './WarningDangerDialog';

export const ListPublicProfessionals: React.FC = () => {
  const classes = useListProfessionalsStyles();

  const { formatMessage } = useIntl();
  const [rows, setRows] = useState<Array<IProfessional>>([]);

  const [filterExpertises, setFilterExpertises] = useState<
    IExpertise[] | undefined
  >();
  const counterPage = 20;
  const [limitList, setLimitList] = useState(counterPage);
  const [expertises, setExpertises] = useState<IExpertise[]>([]);
  const [filterName, setFilterName] = useState('');
  const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);
  const [smartSearchIsOpen, setSmartSearchIsOpen] = useState<boolean>(false);
  const [warningDialogIsOpen, setWarningDialogIsOpen] = useState<boolean>(
    false,
  );
  const [showSmartSearchSuccess, setShowSmartSearchSuccess] = useState<boolean>(
    false,
  );

  const [filtersProfessionalType, setFiltersProfessionalType] = useState<
    ProfessionalType[]
  >(['psychiatrist', 'psychologist']);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getAllProfessionals = useCallback(
    async (params: IFilterProfessionalsDTO) => {
      await ProfessionalApi.listPublic({
        ...params,
        actAs: params.actAs || filtersProfessionalType,
        pageSize: rowsPerPage,
        type: 'professional',
        random: true,
      }).then((res) => setRows(res));
    },
    [],
  );

  const getAllExpertises = useCallback(async () => {
    await ExpertiseApi.list().then((res) => setExpertises(res));
  }, []);

  const handleChangeFilterProfessionalType = useCallback(
    (type: ProfessionalType) => {
      if (filtersProfessionalType.includes(type)) {
        setFiltersProfessionalType(
          filtersProfessionalType.filter((filterType) => filterType !== type),
        );
      } else {
        setFiltersProfessionalType([...filtersProfessionalType, type]);
      }
    },
    [filtersProfessionalType],
  );

  const handleShowWarningDialog = useCallback(() => {
    setWarningDialogIsOpen(true);
  }, []);

  const handleFilterProfessional = useCallback(() => {
    console.log({ filterName });
    getAllProfessionals({
      page: 1,
      search: filterName,
      expertises:
        filterExpertises && filterExpertises.map((expertise) => expertise.uuid),
      actAs:
        filtersProfessionalType.length === 2 ? [] : filtersProfessionalType,
    });
  }, [filterExpertises, filtersProfessionalType, filterName]);

  useEffect(() => {
    getAllProfessionals({
      page: 1,
      actAs: [],
    });
    getAllExpertises();
  }, []);

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  return (
    <section className="h-full">
      <ModalWrapper
        open={warningDialogIsOpen}
        onClose={() => setWarningDialogIsOpen(false)}
        moreClass="md:w-7/12"
        title="">
        <WarningDangerDialog
          onClose={() => {
            setWarningDialogIsOpen(false);
            setTimeout(() => {
              setWarningDialogIsOpen(false);
            }, 500);
          }}
        />
      </ModalWrapper>
      <ModalWrapper
        open={smartSearchIsOpen}
        onClose={() => setSmartSearchIsOpen(false)}
        moreClass="md:w-7/12"
        title={
          showSmartSearchSuccess
            ? ''
            : formatMessage({ id: 'professionals.smart.search.title' })
        }>
        {showSmartSearchSuccess ? (
          <ProfessionalSmartSearchSuccess
            onClose={() => {
              setSmartSearchIsOpen(false);
              setTimeout(() => {
                setShowSmartSearchSuccess(false);
              }, 500);
            }}
          />
        ) : (
          <ProfessionalsSmartSearch
            onClose={() => setSmartSearchIsOpen(false)}
            onSearchSubmit={(actAs) => {
              setShowSmartSearchSuccess(true);
              getAllProfessionals({ page: 1, actAs });
            }}
          />
        )}
      </ModalWrapper>
      <TitleDashboard>
        <FormattedMessage id="listProfessionals.title" />
        <div className="flex gap-2e">
          <div className="mr-4">
            <Button
              variant="outlined"
              size="large"
              aria-label="alert"
              onClick={handleShowWarningDialog}
              className="mr-4"
              startIcon={<Alert />}>
              <FormattedMessage id="listProfessionals.button.warning" />
            </Button>
          </div>
          <Button
            onClick={() => setSmartSearchIsOpen(true)}
            variant="contained"
            size="large"
            color="primary"
            className="">
            <FormattedMessage id="listProfessionals.button.smart-search" />
          </Button>
        </div>
      </TitleDashboard>
      <BoxWrapperDashboard moreClass="xl:items-center xl:flex-col">
        <section id="filter" className="flex flex-wrap gap-3 w-11/12 py-5">
          <Autocomplete
            multiple
            id="tags-standard"
            options={expertises}
            open={isAutocompleteOpen}
            getOptionLabel={(option) => option.name}
            className="w-full xl:flex-1"
            value={filterExpertises}
            inputValue={filterName}
            onBlur={() => {
              setFilterName(filterName);

              setAutocompleteOpen(false);
            }}
            onInputChange={(_, value) => {
              if (value && !isAutocompleteOpen) {
                setAutocompleteOpen(true);
              }

              setFilterName(value);
            }}
            onChange={(_, value) => {
              setFilterExpertises(value as any);
            }}
            filterOptions={(options, params) => {
              if (!params.inputValue) return [];

              const matching = options.filter(
                (option) => option.name.match(params.inputValue) !== null,
              );

              if (matching.length) {
                return matching;
              }

              return [{ uuid: '', name: '' }];
            }}
            renderOption={(option) => {
              if (!option.uuid) {
                return (
                  <div
                    role="search"
                    className="w-full"
                    onClick={(event) => {
                      event.stopPropagation();

                      setAutocompleteOpen(false);
                    }}>
                    <div>
                      <Button
                        color="primary"
                        endIcon={<ArrowRight />}
                        style={{ marginBottom: 16 }}
                        onClick={() => {
                          setFiltersProfessionalType(['psychologist']);

                          getAllProfessionals({
                            page: 1,
                            actAs: ['psychologist'],
                          });
                        }}>
                        <FormattedMessage id="listProfessionals.button.psychologist" />
                      </Button>
                    </div>
                    <div>
                      <Button
                        color="primary"
                        endIcon={<ArrowRight />}
                        onClick={() => {
                          setFiltersProfessionalType(['psychiatrist']);

                          getAllProfessionals({
                            page: 1,
                            actAs: ['psychiatrist'],
                          });
                        }}>
                        <FormattedMessage id="listProfessionals.button.psychiatrist" />
                      </Button>
                    </div>
                  </div>
                );
              }

              return option.name;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={formatMessage({
                  id: 'listProfessionals.search.placeholder',
                })}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            )}
          />
          <div className="flex justify-between gap-3">
            <div className="flex items-center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filtersProfessionalType.includes('psychiatrist')}
                    onChange={() =>
                      handleChangeFilterProfessionalType('psychiatrist')
                    }
                    name="psychiatrist"
                    color="primary"
                  />
                }
                label={<FormattedMessage id="listProfessionals.psychiatrist" />}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filtersProfessionalType.includes('psychologist')}
                    onChange={() =>
                      handleChangeFilterProfessionalType('psychologist')
                    }
                    name="psychologist"
                    color="primary"
                  />
                }
                label={<FormattedMessage id="listProfessionals.psychologist" />}
              />
            </div>
          </div>
          <Button
            variant="outlined"
            size="small"
            onClick={handleFilterProfessional}
            color="primary">
            <FormattedMessage id="button.search" />
          </Button>
        </section>
        <section className="w-11/12 h-full bg-white py-5 rounded mt-8 justify-center">
          <TitleDashboard back={false}>
            <FormattedMessage id="listProfessionals.subtitle" />
          </TitleDashboard>
          {rows &&
            rows.slice(0, limitList).map((user) => (
              <div className="flex w-full flex-col xl:flex-row items-center border-b-2 border-gray-300 p-6">
                <div className="w-full xl:w-2/12 mr-5 flex flex-col items-center">
                  <Avatar
                    alt={user.name}
                    src={user.avatar}
                    className={classes.large}
                  />
                  <Link to={`/professional/public/profile/${user.uuid}`}>
                    <p className="text-primary text-center font-bold mt-6">
                      <FormattedMessage id="button.showProfile" />{' '}
                      <ArrowRight />
                    </p>
                  </Link>
                </div>
                <div className="w-full pt-3 xl:pt-0 xl:w-5/12 flex-col items-center">
                  <h5 className="text-gray-500 font-light text-base mb-2">
                    {user?.actAs?.map((act, index) => (
                      <>
                        {index > 0 && ' / '}
                        <FormattedMessage
                          id={`professionalProfile.professional.${act}`}
                          key={act}
                        />
                      </>
                    ))}
                    {user.status === 'verified' && (
                      <p className="font-bold text-primary mb-1 text-sm xl:mt-0 xl:ml-2">
                        <StarCircle fontSize="small" />
                        <FormattedMessage id="professionalProfile.checked" />
                      </p>
                    )}
                  </h5>
                  <h2 className="font-bold text-xl mb-2">{user.name}</h2>
                  <h4 className="text-gray-500 font-light text-base mb-2">
                    {getProfessionalCertification(user)}
                  </h4>
                  <h2 className="font-bold text-lg ">
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
                </div>
                <div className="w-full xl:w-4/12">
                  <p className="text-gray-500 font-light">
                    <FormattedMessage id="professionalProfile.amount" />
                  </p>
                  <h3 className="text-gray-600 font-black text-base mb-4">
                    <FormattedMessage id="txt.amountSymbol" />
                    {user.charges} / <FormattedMessage id="txt.hourText" />
                  </h3>

                  <h4 className="text-gray-500 ml-1 text-base">
                    <FormattedMessage id="professionalProfile.attendanceText" />
                  </h4>
                  {user.worksWith.map((work) => (
                    <span
                      className="flex mt-1 text-gray-500 items-center text-base"
                      key={work}>
                      {work === 'adult' && <HumanMaleFemale />}
                      {work === 'elderly' && <HumanCane />}
                      <FormattedMessage
                        id={`professionalProfile.attendance.${work}`}
                      />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          <div className="w-full flex items-center justify-center my-6">
            {rows.length > limitList && (
              <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={() => {
                  setLimitList(limitList + counterPage);
                }}>
                <FormattedMessage id="button.showMore" />
              </Button>
            )}
          </div>
        </section>
      </BoxWrapperDashboard>
    </section>
  );
};
