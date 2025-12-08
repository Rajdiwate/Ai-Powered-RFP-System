import { useEvaluateProposalsQuery } from '@/store/rfpApi';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  LinearProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material';

interface ProposalEvaluationProps {
  rfpId: string | null;
}

export const ProposalEvaluation = ({ rfpId }: ProposalEvaluationProps) => {
  const { data, isLoading } = useEvaluateProposalsQuery(rfpId || '', {
    skip: !rfpId,
    pollingInterval: rfpId ? 5000 : 0, // Poll every 5s for demo purposes
  });

  if (!rfpId) {
    return null;
  }

  if (isLoading) {
    return (
      <Box display='flex' flexDirection='column' alignItems='center' p={4} gap={2}>
        <CircularProgress />
        <Typography variant='caption' color='text.secondary'>
          Analyzing proposals with AI...
        </Typography>
      </Box>
    );
  }

  if (!data || data.evaluations.length === 0) {
    return (
      <Box mt={4}>
        <Alert severity='info' icon={<CircularProgress size={20} />}>
          Waiting for proposals... (Auto-refreshing)
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant='h5' component='h2' gutterBottom sx={{ fontWeight: 'bold' }}>
        Proposal Evaluations & AI Recommendation
      </Typography>

      {/* Summary Section */}
      <Card sx={{ mb: 4, bgcolor: 'primary.main', color: 'primary.contrastText', boxShadow: 3 }}>
        <CardContent>
          <Typography variant='h6' gutterBottom fontWeight='bold'>
            Executive Summary
          </Typography>
          <Typography variant='body1' sx={{ opacity: 0.9 }}>
            {data.summary}
          </Typography>
        </CardContent>
      </Card>

      {/* Evaluations List */}
      <Stack spacing={2}>
        {data.evaluations.map((evaluation, index) => (
          <Card
            key={index}
            variant='outlined'
            sx={{
              borderColor: evaluation.recommendation.toLowerCase().includes('recommend')
                ? 'success.main'
                : 'divider',
              borderWidth: evaluation.recommendation.toLowerCase().includes('recommend') ? 2 : 1,
            }}
          >
            <CardContent>
              <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                <Typography variant='h6' fontWeight='bold'>
                  {evaluation.vendor}
                </Typography>
                <Box display='flex' alignItems='center' gap={1}>
                  <CircularProgress
                    variant='determinate'
                    value={evaluation.score}
                    color={
                      evaluation.score > 80
                        ? 'success'
                        : evaluation.score > 50
                          ? 'warning'
                          : 'error'
                    }
                    size={50}
                    thickness={4}
                  />
                  <Box position='relative'>
                    <Typography variant='h6' fontWeight='bold'>
                      {evaluation.score}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
                <Box flex={1}>
                  <Typography variant='caption' color='text.secondary'>
                    Pricing Score
                  </Typography>
                  <LinearProgress
                    variant='determinate'
                    value={evaluation.details.pricing}
                    color='primary'
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box flex={1}>
                  <Typography variant='caption' color='text.secondary'>
                    Terms Score
                  </Typography>
                  <LinearProgress
                    variant='determinate'
                    value={evaluation.details.terms}
                    color='secondary'
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box flex={1}>
                  <Typography variant='caption' color='text.secondary'>
                    Completeness Score
                  </Typography>
                  <LinearProgress
                    variant='determinate'
                    value={evaluation.details.completeness}
                    color='info'
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant='subtitle2' gutterBottom mt={1} color='text.primary'>
                AI Recommendation:
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ fontStyle: 'italic' }}>
                {evaluation.recommendation}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
