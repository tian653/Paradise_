import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { SiteSettings, Activity, GalleryItem, Officer, Contact } from "../../lib/types";
import Navbar from "../../components/public/Navbar";
import HeroSection from "../../components/public/HeroSection";
import AboutSection from "../../components/public/AboutSection";
import ActivitiesSection from "../../components/public/ActivitiesSection";
import GallerySection from "../../components/public/GallerySection";
import OfficersSection from "../../components/public/OfficersSection";
import ContactSection from "../../components/public/ContactSection";
import Footer from "../../components/public/Footer";
import FloatingActions from "../../components/public/FloatingActions";

export default function PublicPage() {
  const [profile, setProfile] = useState<SiteSettings | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    // ── Restore cached profile instantly to avoid logo flash ──────────────────
    const cached = localStorage.getItem("paradise_profile");
    if (cached) {
      try { setProfile(JSON.parse(cached)); } catch { /* ignore */ }
    }

    // Fetch each independently so one endpoint failure never blocks the page render
    api.getProfile().then((data) => {
      setProfile(data);
      localStorage.setItem("paradise_profile", JSON.stringify(data));
    }).catch(() => {});
    api.getActivities().then(setActivities).catch(() => {});
    api.getGallery().then(setGallery).catch(() => {});
    api.getOfficers().then(setOfficers).catch(() => {});
    api.getContact().then(setContact).catch(() => {});
  }, []);

  return (
    <>
      <Navbar
        communityName={profile?.communityName}
        logoUrl={profile?.logoUrl}
      />

      <main>
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <ActivitiesSection activities={activities} />
        <GallerySection gallery={gallery} />
        <OfficersSection officers={officers} />
        <ContactSection contact={contact} />
      </main>

      <Footer
        communityName={profile?.communityName}
        shortDescription={profile?.shortDescription}
        logoUrl={profile?.logoUrl}
      />

      <FloatingActions whatsapp={contact?.whatsapp} />
    </>
  );
}
