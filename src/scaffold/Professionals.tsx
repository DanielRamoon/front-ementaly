import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ProfessionalApi } from '../apis/ProfessionalApi';
import { IProfessional } from '../libs';
import { LocalStorage } from '../services/LocalStorage';

interface ProfessionalsProps {}

export const Professionals: React.FC<ProfessionalsProps> = () => {
  const [professionals, setProfessionals] = useState<IProfessional[]>([]);

  const { formatMessage } = useIntl();

  const findProfessionals = async (): Promise<void> => {
    try {
      const linkedProfessionals = await ProfessionalApi.list({
        linked: true,
        page: 1,
        pageSize: 25,
      });

      setProfessionals(linkedProfessionals);
    } catch {
      toast.error(formatMessage({ id: 'professionals.error' }));
    }
  };

  useEffect(() => {
    const canHaveLinkedProfessionals = LocalStorage.getRoles().some(
      (permission) => permission === 'linkedProfessionals',
    );

    if (canHaveLinkedProfessionals) {
      findProfessionals();
    }
  }, []);

  if (!professionals.length) {
    return null;
  }

  return (
    <>
      <Box mx={4} mt={4} mb={1}>
        <Typography variant="caption">
          <b>MEUS PROFISSIONAIS</b>
        </Typography>
      </Box>

      <List style={{ padding: '0 16px' }}>
        {professionals.map((professional) => {
          return (
            <ListItem
              key={`professional-${professional.uuid}`}
              button
              onClick={() => {
                window.location.href = `/professional/profile/${professional.uuid}`;
              }}>
              <ListItemAvatar>
                <Avatar src={professional.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={professional.name}
                primaryTypographyProps={{
                  style: {
                    textOverflow: 'ellipsis',
                    fontWeight: 'bold',
                    overflow: 'hidden',
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
