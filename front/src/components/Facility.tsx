import React from 'react';
import {
  Avatar,
  Chip,
  Container,
  InputLabel,
  Paper,
  TextField,
  makeStyles,
} from '@material-ui/core';
import dayjs from 'dayjs';

const useStyle = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

export const Facility: React.VFC = () => {
  const style = useStyle();
  return (
    <Container maxWidth="sm" className={style.root}>
      <Paper className={style.paper}>
        <TextField label="設備名" fullWidth />
        <TextField label="詳細" fullWidth multiline />
        <InputLabel shrink>登録者</InputLabel>
        <p>
          <Chip label="登録者名" avatar={<Avatar />}></Chip>
          {dayjs(new Date()).format('YYYY-MM-DD HH:mm')}
        </p>
        <InputLabel shrink>更新者</InputLabel>
        <p>
          <Chip label="更新者名" avatar={<Avatar />}></Chip>
          {dayjs(new Date()).format('YYYY-MM-DD HH:mm')}
        </p>
      </Paper>
    </Container>
  );
};
