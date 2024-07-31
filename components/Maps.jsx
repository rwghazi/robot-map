// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import { GoogleMap, Marker, GroundOverlay, useJsApiLoader } from '@react-google-maps/api';

// const containerStyle = {
//     width: '100%',
//     height: '90vh',
//     borderRadius: '12px'
// };

// const center = {
//     lat: 1.3004538,
//     lng: 103.780125
// };

// const image = '/images/campus_sim.png'; 

// const bounds = {
//     north: 1.3017638,
//     south: 1.2992000,
//     east: 103.782100,
//     west: 103.778399,
// };

// const GoogleMapComponent2 = ({ apiKey }) => {
//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: apiKey
//     });

//     const mapRef = useRef(null);
//     const [map, setMap] = useState(null);

    
//     return isLoaded ? (
//         <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={center}
//             zoom={18}
//             onLoad={map => setMap(map)}
//         >
//             <GroundOverlay
//                 url={image}
//                 bounds={bounds}
//                 opacity={0.3} 
//                 tilt={20}
//             />
//         </GoogleMap>
//     ) : <></>;
// };

// export default GoogleMapComponent2;

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, GroundOverlay, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '90vh',
    borderRadius: '12px'
};

const center = {
    lat: 1.3004538,
    lng: 103.780125
};

const image = '/images/campus_sim.png';
const robotIcon = '/images/robot.png'; 

const bounds = {
    north: 1.3017638,
    south: 1.2992000,
    east: 103.782000,
    west: 103.778500,
};

// Robot data with pixel coordinates and heading
const robots = [
    { id: '001', x: 406, y: 334, heading: 0 },
    { id: '002', x: 1101, y: 613, heading: 60 },
    { id: '003', x: 922, y: 946, heading: 240 },
    { id: '004', x: 863, y: 324, heading: 330 }
];

const GoogleMapComponent2 = ({ apiKey }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey
    });

    const [map, setMap] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        if (map) {
            const boundsLatLng = new google.maps.LatLngBounds(
                new google.maps.LatLng(bounds.south, bounds.west),
                new google.maps.LatLng(bounds.north, bounds.east)
            );

            const boundsSW = boundsLatLng.getSouthWest();
            const boundsNE = boundsLatLng.getNorthEast();

            // Size of the GroundOverlay image in pixels (replace with actual dimensions)
            const overlayWidth = 1629;
            const overlayHeight = 1245;

            // Convert pixel coordinates to LatLng
            const pixelToLatLng = (x, y) => {
                const latDiff = boundsNE.lat() - boundsSW.lat();
                const lngDiff = boundsNE.lng() - boundsSW.lng();

                // Compute latitude and longitude based on pixel coordinates
                const lat = boundsNE.lat() - (y / overlayHeight) * latDiff;
                const lng = boundsSW.lng() + (x / overlayWidth) * lngDiff;

                return { lat, lng };
            };

            robots.forEach(robot => {
                const robotLatLng = pixelToLatLng(robot.x, robot.y);

                new google.maps.Marker({
                    position: robotLatLng,
                    map,
                    icon: {
                        url: robotIcon,
                        scaledSize: new google.maps.Size(40, 40),
                        rotation: 10
                    },
                    title: `Robot ${robot.id}`
                });
            });
        }
    }, [map]);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={18}
            onLoad={mapInstance => setMap(mapInstance)}
        >
            <GroundOverlay
                url={image}
                bounds={bounds}
                opacity={0.3}
            />
        </GoogleMap>
    ) : <></>;
};

export default GoogleMapComponent2;
