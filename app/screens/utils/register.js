import React, { useEffect, useState }  from "react"

export default register = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    //generar peticion a la api
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': 'm42SVchpoCKyYDSXPmdvcX8uhg4jOmmzuHlKqP8F' },
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

      return response

}