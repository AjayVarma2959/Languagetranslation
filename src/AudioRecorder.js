import { useState, useRef } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Paper,
  Container,
  Stack,
  AppBar,
  Toolbar,
  Fade,
  Link,
  Button,
  Alert,
  Snackbar,
  Modal,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import LanguageIcon from '@mui/icons-material/Language';

const languageOptions = [
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'bn-IN', label: 'Bengali' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'ml-IN', label: 'Malayalam' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'od-IN', label: 'Odia' },
  { code: 'pa-IN', label: 'Punjabi' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'en-IN', label: 'English' },
  { code: 'gu-IN', label: 'Gujarati' },
];

const LoadingSpinner = () => (
  <Modal
    open={true}
    aria-labelledby="loading-modal"
    aria-describedby="loading-modal-description"
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      
      <Box
        sx={{
          position: 'relative',
          width: '200px',
          height: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
       
        {[...Array(3)].map((_, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              border: '4px solid transparent',
              borderRadius: '50%',
              animation: `spin${index + 1} 2s linear infinite`,
              borderTopColor: index === 0 ? '#2196F3' : 
                             index === 1 ? '#00BCD4' : '#4CAF50',
              '@keyframes spin1': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
              '@keyframes spin2': {
                '0%': { transform: 'rotate(120deg)' },
                '100%': { transform: 'rotate(480deg)' },
              },
              '@keyframes spin3': {
                '0%': { transform: 'rotate(240deg)' },
                '100%': { transform: 'rotate(600deg)' },
              },
            }}
          />
        ))}

       
        <Box
          sx={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#2196F3',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(0.8)', opacity: 0.5 },
              '50%': { transform: 'scale(1)', opacity: 1 },
              '100%': { transform: 'scale(0.8)', opacity: 0.5 },
            },
          }}
        />
      </Box>

      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 600,
            mb: 2,
            animation: 'fadeInOut 2s ease-in-out infinite',
            '@keyframes fadeInOut': {
              '0%, 100%': { opacity: 0.5 },
              '50%': { opacity: 1 },
            },
          }}
        >
          Processing Your Audio
        </Typography>

      
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {['Converting', 'Translating', 'Generating'].map((step, index) => (
            <Typography
              key={step}
              sx={{
                color: '#2196F3',
                fontSize: '0.9rem',
                opacity: 0.8,
                animation: `bounce 0.6s ease-in-out infinite ${index * 0.2}s`,
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' },
                },
              }}
            >
              {step}
            </Typography>
          ))}
        </Box>
      </Box>

      
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mt: 4,
          justifyContent: 'center',
        }}
      >
        {[...Array(8)].map((_, index) => (
          <Box
            key={index}
            sx={{
              width: '4px',
              height: '30px',
              backgroundColor: '#2196F3',
              animation: `audioWave 1s ease-in-out infinite ${index * 0.1}s`,
              '@keyframes audioWave': {
                '0%, 100%': { height: '30px' },
                '50%': { height: '60px' },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  </Modal>
);

const AudioWaveform = ({ isRecording }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0.5,
        height: 50,
        mb: 2
      }}
    >
      {[...Array(10)].map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 4,
            height: isRecording ? '100%' : 20,
            backgroundColor: 'primary.main',
            animation: isRecording
              ? `pulse 0.5s ease-in-out infinite alternate ${i * 0.1}s`
              : 'none',
            '@keyframes pulse': {
              '0%': {
                height: '20%',
              },
              '100%': {
                height: '100%',
              },
            },
          }}
        />
      ))}
    </Box>
  );
};

