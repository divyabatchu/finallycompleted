import React from 'react'
import { GoogleApiWrapper } from 'google-maps-react'
import Map from './Components/Map'
import './App.css'

function App (props) {
  return (
    <div className='App'>
      <a href='#sidebar' className='skip-link'>skip to content</a>
      <header className='App-header'>
        <h1 className='App-title'> Hyderabad</h1>
      </header>
      <main role='main'>
        {
          props.loaded ? (
            <Map google={props.google} />
          ) : (
            <div className='error-loading'>
              <p className='error-msg'>Couldn't load Google maps</p>
            </div>
          )
        }
      </main>
    </div>
  )
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyC5pPQFTO4-PjnI53fJhENTNEZE-evU-QQ'
})(App)
