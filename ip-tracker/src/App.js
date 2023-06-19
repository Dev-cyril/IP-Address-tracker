import './App.css';
import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import marker from './images/location-dot-solid.svg';

function App() {
  const data = useRef(null);
  const [output, setData] = useState(null);

  async function getApiData(IPAddress) {
    try {
      const response = await fetch(
        `http://ip-api.com/json/${IPAddress}?fields=33612761`
      );
      const data = await response.json();
      return (data.status === 'success' ? data : alert(data.message));
    } catch (err) {
      alert(`ERROR: ${err}`);
    }
  }
  async function findIp() {
    if(data.current.value.trim().length !== 0){
      const apiData = await getApiData(data.current.value);
      setData([apiData]);
    } else{
      alert('Input field cannot be empty...')
    }
  }
  const customIcon = new Icon({
    iconUrl: marker,
    iconSize: [20, 20]
  })

  function time(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const formattedTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');

    return(formattedTime);
  }
  return (
    <>
      <section className='searchBar'>
        <h3>IP Address Tracker</h3>
        <div>
          <input ref={data} placeholder='Search for any IP address or domain' type='text' />
          <button onClick={findIp}>find</button>
        </div>
      </section>
      {Array.isArray(output) && output.every(item => typeof item === 'object') ? (
        output.map((result, index) => (
          <React.Fragment key={index}>
            <section className='displayDetails'>
              <div>
                <h5>IP Address</h5>
                <h3>{result.query}</h3>
              </div>
              <div>
                <h5>Location</h5>
                <h3>
                  {result.city} in {result.regionName}, {result.country}
                </h3>
              </div>
              <div>
                <h5>Timezone</h5>
                <h3>UTC {time(result.offset)}</h3>
              </div>
              <div>
                <h5>ISP</h5>
                <h3>{result.isp}</h3>
              </div>
            </section>
            <section className='map-component'>
              <div className='map'>
                <MapContainer center={[result.lat, result.lon]} zoom={10} scrollWheelZoom={true}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[result.lat, result.lon]} icon={customIcon}>
                    <Popup>{result.city}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </section>
          </React.Fragment>
        ))
      ) : null}
    </>
  );
}

export default App;
