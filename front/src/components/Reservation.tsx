import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  getReservation,
  postReservation,
  putReservation,
} from '../controllers/reservationController';
import { useHistory, useParams } from 'react-router-dom';
import { getFacilities } from '../controllers/facilityController';

const initReservation = (): IReservation => ({
  id: '',
  facilityId: '',
  subject: '',
  description: '',
  startDate: dayjs().startOf('hour'),
  endDate: dayjs().add(1, 'hour').startOf('hour'),
  system: {
    createDate: new Date(),
    createUser: {
      displayName: '',
      email: '',
      face: '',
    },
    lastUpdateUser: {
      displayName: '',
      email: '',
      face: '',
    },
    lastUpdate: new Date(),
  },
});

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
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState(initReservation());
  const [facilities, setFacilities] = useState<IFacility[]>([]);
  const { system } = reservation;
  const { errors, control, reset, trigger, getValues } = useForm<IReservation>({
    defaultValues: reservation,
    mode: 'onBlur',
  });

  useEffect(() => {
    getFacilities().then((result) => {
      setFacilities(result);
    });
    if (!id) return;
    getReservation(id).then((result) => {
      setReservation(result);
      reset(result);
    });
  }, [id]);

  const facilityMenuItems = useMemo(() => {
    return facilities.map((f) => (
      <MenuItem key={f.id} value={f.id}>
        {f.name}
      </MenuItem>
    ));
  }, [facilities]);

  const history = useHistory();
  const onSave = useCallback(async () => {
    const result = await trigger();
    if (!result) return;
    const inputValue = { ...reservation, ...getValues() };

    if (!id) {
      // 新規作成
      const id = await postReservation(inputValue);
      history.replace(`/reservation/${id}`);
    } else {
      // 更新
      await putReservation(inputValue);
      window.location.reload();
    }
  }, [id, reservation, trigger, getValues]);

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
              onClick={onSave}
            >
              保存
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};
