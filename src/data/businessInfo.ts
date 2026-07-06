// Single source of truth for business contact / NAP (Name, Address, Phone).
// MUST stay identical to the peptide-south-africa.com store and the Google
// Business Profile — the two sites share one business, and NAP consistency
// across the ecosystem is a core local-SEO ranking factor.

export const businessInfo = {
  legalName: 'Peptide South Africa',
  streetAddress: 'De Buurt, Richwood',
  addressLocality: 'Milnerton',
  addressRegion: 'Western Cape',
  postalCode: '7441',
  addressCountry: 'ZA',
  telephone: '+27721790189',            // E.164 for schema / tel: links
  telephoneDisplay: '+27 72 179 0189',
  email: 'contact@peptide-south-africa.com',
  geo: { latitude: -33.8686, longitude: 18.5426 }, // Richwood / Milnerton, Cape Town
};

/** PostalAddress fragment for schema.org. */
export function postalAddressSchema() {
  return {
    '@type': 'PostalAddress',
    streetAddress: businessInfo.streetAddress,
    addressLocality: businessInfo.addressLocality,
    addressRegion: businessInfo.addressRegion,
    postalCode: businessInfo.postalCode,
    addressCountry: businessInfo.addressCountry,
  };
}
