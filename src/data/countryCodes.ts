export interface CountryCode {
  iso: string;
  dial: string;
  name: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { iso: "DE", dial: "+49", name: "Germany", flag: "🇩🇪" },
  { iso: "US", dial: "+1", name: "United States", flag: "🇺🇸" },
  { iso: "GB", dial: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { iso: "ZA", dial: "+27", name: "South Africa", flag: "🇿🇦" },
  { iso: "AU", dial: "+61", name: "Australia", flag: "🇦🇺" },
  { iso: "CA", dial: "+1", name: "Canada", flag: "🇨🇦" },
  { iso: "NL", dial: "+31", name: "Netherlands", flag: "🇳🇱" },
  { iso: "FR", dial: "+33", name: "France", flag: "🇫🇷" },
  { iso: "ES", dial: "+34", name: "Spain", flag: "🇪🇸" },
  { iso: "IT", dial: "+39", name: "Italy", flag: "🇮🇹" },
  { iso: "CH", dial: "+41", name: "Switzerland", flag: "🇨🇭" },
  { iso: "AT", dial: "+43", name: "Austria", flag: "🇦🇹" },
  { iso: "BE", dial: "+32", name: "Belgium", flag: "🇧🇪" },
  { iso: "SE", dial: "+46", name: "Sweden", flag: "🇸🇪" },
  { iso: "NO", dial: "+47", name: "Norway", flag: "🇳🇴" },
  { iso: "DK", dial: "+45", name: "Denmark", flag: "🇩🇰" },
  { iso: "FI", dial: "+358", name: "Finland", flag: "🇫🇮" },
  { iso: "IE", dial: "+353", name: "Ireland", flag: "🇮🇪" },
  { iso: "PT", dial: "+351", name: "Portugal", flag: "🇵🇹" },
  { iso: "PL", dial: "+48", name: "Poland", flag: "🇵🇱" },
  { iso: "AE", dial: "+971", name: "UAE", flag: "🇦🇪" },
  { iso: "IL", dial: "+972", name: "Israel", flag: "🇮🇱" },
  { iso: "NZ", dial: "+64", name: "New Zealand", flag: "🇳🇿" },
  { iso: "SG", dial: "+65", name: "Singapore", flag: "🇸🇬" },
  { iso: "JP", dial: "+81", name: "Japan", flag: "🇯🇵" },
];
