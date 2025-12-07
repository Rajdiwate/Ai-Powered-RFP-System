import { AppRouter } from '@/router';
import { Slide, ToastContainer } from 'react-toastify';
import { useAppSelector } from '@/hooks/reduxHooks';
import { allApis } from '@/store';
import { Loader } from '@/components/organisms';

export const App = () => {
  const globalLoading = allApis.reduce((acc, api) => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const apiState = useAppSelector((state) => state[api.reducerPath]);
    return (
      acc ||
      Object.values(apiState.queries).some((q) => q?.status === 'pending') ||
      Object.values(apiState.mutations).some((q) => q?.status === 'pending')
    );
  }, false);

  return (
    <main style={{ backgroundColor: '#efececff', width: '100vw', height: '100vh' }}>
      <section
        style={{
          backgroundColor: '#FCFCFC',
          padding: '1rem',
          maxWidth: '1920px',
          margin: '0 auto',
        }}
      >
        <AppRouter />
      </section>
      <ToastContainer position='bottom-right' autoClose={4000} transition={Slide} theme='light' />
      <Loader open={globalLoading} />
    </main>
  );
};
