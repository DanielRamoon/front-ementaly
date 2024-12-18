import {
  Button,
  CircularProgress,
  FormControl,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { ArrowRight, ContentSaveOutline } from 'mdi-material-ui';
import React, { useEffect, useState } from 'react';
import Scrollbar from 'react-custom-scrollbars';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import ReactGA from 'react-ga4';

import { PatientApi } from '../../apis';
import { IPatient } from '../../libs';
import { AnamneseSection } from '../../libs/IAnamnese';

interface IAnamnesisModal {
  userData?: IPatient;
  onClose: () => void;
}

const AnamnesisModal: React.FC<IAnamnesisModal> = ({ userData, onClose }) => {
  const [sectionPercentage, setSectionPercentage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [actualStep, setActualStep] = useState<number>(0);

  const { formatMessage } = useIntl();

  useEffect(() => {
    ReactGA.send('pageview');
  }, []);

  const [sections, setSections] = useState<AnamneseSection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAnamnesis = async () => {
    if (userData) {
      setIsLoading(true);

      await PatientApi.getAnamnese({ patient: userData.uuid })
        .then((res) => {
          setSections(res.sections);
          const fragmentPercentage: number = 100 / res.sections.length;
          setSectionPercentage(fragmentPercentage);
          setProgress(fragmentPercentage);
        })
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    getAnamnesis();
  }, []);

  const inputAditionalProps: any = {
    short: {},
    long: {
      multiline: true,
      rows: 3,
    },
  };

  const handleSubmit = () => {
    if (userData) {
      let questionsValues: Array<any> = [];

      sections.forEach((section) => {
        return section.questions
          .filter((question) => question.answer?.value !== undefined)
          .forEach((question) => {
            questionsValues = [
              ...questionsValues,
              {
                question: question.uuid,
                value: question.answer?.value,
              },
            ];
          });
      });

      const requestObj = {
        patient: userData.uuid,
        answers: questionsValues,
      };

      setIsLoading(true);
      PatientApi.saveAnamnese(requestObj)
        .then(() => {
          toast.success(formatMessage({ id: 'api.anamnese.save.success' }));
        })
        .catch(() =>
          toast.error(formatMessage({ id: 'api.anamnese.save.error' })),
        )
        .finally(() => setIsLoading(false));
    }
  };

  const nextPage = () => {
    setProgress((prevState) => prevState + sectionPercentage);
    setActualStep((prevState) => prevState + 1);
  };

  return (
    <section className="w-full relative">
      {isLoading && (
        <div className="absolute w-full h-full flex justify-center items-center bg-white z-10">
          <CircularProgress />
        </div>
      )}
      <div className="w-full p-4">
        <LinearProgress variant="determinate" value={progress} />
        <Scrollbar style={{ height: 72 }}>
          <div className="flex flex-nowrap">
            {sections.map((section, index) => (
              <button
                key={section.uuid}
                ref={(ref) => {
                  if (index === actualStep) {
                    ref?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-center px-6 py-4"
                type="button"
                onClick={() => {
                  setProgress(sectionPercentage * (index + 1));
                  setActualStep(index);
                }}>
                <strong
                  className={`text-sm whitespace-nowrap ${
                    index === actualStep ? 'text-primary' : 'text-gray-400'
                  }`}>
                  {section.title}
                </strong>
              </button>
            ))}
          </div>
        </Scrollbar>
        <div className="mt-4">
          <strong className="font-black text-2xl">
            {sections[actualStep]?.title}
          </strong>
        </div>
        <div className="flex flex-col gap-4 mt-4 w-full">
          {sections[actualStep]?.questions.map((question, indexQuestion) => (
            <div key={question.uuid}>
              <div className="mb-4">
                <strong className="text-sm block">{question.title}</strong>
                {question.helperText && (
                  <label className="text-xs block text-gray-400">
                    {question.helperText}
                  </label>
                )}
              </div>
              {question.type === 'select' ? (
                <FormControl className="w-full ">
                  <Select
                    className="w-full"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    variant="outlined"
                    value={question.answer?.value}
                    onChange={(event) => {
                      const anamnesisSectionTemp = sections;

                      anamnesisSectionTemp[actualStep].questions[
                        indexQuestion
                      ].answer = {
                        ...(question.answer || {}),
                        value: event.target.value as string,
                      };

                      setSections(anamnesisSectionTemp);
                    }}>
                    {question.items?.map((itemValue) => (
                      <MenuItem value={itemValue}>{itemValue}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  className="w-full"
                  variant="outlined"
                  id={`outlined-adornment-${question.order}`}
                  onChange={(event) => {
                    const anamnesisSectionTemp = sections;

                    anamnesisSectionTemp[actualStep].questions[
                      indexQuestion
                    ].answer = {
                      ...(question.answer || {}),
                      value: event.target.value,
                    };

                    setSections([...anamnesisSectionTemp]);
                  }}
                  aria-describedby={`component-error-${question.order}`}
                  value={question.answer?.value || ''}
                  {...inputAditionalProps[question.type]}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          {!sections[actualStep]?.isLast && (
            <Button
              color="primary"
              variant={sections[actualStep]?.isLast ? 'contained' : undefined}
              startIcon={<ContentSaveOutline />}
              size="large"
              onClick={() => handleSubmit()}>
              Salvar Alterações
            </Button>
          )}

          <Button
            color="primary"
            variant="contained"
            size="large"
            endIcon={
              sections[actualStep]?.isLast ? (
                <ContentSaveOutline />
              ) : (
                <ArrowRight />
              )
            }
            onClick={() => {
              if (sections[actualStep]?.isLast) {
                handleSubmit();
              } else {
                nextPage();
              }
            }}
            style={{
              marginLeft: 16,
            }}>
            {sections[actualStep]?.isLast ? 'Salvar Alterações' : 'Continuar'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AnamnesisModal;
