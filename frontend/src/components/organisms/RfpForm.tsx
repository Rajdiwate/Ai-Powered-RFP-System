import { useState } from 'react';
import { useCreateRfpMutation } from '@/store/rfpApi';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

interface RfpFormProps {
  onRfpCreated: (rfpId: string) => void;
}

export const RfpForm = ({ onRfpCreated }: RfpFormProps) => {
  const [text, setText] = useState('');
  const [createRfp, { isLoading }] = useCreateRfpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const result = await createRfp({ text }).unwrap();
    toast.success('RFP Created Successfully!');
    onRfpCreated(result.id);
    setText('');
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography
        variant='h5'
        component='h2'
        gutterBottom
        sx={{ fontWeight: 'bold', color: 'primary.main' }}
      >
        Create New RFP
      </Typography>
      <Typography variant='body1' color='text.secondary' paragraph>
        Describe your requirements in natural language. Our AI will handle the rest.
      </Typography>
      <Box component='form' onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          multiline
          rows={6}
          label='Tell us what you need...'
          placeholder='E.g., I need 500 high-performance laptops for our engineering team, delivered by next month. Budget is around $1M.'
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          sx={{ mb: 3 }}
        />
        <Button
          type='submit'
          variant='contained'
          size='large'
          disabled={isLoading || !text.trim()}
          startIcon={isLoading ? <CircularProgress size={20} color='inherit' /> : null}
          fullWidth
        >
          {isLoading ? 'Processing...' : 'Generate RFP'}
        </Button>
      </Box>
    </Paper>
  );
};
