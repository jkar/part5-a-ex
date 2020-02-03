import React from 'react'

const Notification = ({ message, typeMessage }) => {


        let NotificationStyle = {
            color: 'red',
            background: 'lightgrey',
            fontSize: 20,
            borderStyle: 'solid',
            borderRadius: 5,
            padding: 10,
            marginBottom: 10
          }

    if (typeMessage === 'good') {
         NotificationStyle = {...NotificationStyle, color: 'green'}
    }

  if (message === null) {
    return null
  }

  return (
    //  <div className="error">
     <div style={NotificationStyle}>
      {message}
    </div>
  )
}

export default Notification