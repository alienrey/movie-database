'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/providers/AuthProvider";
import { CircularProgress, Box } from '@mui/material';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/movies');
    } else {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, router]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );
}