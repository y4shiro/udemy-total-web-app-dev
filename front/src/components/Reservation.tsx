import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';

import {
  Avatar,
  Button,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@material-ui/core';
import { Done as DoneIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { DateTimePicker } from '@material-ui/pickers';

import { IReservation } from '../models/IReservation';
import { IFacility } from '../models/IFacility';

const initReservation: IReservation = {
  id: '001',
  facilityId: '001',
  subject: '目的01',
  description: '説明001',
  startDate: dayjs(),
  endDate: dayjs().add(1, 'hour'),
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

const dummyFacilities: IFacility[] = [
  {
    id: '01',
    name: '設備００１',
    // ダミーデータのため不必要なデータの定義は省略
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    system: {} as any,
    note: '',
  },
  {
    id: '02',
    name: '設備００２',
    // ダミーデータのため不必要なデータの定義は省略
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    system: {} as any,
    note: '',
  },
  {
    id: '03',
    name: '設備００３',
    // ダミーデータのため不必要なデータの定義は省略
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    system: {} as any,
    note: '',
  },
];

const useStyle = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    '& > div': {
      marginBottom: theme.spacing(2),
    },
  },
  rightActions: {
    textAlign: 'right',
  },
  cancelButton: {
    color: theme.palette.error.main,
  },
  userChip: {
    margin: theme.spacing(1),
  },
}));

export const Reservation: React.VFC = () => {
  const style = useStyle();
  const { system } = initReservation;
  const { errors, control } = useForm<IReservation>({
    defaultValues: initReservation,
    mode: 'onBlur',
  });

  const [facilities, setFacilities] = useState<IFacility[]>(dummyFacilities);
  const facilityMenuItems = useMemo(() => {
    return facilities.map((f) => (
      <MenuItem key={f.id} value={f.id}>
        {f.name}
      </MenuItem>
    ));
  }, [facilities]);

  return (
    <Container maxWidth="sm">
      <Paper className={style.paper}>
        <FormControl>
          <InputLabel id="facility-label">設備</InputLabel>
          <Controller
            name="facilityId"
            control={control}
            render={({ value, onChange }) => (
              <Select
                labelId="facility-label"
                value={value}
                onChange={onChange}
              >
                {facilityMenuItems}
              </Select>
            )}
          ></Controller>
        </FormControl>

        <div style={{ display: 'flex' }}>
          <Controller
            control={control}
            name="startDate"
            render={(data) => {
              return (
                <DateTimePicker
                  value={data.value}
                  onChange={data.onChange}
                  onBlur={data.onBlur}
                  label="開始時刻"
                  format="YYYY/MM/DD HH:mm"
                  ampm={false}
                  minutesStep={15}
                />
              );
            }}
          />
          〜
          <Controller
            control={control}
            name="endDate"
            render={(data) => {
              return (
                <DateTimePicker
                  value={data.value}
                  onChange={data.onChange}
                  onBlur={data.onBlur}
                  label="終了時刻"
                  format="YYYY/MM/DD HH:mm"
                  ampm={false}
                  minutesStep={15}
                />
              );
            }}
          />
        </div>

        <Controller
          control={control}
          name="subject"
          rules={{ required: true }}
          as={
            <TextField
              label="目的"
              fullWidth
              error={!!errors.subject}
              helperText={errors.subject ? '必須です' : ''}
            />
          }
        />

        <Controller
          control={control}
          name="description"
          rules={{ required: true }}
          as={
            <TextField
              label="詳細"
              fullWidth
              multiline
              error={!!errors.description}
              helperText={errors.description ? '必須です' : ''}
            />
          }
        />

        <InputLabel shrink>登録者</InputLabel>
        <Chip
          label={system.createUser.displayName}
          avatar={<Avatar src={system.createUser.face} />}
          className={style.userChip}
        ></Chip>
        {dayjs(new Date()).format('YYYY-MM-DD HH:mm')}

        <InputLabel shrink>更新者</InputLabel>
        <Chip
          label={system.lastUpdateUser.displayName}
          avatar={<Avatar src={system.createUser.face} />}
          className={style.userChip}
        ></Chip>
        {dayjs(new Date()).format('YYYY-MM-DD HH:mm')}

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
