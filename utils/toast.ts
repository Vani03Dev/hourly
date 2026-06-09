import toast from 'react-hot-toast';

export const Toast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: '#0D9488', // Teal primary color
        color: '#fff',
        fontWeight: 'bold',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#0D9488',
      },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      style: {
        background: '#EF4444', // Red for errors
        color: '#fff',
        fontWeight: 'bold',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#EF4444',
      },
    });
  },
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#1E3A5F',
        color: '#fff',
        fontWeight: 'bold',
      },
    });
  },
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  }
};
