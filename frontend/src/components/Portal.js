import { 
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Link
} from '@mui/material';
import {
  School as ProfileIcon,
  CurrencyRupee as PaymentIcon,
  Badge as GatePassIcon,
  Handyman as ServicesIcon,
  Forum as ComplaintsIcon,
  Download as DownloadsIcon,
  Description as DocumentsIcon,
  Report as IncidentsIcon,
  Help as HelpIcon
} from '@mui/icons-material';

const menuItems = [
  { title: 'PROFILE', icon: <ProfileIcon />, path: '/profile', color: '#fff' },
  { title: 'PAYMENTS', icon: <PaymentIcon />, path: '/payments', color: '#fff' },
  { title: 'GATE PASS', icon: <GatePassIcon />, path: '/gate-pass', color: '#fff' },
  { title: 'SERVICES', icon: <ServicesIcon />, path: '/services', color: '#fff' },
  { title: 'COMPLAINTS', icon: <ComplaintsIcon />, path: '/complaints', color: '#fff' },
  { title: 'DOWNLOADS', icon: <DownloadsIcon />, path: '/downloads', color: '#fff' },
  { title: 'Documents', icon: <DocumentsIcon />, path: '/documents', color: '#fff' },
  { title: 'INCIDENTS', icon: <IncidentsIcon />, path: '/incidents', color: '#fff' }
];

const Portal = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        py: 1.5,
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 1
      }}>
        <Typography variant="h6" sx={{ fontWeight: 400 }}>
          Student Portal (Beta)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>Bikrant Pandit</Typography>
          <IconButton size="small" sx={{ color: 'primary.contrastText', ml: 1 }}>
            <ProfileIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 1 }}>
            <Link href="/" underline="none" sx={{ color: 'text.secondary' }}>Home</Link>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'primary.main',
              mb: 3,
              fontWeight: 400
            }}
          >
            Welcome! Bikrant Pandit( CH.EN.U4CSE22075 )
          </Typography>
          
          <Card sx={{ 
            mb: 4,
            boxShadow: 1,
            borderRadius: 1
          }}>
            <CardContent sx={{ display: 'flex', gap: 3, p: 4 }}>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body1"
                  sx={{ 
                    color: 'text.primary',
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    mb: 2
                  }}
                >
                  "Youngsters need to understand the real purpose of life. They need courage and wisdom to face the challenges of life. Only with that understanding they can become the light of the world. If we care for them responsibly and mold their whole character with love, then the future of the world will be safe"
                </Typography>
                <Typography sx={{ color: 'primary.main' }}>
                  — Amma
                </Typography>
              </Box>
              <Box 
                component="img"
                src="/amma.jpg"
                alt="Amma"
                sx={{ 
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  border: 3,
                  borderColor: 'background.paper',
                  boxShadow: 1
                }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Menu Grid */}
        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  borderRadius: 1,
                  transition: '0.2s',
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2
                }}>
                  <Typography sx={{ 
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: 'text.primary'
                  }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ 
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                    p: 1,
                    display: 'flex'
                  }}>
                    {item.icon}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Alerts Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ 
            color: 'primary.main',
            mb: 2,
            fontWeight: 400
          }}>
            Alerts
          </Typography>
          <Card sx={{ 
            boxShadow: 1,
            borderRadius: 1
          }}>
            <CardContent sx={{ p: '12px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HelpIcon sx={{ color: 'primary.main' }} />
                <Typography sx={{ color: 'text.secondary' }}>
                  Payment Help Document
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Portal; 