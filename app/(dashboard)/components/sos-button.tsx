"use client";

import { useCallback, useEffect, useRef } from "react";
import { useUser, useSos } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useAuthMutation } from "@/lib/apollo-client";
import { SEND_SOS } from "@/lib/mutations";

interface SOSButtonProps {
  className?: string;
}

export default function SOSButton({ className }: SOSButtonProps) {
  const [user] = useUser();
  const [isSosActive, setIsSosActive] = useSos();
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [sendSos] = useAuthMutation(SEND_SOS);

  useEffect(() => {
    if (isSosActive && user) {
      startLocationTracking();
    }
    
    return () => {
      stopLocationTracking();
    };
  }, [isSosActive, user]);

  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation || !user) {
      toast.error('Geolocation is not supported by this browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        fetch('/api/sos/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.id.toString(),
          },
          credentials: 'include',
          body: JSON.stringify({
            latitude,
            longitude,
            accuracy,
            timestamp: new Date().toISOString(),
          }),
        }).catch((error) => {
          console.error('Failed to send location update:', error);
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Failed to get location. Please check your location permissions.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    watchIdRef.current = watchId;
    localStorage.setItem('sos_watch_id', watchId.toString());
  }, [user]);

  const stopLocationTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    localStorage.removeItem('sos_watch_id');
    
    if(user){
        fetch('/api/sos/stop', {
          method: 'POST',
          headers: {
                'x-user-id': user.id.toString(),
              },
          credentials: 'include',
        }).catch((error) => {
          console.error('Failed to stop SOS:', error);
        });
    }
  }, [user]);

  const toggleSOS = useCallback(async () => {
    if (isSosActive) {
      stopLocationTracking();
      setIsSosActive(false);
      localStorage.removeItem('sos_active');
      toast.success('SOS deactivated');
    } else {
      try {
        toast.loading('Activating SOS...', { id: 'sos-loading' });
        
        const result = await sendSos();
        
        if (result.data?.sendSos) {
          startLocationTracking();
          setIsSosActive(true);
          localStorage.setItem('sos_active', 'true');
          toast.success('SOS activated! Emergency contacts have been notified.', { id: 'sos-loading' });
        } else {
          toast.error('Failed to activate SOS. Please try again.', { id: 'sos-loading' });
        }
      } catch (error) {
        console.error('Failed to start SOS:', error);
        toast.error('Failed to activate SOS. Please try again.', { id: 'sos-loading' });
      }
    }
  }, [isSosActive, startLocationTracking, stopLocationTracking, setIsSosActive, sendSos]);

  if (!user || !user.isOnboarded) {
    return null;
  }

  return (
    <button
      onClick={toggleSOS}
      className={`fixed bottom-6 right-6 z-50 rounded-full p-4 text-white font-bold text-sm shadow-lg transition-all duration-200 ${
        isSosActive 
          ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
          : 'bg-blue-600 hover:bg-blue-700'
      } ${className}`}
      aria-label={isSosActive ? 'Stop SOS' : 'Activate SOS'}
    >
      {isSosActive ? '🛑 STOP SOS' : '🆘 SOS'}
    </button>
  );
}