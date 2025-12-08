import { useGetAllVendorsQuery, useNotifyVendorMutation } from '@/store/rfpApi';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import { toast } from 'react-toastify';

interface VendorListProps {
  rfpId: string | null;
}

export const VendorList = ({ rfpId }: VendorListProps) => {
  const { data: vendors, isLoading } = useGetAllVendorsQuery();
  const [notifyVendor, { isLoading: isNotifying }] = useNotifyVendorMutation();

  const handleNotify = async (vendorId: string) => {
    if (!rfpId) {
      toast.warn('Please create or select an RFP first.');
      return;
    }

    try {
      await notifyVendor({ vendorId, rfpId }).unwrap();
      toast.success('Vendor notified successfully!');
    } catch (error) {
      console.error('Failed to notify vendor:', error);
    }
  };

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' p={4}>
        <CircularProgress />
      </Box>
    );
  }


  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant='h5' component='h2' gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Available Vendors
      </Typography>

      {!rfpId && (
        <Typography variant='body2' color='warning.main' sx={{ mb: 2 }}>
          Create an RFP to enable vendor notification.
        </Typography>
      )}

      <Stack direction='row' useFlexGap flexWrap='wrap' spacing={3}>
        {vendors?.map((vendor) => (
          <Box
            key={vendor.id}
            sx={{ width: { xs: '100%', md: 'calc(50% - 24px)', lg: 'calc(33.333% - 24px)' } }}
          >
            <Card
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': { elevation: 6, transform: 'translateY(-4px)' },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant='h6' gutterBottom>
                  {vendor.name}
                </Typography>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  {vendor.email}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {vendor.phone}
                </Typography>
                <Box mt={2}>
                  <Chip label='Trusted' size='small' color='success' variant='outlined' />
                </Box>
              </CardContent>
              <Divider />
              <CardActions sx={{ p: 2 }}>
                <Button
                  variant='outlined'
                  size='small'
                  fullWidth
                  onClick={() => handleNotify(vendor.id)}
                  disabled={!rfpId || isNotifying}
                >
                  Notify for RFP
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
