import type { StaticImageData } from "next/image";
import ayala from "../../img/trimmed/ayala.webp";
import cbdi from "../../img/trimmed/CBDI.webp";
import dmci from "../../img/trimmed/dmci.webp";
import masaito from "../../img/trimmed/Masaito.webp";
import megaworld from "../../img/trimmed/megaworld.webp";
import raemulan from "../../img/trimmed/raemulan.png";

// Only include developers Arnold is officially accredited with.
// TODO: Arnold to confirm each developer below is a current, official accreditation.
export const ACCREDITED_DEVELOPERS: { name: string; logo: StaticImageData }[] = [
  { name: "CBDI", logo: cbdi },
  { name: "Raemulan Lands", logo: raemulan },
  { name: "Masaito Homes", logo: masaito },
  { name: "Ayala Land", logo: ayala },
  { name: "Megaworld", logo: megaworld },
  { name: "DMCI Homes", logo: dmci },
];
