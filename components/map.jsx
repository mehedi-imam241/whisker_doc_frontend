"use client";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "node_modules/leaflet-geosearch/dist/geosearch.css";
import { useEffect, useState, useRef, useMemo, use } from "react";
import {
  Menu,
  MenuItem,
  MenuHandler,
  Button,
  MenuList,
  IconButton,
} from "@material-tailwind/react";
import { useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import L from "leaflet";
import { center } from "@/utils/location_center";
import { IoReloadCircle } from "react-icons/io5";

const myIcon = new L.icon({
  iconUrl: "/doctor-icon.svg",
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: "/Frame 1.svg",
  shadowSize: new L.point(70, 50),
  shadowAnchor: [35, 8],

  iconSize: new L.Point(40, 40),
});

function DraggableMarker({ location }) {
  // const [position, setPosition] = useState(center);

  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          // setPosition(marker.getLatLng());
          location[1](marker.getLatLng());
          console.log(marker.getLatLng());
        }
      },
    }),
    []
  );

  return (
    <Marker
      icon={myIcon}
      draggable={true}
      eventHandlers={eventHandlers}
      position={[location[0].lat, location[0].lng]}
      ref={markerRef}
    ></Marker>
  );
}

// make new leaflet element
const Search = ({ location }) => {
  const map = useMap(); // access to leaflet map

  useEffect(() => {
    const searchControl = GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      showMarker: false, // optional: true|false  - default true
      showPopup: false, // optional: true|false  - default false
      // marker: {
      //   icon: myIcon,
      //   draggable: true,
      // },

      style: "button",
      autoClose: true,
      keepResult: true,
    });
    function searchEventHandler(result) {
      location[1]({ lat: result.location.y, lng: result.location.x });
      // map.setView([result.location.y, result.location.x], 16);
    }
    map.addControl(searchControl); // this is how you add a control in vanilla leaflet
    map.on("geosearch/showlocation", searchEventHandler);

    return () => map.removeControl(searchControl);
  }, []);

  return null; // don't want anything to show up from this comp
};

function ChangeView({ center }) {
  const map = useMap();

  // map.setView([center.lat, center.lng], 16);

  useEffect(() => {
    map.panTo([center.lat, center.lng]);
  }, [center]);

  return <></>;
}

const MyMap = ({
  userLocation,
  setUserLocation,
  previous = false,
  update = true,
}) => {
  const [automaticLocation, setAutomaticLocation] = useState(
    !previous ? true : false
  ); // 1 for previous location, 2 for GPS location, 3 for manual location
  const [reload, setReload] = useState(false);

  // const [newLocation, setNewLocation] = useState(center);
  // const map = useMap();

  // useEffect(() => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       setUserLocation({
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       });
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (reload) {
      window.location.reload();
    }
  }, [reload]);

  useEffect(() => {
    if (update) {
      if (automaticLocation === true) {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          });
        }
      }
    }
  }, [automaticLocation]);

  // console.log(userLocation);

  return (
    <div className="text-center">
      {update && (
        <>
          <Menu>
            <MenuHandler className="my-7">
              <Button
                color="indigo"
                variant="outlined"
                className="rounded-full"
              >
                {automaticLocation ? "GPS Location" : "Manual Location"}
              </Button>
            </MenuHandler>
            <MenuList>
              <MenuItem
                onClick={() => {
                  setAutomaticLocation(true);
                }}
              >
                GPS Location
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAutomaticLocation(false);
                }}
              >
                Manual Location
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton className="mx-2" color="indigo">
            <IoReloadCircle onClick={() => setReload(true)} size={30} />
          </IconButton>
        </>
      )}

      <div className={``}>
        {automaticLocation ? (
          <>
            <MapContainer
              center={[center.lat, center.lng]}
              zoom={16}
              scrollWheelZoom={true}
              style={{ height: 500, width: "100%" }}
            >
              <ChangeView center={userLocation} />
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={myIcon}
              >
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </>
        ) : (
          <>
            <MapContainer
              center={[center.lat, center.lng]}
              zoom={16}
              scrollWheelZoom={true}
              style={{ height: 500, width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ChangeView center={userLocation} />
              {/* <Marker position={[newLocation[1], newLocation[0]]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}

              {/* {newLocation && (
          <DraggableMarker location={[newLocation, setNewLocation]} />
        )} */}

              <DraggableMarker location={[userLocation, setUserLocation]} />

              {/* <Marker position={[23.7461, 90.3742]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>  */}

              <Search location={[userLocation, setUserLocation]} />
            </MapContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default MyMap;
