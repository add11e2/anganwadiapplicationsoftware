import React, { Component } from "react";
import classnames from "classnames";
import {
  Map,
  InfoWindow,
  Marker,
  GoogleApiWrapper,
  Polyline
} from "google-maps-react";
import "./index.css";
import ReactDOM from "react-dom";
import SideBar from "./Sidebar.js";
import mapStyle from "./map-style.json";

import firebase from "../../../../Firebase";
import Autorenew from "@material-ui/icons/Autorenew";
import KeyboardBackspace from "@material-ui/icons/KeyboardBackspace";
const google = window.google;
// const subdata = data[i].Infrastructure.Location;
// for (let index in subdata) {
//   latlong = subdata[index];
// }
// var item = {
//   anganwadicode: data[i].anganwadicode,
//   location: latlong
// };

//anganwadicenterdata.push(item);
export const workertocenterLooper = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      ...childSnapshot.val()
    });
  });
  return data;
};
export const firebaseLooper = snapshot => {
  let data = [];
  var latlong = "";
  var imgurl = "";
  snapshot.forEach(childSnapshot => {
    // console.log(childSnapshot.val().Infrastructure.Location);
    firebase
      .database()
      .ref("assignedworkerstocenters")
      .once("value")
      .then(assignedworkerstocenterssnapshot => {
        const subdata2 = childSnapshot.val().Infrastructure.buildingImage;
        for (let index in subdata2) {
          imgurl = subdata2[index];
        }
        const subdata1 = childSnapshot.val().Infrastructure.Location;
        for (let index in subdata1) {
          latlong = subdata1[index];
          //  console.log(latlong);
        }
        const assignedworkerstocentersdata = workertocenterLooper(
          assignedworkerstocenterssnapshot
        );
        // console.log(assignedworkerstocentersdata);
        var i = 0;
        var workeremailid = "";
        var awcplace = "";
        for (i = 0; i < assignedworkerstocentersdata.length; i++) {
          if (
            childSnapshot.key ===
            assignedworkerstocentersdata[i].anganwadicenter_code
          ) {
            workeremailid =
              assignedworkerstocentersdata[i].anganwadiworker_emailid;
            awcplace = assignedworkerstocentersdata[i].awcplace;
          }
        }
        //console.log(latlong);
        data.push({
          //donot delete the below comment
          //  ...childSnapshot.val(),
          location: latlong,
          anganwadicode: childSnapshot.key,
          workeremailid: workeremailid,
          awcplace: awcplace,
          imageurl: imgurl
        });
      });
  });
  return data;
};
export class MapDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      userlatLng: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      query: "",
      markers: [],
      active: false,
      full: true,
      ariaExpanded: false,
      queryItems: [],
      filteredItems: []
    };

  }
 
  // `classList.toggle` showed Errors so Used 'classnames' to handle it & Burger Menu `aria-expanded` handling
  toggleMenu = () => {
    if (
      this.state.active === false &&
      this.state.full === true &&
      this.state.ariaExpanded === false
    ) {
      this.setState({
        active: true,
        full: false,
        ariaExpanded: true
      });
    } else {
      this.setState({
        active: false,
        full: true,
        ariaExpanded: false
      });
    }
  };

  gm_authFailure() {
    document.querySelector("body").innerText =
      "Error loading Google Maps, Check The API Key!";
    alert("Error loading Google Maps, Check The API Key!");
  }

  componentDidMount() {
    const geolocation = navigator.geolocation;
    if (geolocation) {
      geolocation.getCurrentPosition(
        position => {
          this.setState(
            {
              userlatLng: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
              //  userlatLng: [position.coords.latitude, position.coords.longitude]
            },
            this.notifyStateChange
          );
        },
        () => {
          console.log("Permission Denied");
        }
      );
    } else {
      console.log("GeoLocation not supported...Update the browser fella");
    }
    firebase
      .database()
      .ref("users")
      .once("value")
      .then(snapshot => {
        if (snapshot) {
          return snapshot;
        }
      })

      .then(result => {
        var i = 0;
        const data = firebaseLooper(result);

        this.setState({
          items: data,
          queryItems: data,
          filteredItems: data,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({ error, isLoading: false });
        console.log("Error! " + error);
        alert("Error! " + error);
      });

    // When Google Maps API fails >> alert
    // window.gm_authFailure = () => {
    //   alert("Error loading Google Maps, Check The API Key!");
    // };
    window.gm_authFailure = this.gm_authFailure.bind(this);
  }

  // When click on Marker: Open InfoWindow
  onMarkerClick = (props, marker) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  // When click on Map: Close active InfoWindow
  onMapClicked = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  // When Click On Side Nav Location
  onListClick = e => {
    let markers;

    // `.gmnoprint` works fine on touch screens & `.gmnoprint map area` works fine on Desktop
    (() => {
      if (window.matchMedia("(max-width: 1024px)").matches) {
        markers = [...document.querySelectorAll(".gmnoprint")];
      } else {
        markers = [...document.querySelectorAll(".gmnoprint map area")];
      }
    })();

    this.setState({ markers: markers });
    const click = markers.find(marker => marker.title === e.innerText);
    click.click();
  };

  // Search filtering locations
  filterList = () => {
    let input, inputVal, a, i, filtered;
    input = document.querySelector("#search");
    inputVal = input.value.toLowerCase();
    a = document.querySelectorAll(".nav-item");

    for (i = 0; i < a.length; i++) {
      filtered = a[i];

      if (filtered.innerHTML.toLowerCase().indexOf(inputVal) > -1) {
        filtered.style.display = "";
      } else {
        filtered.style.display = "none";
      }
    }
  };

  filteredMarkers = () => {
    let input = document.querySelector("#search");
    let inputVal = input.value.toLowerCase();

    for (let i = 0; i < this.state.queryItems.length; i++) {
      let item = this.state.queryItems[i];

      if (inputVal === "") {
        this.setState(
          {
            filteredItems: [...this.state.items]
          },
          () => this.forceUpdate()
        );
      } else if (item.awcplace.toLowerCase().indexOf(inputVal) > -1) {
        // } else if (item.venue.name.toLowerCase() === inputVal) {
        this.setState({
          filteredItems: [...this.state.filteredItems, item]
        });
      } else {
        //this.setState({ filteredItems: [...this.state.filteredItems] });
        this.setState({
          filteredItems: [...this.state.filteredItems.splice(i, 1)]
        });
      }
    }
  };
  onInfoWindowOpen1(props, e, result) {
    const button = (
      <a
        href={"anganwadidetails/" + result.anganwadicode}
      
        style={{
          textDecoration: "none",
          backgroundColor: "#f44336",
          color: "white",
          padding: 10
        }}
      >
        Get Details
      </a>
    );
    ReactDOM.render(
      React.Children.only(button),
      document.getElementById("getdetails")
    );
  }

  onInfoWindowOpen2(props, e, result) {
    const button = (
      <a
        href={
          "https://www.google.com/maps/dir/" +
          this.state.selectedPlace.initialCenter.lat +
          "," +
          this.state.selectedPlace.initialCenter.lng +
          "/" +
          this.state.selectedPlace.position.lat +
          "," +
          this.state.selectedPlace.position.lng
        }
       
        style={{
          textDecoration: "none",
          backgroundColor: "#1b85b8",
          color: "white",
          padding: 10
        }}
      >
        Get Direction
      </a>
    );
    ReactDOM.render(
      React.Children.only(button),
      document.getElementById("getdirections")
    );
  }
  
  render() {
    const style = { width: "100%", height: "100%" };
    // `classList.toggle` showed Errors so Used 'classnames' to handle it
    let activeClass = classnames("nav-section ", {
      active: this.state.active
    });
    let fullClass = classnames("map-canvas ", {
      full: this.state.full
    });

    const { isLoading, error } = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <p>Loading ...</p>;
    }
    // var icon = {
    //   url: "https://loc8tor.co.uk/wp-content/uploads/2015/08/stencil.png", // url
    //   scaledSize: new this.props.google.maps.Size(90, 42) // scaled size
    // };
    return (
      <div>
        <header className="header-bar" role="banner">
          {/* Burger Menu */}
          <nav className="buttonNav" role="presentation">
            <button
              className={"toggleButton"}
              aria-controls="menu"
              aria-expanded={this.state.ariaExpanded}
              onClick={this.toggleMenu.bind(this)}
              aria-label="BurgerMenu to open Locations list"
            >
              <span />
              <span />
              <span />
            </button>
          </nav>

          <h1>Anganwadi Map</h1>
          <button
            className={"refreshButton"}
            onClick={this.toggleMenu.bind(this)}
          >
            <Autorenew style={{ color: "white" }} />
          </button>

          <a
            href="ceodddcdashboard"
            className={"backButton"}
            style={{ textDecoration: "none" }}
            //onClick={this.toggleMenu.bind(this)}
          >
            <KeyboardBackspace
              style={{
                height: 15,
                width: 15,
                color: "white",
                verticalAlign: "middle",
                lineHeight: 5
              }}
            />{" "}
            Back
          </a>
        </header>

        <SideBar
          items={this.state.items}
          onListClick={this.onListClick}
          filterList={this.filterList}
          filteredMarkers={this.filteredMarkers}
          activeClass={activeClass}
        />

        <div
          className={fullClass}
          id="map"
          aria-label="Google Map"
          role="application"
        >
          <Map
            google={this.props.google}
            style={style}
            styles={mapStyle}
            initialCenter={{ lat: 13.4631, lng: 74.9833294 }}
            zoom={10}
            // initialCenter={this.props.center}
            onReady={this.handleMapReady}
            onClick={this.onMapClicked}
            aria-hidden="true"
          >
            {this.state.filteredItems.map(item => {
              // console.log(item);
              return [
                <Marker
                  //icon={icon}
                  name={item.awcplace}
                  title={item.awcplace}
                  key={item.anganwadicode + Math.random() * 0.17}
                  initialCenter={{
                    lat: this.state.userlatLng.lat,
                    lng: this.state.userlatLng.lng
                  }}
                  imageurl={item.imageurl.BPicture}
                  workeremailid={item.workeremailid}
                  anganwadicode={item.anganwadicode}
                  className="marker-pin"
                  position={{
                    lat: item.location.latitude,
                    lng: item.location.longitude
                  }}
                  animation={
                    this.state.activeMarker
                      ? this.state.activeMarker.name === item.awcplace
                        ? "1"
                        : "0"
                      : "0"
                  }
                  onClick={this.onMarkerClick}
                />,

                <Polyline
                  key={"polyline-" + item.anganwadicode}
                  path={[
                    //polyline --------------------------------
                    // {
                    //   lat: this.state.userlatLng.lat,
                    //   lng: this.state.userlatLng.lng
                    // },
                    {
                      lat: item.location.latitude,
                      lng: item.location.longitude
                    }
                  ]}
                  options={{
                    strokeColor: "red",
                    strokeOpacity: 1,
                    strokeWeight: 4,
                    offset: "0%",
                    icons: [
                      {
                        strokeWeight: 2,
                        //icon: nodeOnLine,
                        offset: "0%",
                        repeat: "35px"
                      }
                    ]
                  }}
                />
              ];
            })}

            <InfoWindow
              tabIndex="0"
              aria-label="Info window"
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
             onOpen={e => {this.onInfoWindowOpen1(this.props, e, this.state.selectedPlace);this.onInfoWindowOpen2(this.props,e,this.state.selectedPlace);}}
            >
              <div tabIndex="1">
                <div class="header">
                  <img
                    src={
                      this.state.selectedPlace.imageurl
                        ? this.state.selectedPlace.imageurl
                        : "NOT AVAILABLE"
                    }
                    height="100"
                    width="150"
                    style={{
                      marginTop: 5,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  />
                </div>
                <p tabIndex="1">
                  <b>ANGANWADI CODE:</b>&nbsp;&nbsp;
                  <font color="red">
                    {this.state.selectedPlace.anganwadicode}
                  </font>
                </p>
                <p tabIndex="1">
                  <b>ANGANWADI WORKER MAIL-ID:</b>&nbsp;&nbsp;
                  <font color="red">
                    {this.state.selectedPlace.workeremailid}
                  </font>
                </p>

                {/* <h6 tabIndex="1">
                  {"ANGANWADI WORKER MAIL-ID:\t" +
                    this.state.selectedPlace.workeremailid}
                </h6> */}
                {/* <p tabIndex="1">{this.state.selectedPlace.anganwadicode}</p> */}
              </div>
              <div class="footer">
                <div id="getdetails" className={"getdetails"} />
                <div id="getdirections" className={"getdirections"} />
              </div>
            </InfoWindow>
          </Map>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper(
  {
    apiKey: "AIzaSyBPpXVJA1Xf0sTAC6LjOBMQy5H3Sx09i2k",
    v: "3.30"
  },
  window.addEventListener("unhandledrejection", event => {
    console.warn(
      "WARNING: Unhandled promise rejection. Shame on you! Reason: " +
        event.reason
    );
    document.querySelector("body").innerHTML = "The Google Map didn't load!";
  })
)(MapDashboard);
