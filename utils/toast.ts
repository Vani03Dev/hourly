import toast from 'react-hot-toast';

export const Toast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: '#2563EB', // Blue primary color
        color: '#fff',
        fontWeight: 'semibold',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#2563EB',
      },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      style: {
        background: '#EF4444', // Red for errors
        color: '#fff',
        fontWeight: 'semibold',
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
        background: '#111827', // Charcoal loading color
        color: '#fff',
        fontWeight: 'semibold',
      },
    });
  },
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  }
};
