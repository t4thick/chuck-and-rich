export const STORE = {
  name: 'Lovely Queen African Market',
  shortName: 'Lovely Queen Market',
  tagline: 'African & Caribbean groceries, delivered fast.',
  address: '1668 E Dublin Granville Rd, Columbus, OH 43229',
  /** Ship-from for USPS/UPS labels (Shippo). Env vars override these. */
  shipFrom: {
    street1: '1668 E Dublin Granville Rd',
    street2: '',
    city: 'Columbus',
    state: 'OH',
    zip: '43229',
    country: 'US',
    phone: '6144460893',
  },
  phone: '(614) 446-0893',
  phoneHref: 'tel:+16144460893',
  hours: 'Mon–Sat 9am–8pm · Sun 10am–6pm',
} as const
