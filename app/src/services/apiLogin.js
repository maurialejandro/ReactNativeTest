import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default apiLogin = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  console.log("aqui")
  try {
    const requestOptions = {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': '9Feh2Rx2PJCWZnzyALfPMQr7TFFLkbo0u9XkXmDZ' },
        body: JSON.stringify({ 
            name: 'biker_mauri',
            email: "bbcc@biker.com",
            password: "qwert"
        })
    };
    fetch('http://127.0.0.1:8000/api/login', requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ postId: data.id }));
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }

};