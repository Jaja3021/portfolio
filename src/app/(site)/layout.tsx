import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { FilterProvider } from "@/context/FilterContext";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <FilterProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </FilterProvider>
  );
}
