'use client';
import React, { useRef, useEffect, useState } from 'react';
import type { LatLng } from '../map/map';
import Input from './input';

interface AddressAutocompleteProps {
  name?: string;
  label?: string;
  placeholder?: string;
  onLocationSelect?: (coordinates: LatLng, address: string) => void;
}

export default function AddressAutocomplete({
  name = "address",
  label = "Address",
  placeholder = "Enter an address",
  onLocationSelect
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [coordinates, setCoordinates] = useState<LatLng | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
      fields: ['geometry', 'formatted_address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        alert('No location available for selected address.');
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || '';
      
      const newCoordinates = { lat, lng };
      setCoordinates(newCoordinates);
      setSelectedAddress(address);
      
      if (onLocationSelect) {
        onLocationSelect(newCoordinates, address);
      }
      
      console.log('Lat:', lat, 'Lng:', lng, 'Address:', address);
    });

    return () => {
      if (window.google && window.google.maps && window.google.maps.event) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [onLocationSelect]);

  return (
    <div className="w-full">
      <Input
        name={name}
        label={label}
        placeholder={placeholder}
        type="text"
        ref={(element : any) => {
          if (element && 'focus' in element) {
            inputRef.current = element as HTMLInputElement;
          }
        }}
        autoComplete="off"
      />
      {coordinates && (
        <div className="mt-2 text-sm text-muted-foreground p-2 bg-card rounded border">
          <strong>Selected Location:</strong> <br />
          {selectedAddress && (
            <>
              <span className="text-foreground">{selectedAddress}</span> <br />
            </>
          )}
          <span className="text-xs">
            Latitude: {coordinates.lat.toFixed(6)} | 
            Longitude: {coordinates.lng.toFixed(6)}
          </span>
        </div>
      )}
    </div>
  );
}