import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/contact/FloatingContact";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { ScrollEffects } from "@/components/motion/ScrollEffects";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingContact />
      <MobileActionBar />
      <ScrollEffects />
    </>
  );
}
