import React, { Component } from 'react'
import LocationList from './LocationList'

class Map extends Component {
  state = {
    map: '',
    infoWindow: {},
    locations: [{
          'title': " Trident",
          'type': "Restaurant",
          'address': "Hitech City Main Road",
          'crossStreet': "Next To Shilparamam",
          'position': {
            'lat': 17.44941554032092,
            'lng': 78.37874222070519
          },
          'venueId': '515e95b2e4b09c02ea4522b7',
        },
        {
          'title': "Cream Stone Concepts",
          'type': "Ice cream",
          'position': {
            'lat': 17.424802013516064,
            'lng': 78.42195498785948
          },
          'venueId': '4c680fe8e75ac9288aa2fbda'
        },
        {
          'title': "Kangan",
          'type': "North Indian Restaurant",
          'position': {
            'lat': 17.44223372778392,
            'lng': 78.38129953740987
          },
          'venueId': '4d25d4d0f50aa35d33b6379f'
        },
        {
          'title': "10 Downing Street",
          'type': "Night Food",
          'position': {
            'lat': 17.43586817493973,
            'lng': 78.45744348829194
          },
          'venueId': '4bac7d4df964a5205df73ae3'
        },
        {
          'title': "The Westin Hyderabad Mindspace",
          'type': "IT Park",
          'position': {
            'lat': 17.4424304,
            'lng': 78.3815879
          },
          'venueId': '4cbc55b27a5d9eb0a05c31e9'
        },
        {
          'title': "Chowmahala Palace",
          'type': " Palace",
          'position': {
            'lat': 17.359299743829105,
            'lng': 78.47161740649624
          },
          'venueId': '4cc19bfb67a3b1f77a8dc90e'
        },
        {
          'title': "Fifth Avenue Bakers",
          'type': "Bakers",
          'position': {
            'lat': 26.788387345603397,
            'lng': 75.83125743239772
          },
          'venueId': '4c1f7229b306c928046b68b7'
        },
        {
          'title': "Absolute Barbecues (ABs)",
          'type': "Barbequee",
          'position': {
            'lat': 17.43849792216121,
            'lng': 78.39795566970398
          },
          'venueId': '52411e2311d2bf60e0084ef5'
        },
        {
          'title': "Taj Falaknuma Palace",
          'type': "palace",
          'position': {
            'lat': 17.33011795505642,
            'lng': 78.46745955062218
          },
          'venueId': '4d0103874f56b60cf6f6a437'
        }]
  }

  componentDidMount () {
    this.loadMap()
  }
  
  openInfoWindow = (marker) => {
    this.closeInfoWindow()
    this.state.infoWindow.open(this.state.map, marker)
    marker.setAnimation(window.google.maps.Animation.BOUNCE)
    this.setState({ 'prevMarker': marker })
    this.state.infoWindow.setContent('<h4>Loading Data...</h4>')
    this.state.map.setCenter(marker.getPosition())
  }

  getMarkerInfo (location) {
    const self = this
    const clientId = '3ZYCIAMLNJ0RVS4HJ4RDUGEPNJHIBJRII1DGQNOFFMCBDXC3'
    const clientSecret = 'KI5FRQJEZVT03ES25MZNJSPG2EWIOMRQ0VQTRZBJMQYA5N2W'
    const url = `https://api.foursquare.com/v2/venues/${location.venueId}?client_id=${clientId}&client_secret=${clientSecret}&v=20181006`
    fetch (url)
      .then((response) => {
        if (response.status !== 200) {
          self.state.infoWindow.setContent('Sorry data cannot be loaded :(')
          return
        }
        response.json().then(({ response }) => {
        const { venue } = response
        self.state.infoWindow.setContent(`<div class='marker-info' tabindex=-1>
        <h2 tabindex=0 id='venuename'>${venue.name}</h2>
        <p><strong>Verified Location: </strong>${venue.verified ? 'Yes' : 'No'}</p>
        <p><strong>tip count: </strong>${venue.stats.tipCount}</p>
        <p>${venue.rating ? '<strong>Rating: </strong>'+ venue.rating: ''}</p>
        <p><a href='${venue.canonicalUrl}' target='_blank'>Read more</a></p>
        </div>`)
        // document.querySelector('#venuename').focus()
      })
      .catch((err) => {
        self.state.infoWindow.setContent('Sorry data cannot be loaded :(')
        console.log(err)
      })
       })
  }
  closeInfoWindow = () => {
    if (this.state.prevMarker) {
      this.state.prevMarker.setAnimation(null)
    }
    this.setState({ prevMarker: ''})
    this.state.infoWindow.close()
  }
  setMarkers = (map) => {
   const locations = this.state.locations.map((location) => {
      let longName = `${location.title} - ${location.type}`
      const marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(location.position),
        animation: window.google.maps.Animation.DROP,
        map,
        title: location.title
      })
    location.longName = longName
    location.marker = marker
    location.visible = true
    marker.addListener('click', () => {
      this.openInfoWindow(marker)
      this.getMarkerInfo(location)
    })

    marker.addListener('mouseover', () => {
      marker.setAnimation(window.google.maps.Animation.BOUNCE)
    })

    marker.addListener('mouseout', () => {
      marker.setAnimation(null)
    })
    
    return location
    })
    
    this.setState({ locations })
  }

  loadMap () {
    if (this.props && this.props.google) {
      const map = new window.google.maps.Map(document.querySelector('#map'), {
        center: {
          lat: 26.795185925006212,
          lng: 75.82552590576803
        },
        mapTypeControl: false,
        zoom: 13
      })

      const infoWindow = new window.google.maps.InfoWindow({})
      
      window.google.maps.event.addDomListener(window, 'resize', () => {
        const center = map.getCenter()
        window.google.maps.event.trigger(map, 'resize')
        this.state.map.setCenter(center)
      })

      window.google.maps.event.addListener(map, 'click', () => {
        this.closeInfoWindow()
      })
      this.setState({ map , infoWindow })
      this.setMarkers(map)
    }
  }
  render () {
    return (
      <div className='main'>
        <LocationList locations={this.state.locations} 
          openInfoWindow={this.openInfoWindow} 
          closeInfoWindow={this.closeInfoWindow} getMarkerInfo={this.getMarkerInfo.bind(this)} />
          <div id='map' role='application' />
      </div>
    )
  }
}

export default Map
