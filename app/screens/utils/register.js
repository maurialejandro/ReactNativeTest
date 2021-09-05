import React, { useEffect, useState } from 'react';

export function registerUser(formData){
  fetch('http://172.20.10.5:8000/api/register', {
    method: 'POST',
    headers: {'X-CSRF-TOKEN': 'rQCXl9HXnIYmRn8XTDRQe8UNyIKuR3tkzU7Nvhd8'},
    body: JSON.stringify({
      name: formData.email,
      email: formData.email,
      password: formData.password
    })
  })
  .then((responseJson) => {
      console.log(responseJson)
  })
  .catch((error) =>{
    console.error(error);
  });
}