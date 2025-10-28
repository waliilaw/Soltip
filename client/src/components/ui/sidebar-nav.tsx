import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { 
  HomeOutlined, 
  UserOutlined, 
  LineChartOutlined, 
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  DollarOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalBody, 
  ModalFooter 
} from '@/components/ui/modal';
import { NotificationTrigger } from '@/components/notifications';
import { UserNotification } from '@/components/notifications/NotificationTypes';
import { useUser } from '@/contexts/UserContext';
import { message } from 'antd';
import { DevModeBanner } from './DevModeBanner';

interface SidebarNavProps {
  username?: string;
  profileImage?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ 
  username = 'username',
  profileImage 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([
    {
      id: '1',
      type: 'tip',
      title: 'New tip received!',
      message: 'You received $10.00 from @cryptolover',
      amount: '$10.00',
      timestamp: '2025-04-11T10:30:00Z',
      read: false
    },
    {
      id: '2',
      type: 'system',
      title: 'Profile verification',
      message: 'Your profile has been verified. You now have access to all features.',
      timestamp: '2025-04-10T15:45:20Z',
      read: false
    },
    {
      id: '3',
      type: 'promo',
      title: 'Limited time offer',
      message: 'Share your soltip tag with 5 friends to unlock premium features for 1 month.',
      timestamp: '2025-04-09T08:12:15Z',
      read: true
    }
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) {
      setActiveRoute('/dashboard');
    } else if (path.startsWith('/profile')) {
      setActiveRoute('/profile');
    } else if (path.startsWith('/analytics')) {
      setActiveRoute('/analytics');
    } else if (path.startsWith('/settings')) {
      setActiveRoute('/settings');
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (
        sidebar && 
        !sidebar.contains(event.target as Node) && 
        menuButton && 
        !menuButton.contains(event.target as Node) && 
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <HomeOutlined /> },
    { path: '/profile', label: 'Profile', icon: <UserOutlined /> },
    { path: '/dashboard?tab=analytics', label: 'Analytics', icon: <LineChartOutlined /> },
    { path: '/dashboard?tab=tips', label: 'Tips', icon: <DollarOutlined /> },
    { path: '/dashboard?tab=settings', label: 'Settings', icon: <SettingOutlined /> },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logged out successfully! 👋');
      setShowLogoutModal(false);
      navigate('/login');
    } catch (error) {
      message.error('Failed to logout. Please try again.');
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== id)
    );
  };

  const sidebarVariants = {
    open: { 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: { 
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: { opacity: 0.5 },
    closed: { opacity: 0 }
  };

  return (
    <>
      <DevModeBanner />
      <header className='border-b border-brand-border bg-brand-surface sticky top-0 z-20'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex justify-between items-center'>
            <div className="flex items-center space-x-2">
              <img src={logo} alt="soltip logo" className="h-12 w-auto" />
              <span className="text-xl font-bold">soltip</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <NotificationTrigger 
                id="user-notification-button"
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markNotificationAsRead}
                onMarkAllAsRead={markAllNotificationsAsRead}
                onDelete={deleteNotification}
                position="right"
              />
              
              <Button
                id='menu-button'
                variant='ghost'
                size='icon'
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label='Toggle menu'
                className='rounded-full'
              >
                <MenuOutlined />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            className='fixed inset-0 bg-black z-30'
            initial='closed'
            animate='open'
            exit='closed'
            variants={overlayVariants}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            id='sidebar'
            className='fixed top-0 left-0 h-full w-64 bg-brand-surface z-40 border-r border-brand-border shadow-xl'
            initial='closed'
            animate='open'
            exit='closed'
            variants={sidebarVariants}
          >
            <div className='flex flex-col h-full'>
              <div className='p-4 border-b border-brand-border flex justify-between items-center'>
                <h2 className='text-xl font-bold text-brand-primary'>Menu</h2>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label='Close menu'
                  className='rounded-full'
                >
                  <CloseOutlined />
                </Button>
              </div>

              <div className='p-4 border-b border-brand-border'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary'>
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt={username} 
                        className='w-full h-full rounded-full object-cover' 
                      />
                    ) : (
                      <UserOutlined style={{ fontSize: '1.2rem' }} />
                    )}
                  </div>
                  <div>
                    <div className='font-medium'>@{username}</div>
                    <Link 
                      to='/profile' 
                      className='text-xs text-brand-primary hover:underline'
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>

              <nav className='flex-1 overflow-y-auto p-4'>
                <ul className='space-y-2'>
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Button
                        variant={activeRoute === item.path.split('?')[0] ? 'default' : 'ghost'}
                        onClick={() => handleNavigation(item.path)}
                        fullWidth={true}
                        className='justify-start text-left'
                        icon={item.icon}
                      >
                        {item.label}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className='p-4 border-t border-brand-border space-y-2'>
                <Button
                  variant='ghost'
                  fullWidth={true}
                  className='justify-start'
                  icon={<QuestionCircleOutlined />}
                  onClick={() => handleNavigation('/faq')}
                >
                  Help & FAQ
                </Button>
                <Button
                  variant='ghost'
                  fullWidth={true}
                  className='justify-start text-red-500 hover:text-red-600'
                  icon={<LogoutOutlined />}
                  onClick={() => setShowLogoutModal(true)}
                >
                  Logout
                </Button>
              </div>

              <div className='p-4 text-center text-xs text-brand-muted-foreground'>
                &copy; {new Date().getFullYear()} soltip
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <Modal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Confirm Logout</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to logout from your soltip account?</p>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowLogoutModal(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};