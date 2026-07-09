export const getCurrencyByLocation = async () => {
  const getUserLocation = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const getCountryFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    const response = await fetch(
      `${
        import.meta.env.VITE_BIGDATA_CLOUD_API
      }?latitude=${latitude}&longitude=${longitude}`
    );
    const data = await response.json();
    return data.country;
  };
  try {
    const position = await getUserLocation();
    const { latitude, longitude } = position.coords;

    const country = await getCountryFromCoordinates(latitude, longitude);

    const countryToCurrencyMap: { [key: string]: string } = {
      "United Arab Emirates": "AED",
      Germany: "EUR",
      France: "EUR",
      Italy: "EUR",
      Spain: "EUR",
      Netherlands: "EUR",
      Austria: "EUR",
      Belgium: "EUR",
      Finland: "EUR",
      Ireland: "EUR",
      Portugal: "EUR",
      Greece: "EUR",
      "United Kingdom": "GBP",
      "United States": "USD",
      Canada: "USD",
      Australia: "USD",
    };

    return (
      countryToCurrencyMap[country] ||
      localStorage.getItem("selectedCurrency") ||
      "EUR"
    );
  } catch (error) {
    // return localStorage.getItem("selectedCurrency") || "GBP";
    return "GBP";
  }
};
