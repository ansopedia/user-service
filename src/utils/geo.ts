import maxmind, { type CityResponse, Reader } from "maxmind";
import path from "path";

export let geoLookup: Reader<CityResponse> | null = null;

export const initGeoDB = async () => {
  const dbPath = path.resolve(__dirname, "../../data/geolite2-country-ipv6.mmdb");
  geoLookup = await maxmind.open<CityResponse>(dbPath);
};

export const enrichWithGeo = (ip: string) => {
  if (geoLookup === null) return {};
  const geo = geoLookup.get(ip);
  return {
    country: geo?.country?.iso_code,
    city: geo?.city?.names?.en,
    lat: geo?.location?.latitude,
    lon: geo?.location?.longitude,
    timezone: geo?.location?.time_zone,
    isp: geo?.traits?.isp, // requires commercial DB
  };
};
