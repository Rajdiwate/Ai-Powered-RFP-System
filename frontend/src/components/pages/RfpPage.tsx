import { useState } from 'react';
import { RfpForm } from '@/components/organisms/RfpForm';
import { VendorList } from '@/components/organisms/VendorList';
import { ProposalEvaluation } from '@/components/organisms/ProposalEvaluation';
import { RfpList } from '@/components/organisms/RfpList';
import {
  Container,
  Box,
  Typography,
  Stack,
  Drawer,
  AppBar,
  Toolbar,
  Paper,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

export const RfpPage = () => {
  const [currentRfpId, setCurrentRfpId] = useState<string | null>(null);
  const [evaluatingRfpId, setEvaluatingRfpId] = useState<string | null>(null);

  const handleRfpCreated = (id: string) => {
    // Optionally refresh list or set selected, list auto-updates via RTK tags
    console.log('RFP Created:', id);
  };

  const handleSelectRfpForNotify = (id: string) => {
    setCurrentRfpId(id);
  };

  const handleViewProposals = (id: string) => {
    setEvaluatingRfpId(id);
  };

  const closeDrawer = () => {
    setEvaluatingRfpId(null);
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100%'}}>
      <AppBar
        position='static'
        color='transparent'
        elevation={0}
      >
        <Toolbar>
          <Typography
            variant='h3'
            sx={{ fontWeight: 'bold' }}
            color='primary'
          >
            AI RFP Manager
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth='xl' sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          {/* Left Column: Create & List */}
          <Box flex={{ xs: '1 1 auto', md: '0 0 40%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Create RFP Section */}
              <RfpForm onRfpCreated={handleRfpCreated} />

              {/* RFP List Section */}
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold', px: 2, pt: 1 }}>
                  Your RFPs
                </Typography>
                <RfpList
                  onSelectRfp={handleSelectRfpForNotify}
                  onViewProposals={handleViewProposals}
                  selectedRfpId={currentRfpId}
                />
              </Paper>
            </Box>
          </Box>

          {/* Right Column: Vendor Management (Contextual) */}
          <Box flex={{ xs: '1 1 auto', md: '1 1 auto' }}>
            <Box>
              <Box mb={2}>
                <Typography variant='h5' fontWeight='bold'>
                  Vendor Management
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {currentRfpId
                    ? 'Select vendors below to notify them about the selected RFP.'
                    : 'Select an RFP from the list to start notifying vendors.'}
                </Typography>
              </Box>
              <VendorList rfpId={currentRfpId} />
            </Box>
          </Box>
        </Stack>
      </Container>

      {/* Proposal Evaluation Drawer */}
      <Drawer
        anchor='right'
        open={!!evaluatingRfpId}
        onClose={closeDrawer}
        PaperProps={{
          sx: { width: { xs: '100%', md: 600, lg: 800 }, p: 3, bgcolor: '#f8f9fa' },
        }}
      >
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Typography variant='h5' fontWeight='bold'>
            Proposal Analysis
          </Typography>
          <IconButton onClick={closeDrawer}>
            <Close />
          </IconButton>
        </Box>
        {evaluatingRfpId && <ProposalEvaluation rfpId={evaluatingRfpId} />}
      </Drawer>
    </Box>
  );
};