const AudioRecorder = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [translation, setTranslation] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [outputAudioURL, setOutputAudioURL] = useState('');

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const startRecording = async () => {
    // Reset previous results
    setSubmissionResult(null);
    setTranslation('');
    setOutputAudioURL('');
    setAudioURL('');
    setAudioBlob(null);

    if (!selectedLanguage) {
      setError('Please select a language before recording.');
      setShowError(true);
      return; // Don't start recording if no language is selected
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      setError('Error accessing microphone. Please ensure microphone permissions are granted.');
      setShowError(true);
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = async () => {
    if (!selectedLanguage || !audioBlob) {
      setError('Please select a language and record audio first');
      setShowError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('languageCode', selectedLanguage);

      const response = await fetch('https://saravam.onrender.com/process-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const result = await response.json();
      setSubmissionResult(result);
      setTranslation(result.englishText);
      setOutputAudioURL(result.outputAudioUrl);
    } catch (error) {
      setError('Failed to process audio. Please try again.');
      setShowError(true);
      console.error('Error submitting audio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
      {isSubmitting && <LoadingSpinner />}
      
      <AppBar position="static" sx={{
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
      }}>
        <Toolbar>
          <GraphicEqIcon sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h5" component="div" sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            letterSpacing: 1.2
          }}>
            Audio Translator
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 4,
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
            }}
          />

          <Stack spacing={4}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 1
                }}
              >
                Audio Translator
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
              >
                Record your audio in multiple languages and translate 
              </Typography>
            </Box>

            <FormControl fullWidth>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LanguageIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                  }}
                >
                  Select Language
                </Typography>
              </Box>
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                    borderWidth: 2,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select a language
                </MenuItem>
                {languageOptions.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ textAlign: 'center' }}>
              <AudioWaveform isRecording={isRecording} />
              <IconButton
                onClick={isRecording ? stopRecording : startRecording}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: isRecording ? 'error.main' : 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: isRecording ? 'error.dark' : 'primary.dark',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isRecording ? (
                  <StopIcon sx={{ fontSize: 40 }} />
                ) : (
                  <MicIcon sx={{ fontSize: 40 }} />
                )}
              </IconButton>
              <Typography
                variant="body1"
                sx={{
                  mt: 2,
                  color: isRecording ? 'error.main' : 'text.secondary',
                  fontWeight: 500,
                }}
              >
                {isRecording ? 'Recording...' : 'Click to Record'}
              </Typography>
            </Box>

            {audioURL && (
              <Fade in={true}>
                <Box
                  sx={{
                    bgcolor: 'grey.50',
                    p: 3,
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: 'primary.light',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Recorded Audio
                  </Typography>
                  <audio
                    controls
                    src={audioURL}
                    style={{
                      width: '100%',
                      height: 50
                    }}
                  />
                </Box>
              </Fade>
            )}

            <Button
              variant="contained"
              size="large"
              disabled={!selectedLanguage || !audioURL || isSubmitting}
              onClick={handleSubmit}
              sx={{
                mt: 3,
                py: 1.5,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {isSubmitting ? 'Processing...' : 'Submit Recording'}
            </Button>

            {submissionResult && (
              <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Processing Results
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Selected Language:
                    </Typography>
                    <Typography>{languageOptions.find(lang => lang.code === selectedLanguage)?.label}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Recorded Audio:
                    </Typography>
                    <audio
                      controls
                      src={audioURL}
                      style={{
                        width: '100%',
                        height: 50
                      }}
                    />
                    <Link
                      href={audioURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      Open Recorded Audio in New Tab
                    </Link>
                  </Box>

                  {outputAudioURL && (
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Translated Audio:
                      </Typography>
                      <audio
                        controls
                        src={outputAudioURL}
                        style={{
                          width: '100%',
                          height: 50
                        }}
                      />
                      <Link
                        href={outputAudioURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'block', mt: 1 }}
                      >
                        Open Translated Audio in New Tab
                      </Link>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Translated Text:
                    </Typography>
                    <Typography>{translation}</Typography>
                  </Box>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Paper>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          <Link color="inherit" href="#">
            Audio Translator
          </Link>{' '}
          {new Date().getFullYear()}
        </Typography>
      </Box>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AudioRecorder;