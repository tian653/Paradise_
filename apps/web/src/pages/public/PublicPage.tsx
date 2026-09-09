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

const DEFAULT_PROFILE: SiteSettings = {
  id: 1,
  communityName: "Paradise",
  tagline: "Dairi Horas Njuah Njuah",
  shortDescription:
    "Wadah mahasiswa asal Kabupaten Dairi di Kota Semarang untuk membangun kebersamaan, solidaritas, dan kekeluargaan.",
  about:
    "PARADISE merupakan organisasi mahasiswa asal Kabupaten Dairi yang berada di Kota Semarang.",
  history: "",
  vision: "",
  mission: "",
  logoUrl:
    "https://res.cloudinary.com/tmndf3jh/image/upload/v1788931337/paradise_community/dq41wqyxuwemivwvcp9w.png",
  heroImageUrl:
    "https://res.cloudinary.com/tmndf3jh/image/upload/v1788935209/paradise_community/kou4tdutrjn39jwwzgpv.jpg",
  updatedAt: new Date().toISOString(),
};

export default function PublicPage() {
  const [profile, setProfile] = useState<SiteSettings>(() => {
    try {
      const cached = localStorage.getItem("paradise_profile");
      return cached ? JSON.parse(cached) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const cached = localStorage.getItem("paradise_activities");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const cached = localStorage.getItem("paradise_gallery");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [officers, setOfficers] = useState<Officer[]>(() => {
    try {
      const cached = localStorage.getItem("paradise_officers");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [contact, setContact] = useState<Contact | null>(() => {
    try {
      const cached = localStorage.getItem("paradise_contact");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
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

  useEffect(() => {
    if (profile?.logoUrl) {
      const link = (document.querySelector("link[rel*='icon']") || document.createElement("link")) as HTMLLinkElement;
      link.type = "image/png";
      link.rel = "icon";
      link.href = profile.logoUrl;
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }, [profile?.logoUrl]);

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
