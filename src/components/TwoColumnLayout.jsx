import React from 'react';
import { Box, Divider, useTheme, useMediaQuery } from '@mui/material';

const TwoColumnLayout = ({ leftContent, rightContent }) => {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        height: 'calc(100vh - 105px)',
        width: '100vw',
      }}
    >
      <Box
        sx={{
          flex: isSmallScreen ? 'none' : '0 0 30%',
          width: isSmallScreen ? '100%' : '30%',
          height: isSmallScreen ? '50%' : '100%',
          overflow: 'auto',
        }}
      >
        {leftContent}
      </Box>

      <Divider
        orientation={isSmallScreen ? 'horizontal' : 'vertical'}
        flexItem
      />

      <Box
        sx={{
          flex: isSmallScreen ? 'none' : '0 0 70%',
          width: isSmallScreen ? '100%' : '70%',
          height: isSmallScreen ? '50%' : '100%',
          overflow: 'auto',
        }}
      >
        {rightContent}
      </Box>
    </Box>
  );
};

export default TwoColumnLayout;
