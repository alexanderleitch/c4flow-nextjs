export const SITE_CONFIG = {
  name: "C-4 Flow",
  tagline: "Pole & Exotic Dance Studio",
  motto: "Move to Express",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.c4flow.co.za",
  email: "marc@duby.io",
  phone: "+27 65 391 7901",
  whatsapp: {
    number: "27725884371",
    message: "Hey, I'm interested in booking a class with you!",
  },
  address: {
    street: "66 Albert Road",
    building: "Woodstock Exchange",
    city: "Cape Town",
    province: "Western Cape",
    postalCode: "8001",
    country: "South Africa",
  },
  social: {
    instagram: "https://www.instagram.com/c_4_flow/",
    instructorInstagram: "https://www.instagram.com/cattleya_mystic_muse/",
  },
  booking: {
    platform: "WhatsApp",
    url: "https://wa.me/27725884371?text=Hey%2C%20I%27m%20interested%20in%20booking%20a%20class%20with%20you!",
  },
  maps: {
    lat: -33.926702,
    lng: 18.4434095,
    zoom: 17,
    url: "https://www.google.com/maps/place/Woodstock+Exchange/@-33.926702,18.4434095,17z/",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Classes", href: "/classes" },
  { label: "Contact", href: "/contact" },
] as const;
