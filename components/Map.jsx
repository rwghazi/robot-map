'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '90vh',
    borderRadius: '12px'
};

const center = {
    lat: 1.3004538,
    lng: 103.780125
};

const image = '/images/campus_sim.png'; // Ensure this path is correct

const GoogleMapComponent = ({ apiKey }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey
    });

    const [map, setMap] = useState(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (map && isLoaded) {
            // Define MapOverlay class after the map has loaded
            class MapOverlay extends google.maps.OverlayView {
                constructor(bounds, image) {
                    super();
                    this.bounds = bounds;
                    this.image = image;
                }

                onAdd() {
                    console.log('onAdd called');
                    this.div = document.createElement('div');
                    this.div.style.borderStyle = 'none';
                    this.div.style.borderWidth = '0px';
                    this.div.style.position = 'absolute';
                    this.div.style.backgroundColor = 'transparent'; // Ensure background is transparent

                    const img = document.createElement('img');
                    img.src = this.image;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.position = 'absolute';
                    img.style.pointerEvents = 'none'; // Ensure it does not block interactions
                    this.div.appendChild(img);

                    const panes = this.getPanes();
                    panes.overlayLayer.appendChild(this.div);
                }

                draw() {
                    console.log('draw called');
                    const overlayProjection = this.getProjection();
                    if (!overlayProjection) return; // Ensure projection is available

                    const sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
                    const ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());

                    if (this.div) {
                        this.div.style.left = sw.x + 'px';
                        this.div.style.top = ne.y + 'px';
                        this.div.style.width = (ne.x - sw.x) + 'px';
                        this.div.style.height = (sw.y - ne.y) + 'px';
                    }
                }
            }

            const bounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(1.295, 103.775),
                new google.maps.LatLng(1.305, 103.785)
            );

            // Instantiate and add the overlay to the map
            if (!overlayRef.current) {
                console.log('Creating MapOverlay');
                overlayRef.current = new MapOverlay(bounds, image);
                overlayRef.current.setMap(map);
            }
        }
    }, [map, isLoaded]);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={18}
            onLoad={map => setMap(map)}
        >
            <Marker position={center} />
        </GoogleMap>
    ) : <></>
};

export default GoogleMapComponent;
