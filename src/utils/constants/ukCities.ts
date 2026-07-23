export const UK_CITIES = [
  "Aberdeen",
  "Armagh",
  "Bangor",
  "Bath",
  "Belfast",
  "Birmingham",
  "Blackburn",
  "Blackpool",
  "Bolton",
  "Bournemouth",
  "Bradford",
  "Brighton",
  "Bristol",
  "Cambridge",
  "Canterbury",
  "Cardiff",
  "Carlisle",
  "Chelmsford",
  "Chester",
  "Chichester",
  "Coventry",
  "Derby",
  "Derry",
  "Dundee",
  "Durham",
  "Edinburgh",
  "Ely",
  "Exeter",
  "Glasgow",
  "Gloucester",
  "Hereford",
  "Inverness",
  "Ipswich",
  "Kingston upon Hull",
  "Lancaster",
  "Leeds",
  "Leicester",
  "Lichfield",
  "Lincoln",
  "Lisburn",
  "Liverpool",
  "London",
  "Londonderry",
  "Manchester",
  "Newcastle upon Tyne",
  "Newport",
  "Newry",
  "Norwich",
  "Nottingham",
  "Oxford",
  "Perth",
  "Peterborough",
  "Plymouth",
  "Portsmouth",
  "Preston",
  "Reading",
  "Ripon",
  "Salford",
  "Salisbury",
  "Sheffield",
  "Southampton",
  "St Albans",
  "St Asaph",
  "St Davids",
  "Stirling",
  "Stoke-on-Trent",
  "Sunderland",
  "Swansea",
  "Truro",
  "Wakefield",
  "Wells",
  "Westminster",
  "Winchester",
  "Wolverhampton",
  "Worcester",
  "York",
  // London boroughs / major districts
  "Barking and Dagenham",
  "Barnet",
  "Bexley",
  "Brent",
  "Bromley",
  "Camden",
  "Croydon",
  "Ealing",
  "Enfield",
  "Greenwich",
  "Hackney",
  "Hammersmith and Fulham",
  "Haringey",
  "Harrow",
  "Havering",
  "Hillingdon",
  "Hounslow",
  "Islington",
  "Kensington and Chelsea",
  "Kingston upon Thames",
  "Lambeth",
  "Lewisham",
  "Merton",
  "Newham",
  "Redbridge",
  "Richmond upon Thames",
  "Southwark",
  "Sutton",
  "Tower Hamlets",
  "Waltham Forest",
  "Wandsworth",
] as const;

export function isUnitedKingdom({
  countryCode,
  countryName,
}: {
  countryCode?: string | null;
  countryName?: string | null;
} = {}): boolean {
  const code = (countryCode ?? "").trim().toUpperCase();
  if (code === "GB" || code === "UK") return true;

  const name = (countryName ?? "").trim().toLowerCase();
  return (
    name === "uk" ||
    name === "u.k." ||
    name.includes("united kingdom") ||
    name.includes("great britain")
  );
}

export function citiesForCountry({
  countryCode,
  countryName,
}: {
  countryCode?: string | null;
  countryName?: string | null;
} = {}): string[] {
  if (isUnitedKingdom({ countryCode, countryName })) {
    return [...UK_CITIES].sort((a, b) => a.localeCompare(b));
  }
  return [];
}
