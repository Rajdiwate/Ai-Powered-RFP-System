import type { PropsWithChildren } from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const ThemedApp = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <ReduxProvider store={store}>
      <ThemedApp>{children}</ThemedApp>
    </ReduxProvider>
  );
};
