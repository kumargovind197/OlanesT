export async function getCityAndProvinceFromCoords(lat: number, lng: number) {
  const apiKey = '020cef33cfe949b4b7f2fa7d002aa8cc'; // <- yahan apni API key paste karo

  const res = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
  );

  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('No results found');
  }

  const components = data.results[0].components;

  const city = components.city || components.town || components.village || '';
  const province = components.state || '';

  return { city, province };
}
