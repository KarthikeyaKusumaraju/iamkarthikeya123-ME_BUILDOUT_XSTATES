import React, { useEffect, useState } from "react";

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // to display error messages

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setError("");
        const res = await fetch("https://crio-location-selector.onrender.com/countries");

        if (!res.ok) {
          throw new Error(`Failed to fetch countries: ${res.statusText}`);
        }

        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load countries. Please try again later.");
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountry) return;

      try {
        setError("");
        const res = await fetch(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch states: ${res.statusText}`);
        }

        const data = await res.json();
        setStates(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load states for the selected country.");
        setStates([]);
      }

      // Reset lower levels
      setSelectedState("");
      setSelectedCity("");
      setCities([]);
      setMessage("");
    };

    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry || !selectedState) return;

      try {
        setError("");
        const res = await fetch(
          `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch cities: ${res.statusText}`);
        }

        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load cities for the selected state.");
        setCities([]);
      }

      setSelectedCity("");
      setMessage("");
    };

    fetchCities();
  }, [selectedState, selectedCountry]);

  // Update message when city selected
  useEffect(() => {
    if (selectedCity && selectedState && selectedCountry) {
      setMessage(`You selected ${selectedCity}, ${selectedState}, ${selectedCountry}`);
    }
  }, [selectedCity, selectedState, selectedCountry]);

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", textAlign: "center" }}>
      <h2>Location Selector</h2>

      {/* Country Dropdown */}
      <select
        key="country"
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      {/* State Dropdown */}
      <select
        key="state"
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        disabled={!selectedCountry}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "12px",
          backgroundColor: selectedCountry ? "white" : "#f2f2f2",
        }}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      {/* City Dropdown */}
      <select
        key="city"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        disabled={!selectedState}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "12px",
          backgroundColor: selectedState ? "white" : "#f2f2f2",
        }}
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {/* Error Message */}
      {error && (
        <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>{error}</p>
      )}

      {/* Success Message */}
      {message && (
        <p style={{ marginTop: "20px", fontWeight: "bold", color: "#333" }}>{message}</p>
      )}
    </div>
  );
};

export default LocationSelector;
