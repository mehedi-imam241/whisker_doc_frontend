import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("@/components/map"), // replace '@components/map' with your component's location
  { ssr: false } // This line is important. It's what prevents server-side render
);

function MapComponent({ userLocation, setUserLocation }) {
  return <Map userLocation={userLocation} setUserLocation={setUserLocation} />;
}

export default MapComponent;
