import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Container, Typography, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, SvgIcon, Menu, MenuItem, Divider } from '@mui/material';
import Image from 'next/image';

const HomeIcon = () => (
  <SvgIcon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </SvgIcon>
);

const ChatIcon = () => (
  <SvgIcon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </SvgIcon>
);

const PlanIcon = () => (
  <SvgIcon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </SvgIcon>
);

const ProfileIcon = () => (
  <SvgIcon>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </SvgIcon>
);

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
    handleClose();
  };

  const navItems = [
    { name: 'Home', href: '/', icon: <HomeIcon /> },
    { name: 'Chat', href: '/chat', icon: <ChatIcon /> },
    { name: 'Plans', href: '/plans', icon: <PlanIcon /> },
    { name: 'Progress', href: '/progress/analysis', icon: <SvgIcon>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </SvgIcon> },
    { name: 'Profile', href: '/profile', icon: <ProfileIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                <Image 
                  src="/assets/images/fitmind-logo.svg" 
                  alt="FitMind Coach Logo" 
                  width={40} 
                  height={40} 
                  priority
                />
              </Box>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                FitMind Coach
              </Typography>
            </Link>
            
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
              <Box sx={{ ml: 2 }}>
                <IconButton
                  size="small"
                  id="user-menu-button"
                  aria-controls={open ? 'user-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  sx={{ p: 0 }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>U</Typography>
                  </Avatar>
                </IconButton>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'user-menu-button',
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => { router.push('/profile'); handleClose(); }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { router.push('/plans'); handleClose(); }}>
                    Plans
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 80,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 80,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 2
            },
          }}
        >
          <List sx={{ width: '100%', mt: 2 }}>
            {navItems.map((item) => {
              // Check if the current path matches the nav item exactly or starts with the nav item path
              // Special case for Progress section to highlight for all /progress/* routes
              const isActive = 
                pathname === item.href || 
                (item.href.includes('/progress') && pathname?.startsWith('/progress'));
              return (
                <ListItem 
                  key={item.name} 
                  component={Link} 
                  href={item.href}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 1.5,
                    px: 2,
                    borderRadius: 1,
                    mb: 2,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    bgcolor: isActive ? 'primary.light' : 'transparent',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'primary.main'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 'auto', color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <Typography variant="caption" sx={{ mt: 0.5 }}>
                    {item.name}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Container maxWidth="lg">{children}</Container>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
