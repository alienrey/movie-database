'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/providers/AuthProvider";
import { CircularProgress, Box } from '@mui/material';

export default function NotFound() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [isAuthenticated, router]);

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
      <Box mt={2}>Redirecting to home page...</Box>
    </Box>
  );
}