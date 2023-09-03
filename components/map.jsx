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
import Link from "next/link";

const vetIcon = new L.icon({
  iconUrl: "/doctor-icon.svg",
  shadowUrl: "/Frame 1.svg",
  shadowSize: new L.point(70, 50),
  shadowAnchor: [35, 8],

  iconSize: new L.Point(40, 40),
});

const userIcon = new L.icon({
  iconUrl: "/user_icon.png",

  shadowUrl: "/Frame 1.svg",
  shadowSize: new L.point(60, 50),
  shadowAnchor: [30, 0],

  iconSize: new L.Point(70, 70),
});

function DraggableMarker({ location, icon }) {
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
      icon={icon}
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
  icon = "vet",
  allVets,
  query,
  sortBy,
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

  useEffect(() => {
    var container = L.DomUtil.get("map");
    if (container != null) {
      container._leaflet_id = null;
    }

    // var container = L.DomUtil.get("map");
    // if (container && container["_leaflet_id"] != null) {
    //   container.remove();
    // }

    return () => {
      var container = L.DomUtil.get("map");
      if (container != null) {
        container._leaflet_id = null;
      }
    };
  }, []);

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

          {allVets &&
            allVets.map((vetInfo) => {
              return (
                <Marker
                  position={[vetInfo.location.lat, vetInfo.location.lng]}
                  icon={vetIcon}
                >
                  <Popup>
                    <div className="flex flex-col gap-y-1 mb-3 text-lg">
                      <div className="text-center font-bold">Vet</div>
                      <div className="">
                        <span className="text-primary font-bold">Name: </span>
                        {vetInfo.vet.name}
                      </div>
                      <div>
                        <span className="text-primary font-bold">Email: </span>
                        {vetInfo.vet.email}
                      </div>
                      <div>
                        <span className="text-primary font-bold">
                          Profile:{" "}
                        </span>{" "}
                        <Link href={`/user/vets/${vetInfo.vetId}`}>
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {automaticLocation ? (
            <>
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={icon === "vet" ? vetIcon : userIcon}
              >
                <Popup>
                  <div className="text-semi-blue text-bold text-xl">You</div>
                </Popup>
              </Marker>
            </>
          ) : (
            <>
              <DraggableMarker
                location={[userLocation, setUserLocation]}
                icon={icon === "vet" ? vetIcon : userIcon}
              />

              <Search location={[userLocation, setUserLocation]} />
            </>
          )}
        </MapContainer>
      </div>
      {query && (
        <Button
          onClick={() =>
            query({
              variables: {
                limit: 10,
                skip: 0,
                sortBy: {
                  sortBy: sortBy,
                  lat: userLocation.lat,
                  lng: userLocation.lng,
                },
              },
            })
          }
          color="indigo"
          className="mt-10 rounded-full"
        >
          Go
        </Button>
      )}
    </div>
  );
};

export default MyMap;
