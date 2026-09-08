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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prof, acts, gal, offs, con] = await Promise.all([
          api.getProfile(),
          api.getActivities(),
          api.getGallery(),
          api.getOfficers(),
          api.getContact(),
        ]);
        setProfile(prof);
        setActivities(acts);
        setGallery(gal);
        setOfficers(offs);
        setContact(con);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg)",
        }}
      >
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

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
