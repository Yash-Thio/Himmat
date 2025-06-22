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
  const isTrackingRef = useRef<boolean>(false);
  const [sendSos] = useAuthMutation(SEND_SOS);

  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation || !user || isTrackingRef.current) {
      if (isTrackingRef.current) {
      }
      return;
    }

    isTrackingRef.current = true; // Set flag BEFORE starting watcher

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
        isTrackingRef.current = false;
        setIsSosActive(false);
        localStorage.removeItem('sos_active');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );

    watchIdRef.current = watchId;
    localStorage.setItem('sos_watch_id', watchId.toString());
  }, [user, setIsSosActive]);

  const stopLocationTracking = useCallback(() => {
    
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    isTrackingRef.current = false;
    localStorage.removeItem('sos_watch_id');
    
    if (user) {
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

  useEffect(() => {
    if (isSosActive && user && !isTrackingRef.current) {
      startLocationTracking();
    } else if (!isSosActive && isTrackingRef.current) {
      stopLocationTracking();
    }
  }, [isSosActive, user, startLocationTracking, stopLocationTracking]);

  useEffect(() => {
    return () => {
      if (isTrackingRef.current) {
        stopLocationTracking();
      }
    };
  }, [stopLocationTracking]);

  const toggleSOS = useCallback(async () => {
    if (isSosActive) {
      setIsSosActive(false);
      localStorage.removeItem('sos_active');
      toast.success('SOS deactivated');
    } else {
      try {
        toast.loading('Activating SOS...', { id: 'sos-loading' });
        
        const result = await sendSos();
        
        if (result.data?.sendSos) {
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
  }, [isSosActive, setIsSosActive, sendSos]);

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