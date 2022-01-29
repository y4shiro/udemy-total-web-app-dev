import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Chip,
  Container,
  Grid,
  InputLabel,
  Paper,
  TextField,
  makeStyles,
} from '@material-ui/core';
import { Done as DoneIcon, Delete as DeleteIcon } from '@material-ui/icons';

import dayjs from 'dayjs';
import { IFacility } from '../models/IFacility';

const useStyle = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(1),
  },
  rightActions: {
    textAlign: 'right',
  },
  cancelButton: {
    color: theme.palette.error.main,
  },
}));

const initFacility: IFacility = {
  id: '',
  name: 'name の初期値',
  note: 'note の初期値',
  system: {
    createDate: new Date(),
    createUser: {
      displayName: 'ebihara kenji',
      email: '',
      face: 'https://img.icons8.com/color/48/000000/human-head.png',
    },
    lastUpdateUser: {
      displayName: 'ebihara kenji',
      email: '',
      face: 'https://img.icons8.com/color/48/000000/human-head.png',
    },
    lastUpdate: new Date(),
  },
};

export const Facility: React.VFC = () => {
  const style = useStyle();
  const [facility, setFacility] = useState(initFacility);
  const { system } = initFacility;

  return (
    <Container maxWidth="sm" className={style.root}>
      <Paper className={style.paper}>
        <TextField label="設備名" fullWidth value={facility.name} />
        <TextField label="詳細" fullWidth multiline value={facility.note} />
        <InputLabel shrink>登録者</InputLabel>
        <p>
          <Chip
            label={system.createUser.displayName}
            avatar={<Avatar src={system.createUser.face} />}
          ></Chip>
          {dayjs(new Date()).format('YYYY-MM-DD HH:mm')}
        </p>
        <InputLabel shrink>更新者</InputLabel>
        <p>
          <Chip
            label={system.lastUpdateUser.displayName}
            avatar={<Avatar src={system.createUser.face} />}
          ></Chip>
          {dayjs(new Date()).format('YYYY-MM-DD HH:mm')}
        </p>
        <Grid container>
          <Grid item xs={6}>
            <Button className={style.cancelButton} startIcon={<DeleteIcon />}>
              削除
            </Button>
          </Grid>
          <Grid item xs={6} className={style.rightActions}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DoneIcon />}
            >
              保存
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};
