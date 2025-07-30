import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { accountsApi } from '../services/api';
import { Account, CreateAccountDto } from '../types';
import { formatCurrency, formatAccountType } from '../utils/formatters';

const accountTypes = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'investment', label: 'Investment' },
  { value: 'loan', label: 'Loan' },
];

const Accounts: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<CreateAccountDto>({
    defaultValues: {
      name: '',
      account_type: 'checking',
      balance: 0,
      opening_date: new Date().toISOString().split('T')[0],
    },
  });

  const watchAccountType = watch('account_type');

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: accountsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateAccountDto> }) =>
      accountsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: accountsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const handleOpenDialog = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      reset({
        name: account.name,
        account_type: account.account_type,
        balance: account.balance,
        opening_date: account.opening_date,
        credit_limit: account.credit_limit,
        bill_generation_date: account.bill_generation_date,
        last_payment_date: account.last_payment_date,
      });
    } else {
      setEditingAccount(null);
      reset({
        name: '',
        account_type: 'checking',
        balance: 0,
        opening_date: new Date().toISOString().split('T')[0],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAccount(null);
    reset();
  };

  const onSubmit = (data: CreateAccountDto) => {
    if (editingAccount) {
      updateMutation.mutate({ id: editingAccount.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Accounts</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Account
        </Button>
      </Box>

      <Grid container spacing={3}>
        {accounts?.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {account.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {formatAccountType(account.account_type)}
                    </Typography>
                    <Typography
                      variant="h5"
                      color={account.balance >= 0 ? 'success.main' : 'error.main'}
                      gutterBottom
                    >
                      {formatCurrency(account.balance)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Opened: {new Date(account.opening_date).toLocaleDateString()}
                    </Typography>
                    {account.account_type === 'credit_card' && (
                      <Box mt={1}>
                        {account.credit_limit && (
                          <Typography variant="caption" display="block">
                            Credit Limit: {formatCurrency(account.credit_limit)}
                          </Typography>
                        )}
                        {account.bill_generation_date && (
                          <Typography variant="caption" display="block">
                            Bill Date: {account.bill_generation_date}th of month
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(account)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(account.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Account Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingAccount ? 'Edit Account' : 'Add Account'}
          </DialogTitle>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Account name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Account Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="account_type"
              control={control}
              rules={{ required: 'Account type is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Account Type"
                  fullWidth
                  margin="normal"
                  error={!!errors.account_type}
                  helperText={errors.account_type?.message}
                >
                  {accountTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="balance"
              control={control}
              rules={{ required: 'Balance is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Initial Balance"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.balance}
                  helperText={errors.balance?.message}
                />
              )}
            />

            <Controller
              name="opening_date"
              control={control}
              rules={{ required: 'Opening date is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Opening Date"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.opening_date}
                  helperText={errors.opening_date?.message}
                />
              )}
            />

            {watchAccountType === 'credit_card' && (
              <>
                <Controller
                  name="credit_limit"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Credit Limit"
                      type="number"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />

                <Controller
                  name="bill_generation_date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Bill Generation Date (Day of Month)"
                      type="number"
                      fullWidth
                      margin="normal"
                      inputProps={{ min: 1, max: 31 }}
                    />
                  )}
                />

                <Controller
                  name="last_payment_date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Payment Date"
                      type="date"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingAccount ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Accounts;