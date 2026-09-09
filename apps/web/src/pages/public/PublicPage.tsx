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
    // ── Restore cached data instantly (0ms latency) ──────────────────────────
    try {
      const cachedProfile = localStorage.getItem("paradise_profile");
      if (cachedProfile) setProfile(JSON.parse(cachedProfile));

      const cachedActivities = localStorage.getItem("paradise_activities");
      if (cachedActivities) setActivities(JSON.parse(cachedActivities));

      const cachedGallery = localStorage.getItem("paradise_gallery");
      if (cachedGallery) setGallery(JSON.parse(cachedGallery));

      const cachedOfficers = localStorage.getItem("paradise_officers");
      if (cachedOfficers) setOfficers(JSON.parse(cachedOfficers));

      const cachedContact = localStorage.getItem("paradise_contact");
      if (cachedContact) setContact(JSON.parse(cachedContact));
    } catch {
      /* ignore storage parse errors */
    }

    // ── Fetch fresh data silently in background ──────────────────────────────
    api
      .getProfile()
      .then((data) => {
        setProfile(data);
        localStorage.setItem("paradise_profile", JSON.stringify(data));
      })
      .catch(() => {});

    api
      .getActivities()
      .then((data) => {
        setActivities(data);
        localStorage.setItem("paradise_activities", JSON.stringify(data));
      })
      .catch(() => {});

    api
      .getGallery()
      .then((data) => {
        setGallery(data);
        localStorage.setItem("paradise_gallery", JSON.stringify(data));
      })
      .catch(() => {});

    api
      .getOfficers()
      .then((data) => {
        setOfficers(data);
        localStorage.setItem("paradise_officers", JSON.stringify(data));
      })
      .catch(() => {});

    api
      .getContact()
      .then((data) => {
        setContact(data);
        localStorage.setItem("paradise_contact", JSON.stringify(data));
      })
      .catch(() => {});
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
