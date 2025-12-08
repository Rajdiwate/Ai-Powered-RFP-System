import { useGetRfpsQuery } from '@/store/rfpApi';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import { NotificationsActive, Assessment } from '@mui/icons-material';

interface RfpListProps {
  onSelectRfp: (rfpId: string) => void;
  onViewProposals: (rfpId: string) => void;
  selectedRfpId: string | null;
}

export const RfpList = ({ onSelectRfp, onViewProposals, selectedRfpId }: RfpListProps) => {
  const { data: rfps, isLoading } = useGetRfpsQuery();

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!rfps?.length) {
    return (
      <Typography color='text.secondary' align='center'>
        No RFPs found. Create one to get started!
      </Typography>
    );
  }

  return (
    <Paper elevation={0} variant='outlined' sx={{ maxHeight: 400, overflow: 'auto' }}>
      <List>
        {rfps.map((rfp) => (
          <ListItem
            key={rfp.id}
            disablePadding
            divider
            secondaryAction={
              <Box>
                <Tooltip title='Notify Vendors'>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRfp(rfp.id);
                    }}
                    color={selectedRfpId === rfp.id ? 'primary' : 'default'}
                  >
                    <NotificationsActive />
                  </IconButton>
                </Tooltip>
                <Tooltip title='View Proposals'>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProposals(rfp.id);
                    }}
                  >
                    <Assessment color='secondary' />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          >
            <ListItemButton selected={selectedRfpId === rfp.id} onClick={() => onSelectRfp(rfp.id)}>
              <ListItemText
                primary={
                  <Box display='flex' alignItems='center' gap={1}>
                    <Typography variant='subtitle1' fontWeight='medium'>
                      {rfp.title.substring(0, 30)}...
                    </Typography>
                    <Chip
                      label={`$${rfp.maxBudget}`}
                      size='small'
                      variant='outlined'
                      color='success'
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant='caption' display='block'>
                      {new Date(rfp.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' noWrap>
                      {rfp.requirements}
                    </Typography>
                  </>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
