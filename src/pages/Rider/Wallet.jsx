import React, { useState } from 'react';
import { useGlobalStore } from '../../context/GlobalStore.jsx';
import { Card, CardContent, Typography, Box, TextField, Button } from '@mui/material';

export default function Wallet() {
  const { wallet, addToWallet, withdrawFromWallet } = useGlobalStore();
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    const val = Number(amount);
    if (!val || val <= 0) return alert('Enter valid amount');
    addToWallet(val);
    setAmount('');
  };

  const handleWithdraw = () => {
    const val = Number(amount);
    if (!val || val <= 0) return alert('Enter valid amount');
    if (val > wallet.balance) return alert('Insufficient balance');
    withdrawFromWallet(val);
    setAmount('');
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Your Wallet</Typography>
          <Typography variant="h4" color="primary" gutterBottom>₹{wallet.balance.toFixed(2)}</Typography>

          <Box className="flex items-center gap-3 mt-4">
            <TextField
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
            />
            <Button variant="contained" color="primary" onClick={handleAdd}>Add</Button>
            <Button variant="outlined" color="secondary" onClick={handleWithdraw}>Withdraw</Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
