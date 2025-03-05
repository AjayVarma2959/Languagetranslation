
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import AudioRecorder from './AudioRecorder'; 

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AudioRecorder />
    </ThemeProvider>
  );
}

export default App; 