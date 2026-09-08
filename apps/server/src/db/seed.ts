import bcrypt from "bcryptjs";
import { db } from "./index.js";
import {
  siteSettings,
  activities,
  gallery,
  officers,
  contact,
  admins,
} from "./schema.js";

async function seed() {
  console.log("🌱 Seeding database...");

  // ── Site Settings ──────────────────────────────────────────────────────────
  const existingSettings = await db.select().from(siteSettings);
  if (existingSettings.length === 0) {
    await db.insert(siteSettings)
      .values({
        communityName: "Paradise",
        tagline: "Tempat Bertumbuh, Berkarya, dan Bersama",
        shortDescription:
          "Paradise adalah komunitas mahasiswa yang berdiri sejak 2013, mengedepankan nilai persaudaraan, kreativitas, dan pengembangan diri bersama.",
        about:
          "Paradise merupakan komunitas mahasiswa yang lahir dari semangat kebersamaan dan keinginan untuk saling mendukung dalam perjalanan akademik maupun kehidupan kampus. Kami percaya bahwa bersama, setiap individu dapat tumbuh menjadi versi terbaiknya.\n\nSejak didirikan, Paradise telah menjadi rumah bagi ratusan mahasiswa yang saling menginspirasi dan mendukung satu sama lain. Kami aktif dalam berbagai kegiatan sosial, olahraga, dan pengembangan diri yang membentuk karakter anggota kami.",
        history:
          "Paradise berdiri pada tahun 2017, diawali dari sekelompok mahasiswa yang memiliki visi yang sama — membangun komunitas yang hangat, inklusif, dan berdampak positif di lingkungan kampus.\n\nBerawal dari pertemuan kecil yang penuh antusias, Paradise berkembang pesat dari generasi ke generasi. Setiap angkatan membawa semangat baru dan memberi warna tersendiri bagi komunitas.\n\nHingga tahun 2026, Paradise telah melewati hampir satu dekade penuh perjalanan, cerita, dan kenangan yang tak ternilai bersama lebih dari seribu anggota dari berbagai angkatan.",
        vision:
          "Menjadi komunitas mahasiswa yang unggul, inklusif, dan berdampak positif bagi lingkungan kampus dan masyarakat sekitar.",
        mission:
          "1. Membangun persaudaraan yang tulus dan hubungan yang bermakna antar anggota\n2. Mendorong pengembangan diri melalui kegiatan yang positif dan bermakna\n3. Menciptakan lingkungan yang suportif dan inklusif bagi seluruh anggota\n4. Menjalin hubungan baik dengan komunitas lain dan masyarakat sekitar\n5. Melestarikan nilai-nilai Paradise kepada setiap generasi baru",
        logoUrl: null,
        heroImageUrl:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
      });
    console.log("✅ Site settings seeded");
  }

  // ── Activities ─────────────────────────────────────────────────────────────
  const existingActivities = await db.select().from(activities);
  if (existingActivities.length === 0) {
    await db.insert(activities)
      .values([
        {
          name: "Gathering Paradise 2025",
          date: "Oktober 2025",
          description:
            "Acara gathering tahunan yang mempertemukan seluruh anggota Paradise dari berbagai angkatan. Penuh kehangatan, cerita, dan semangat kebersamaan.",
          imageUrl:
            "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80",
          sortOrder: 1,
        },
        {
          name: "Penerimaan Anggota Baru 2024",
          date: "September 2024",
          description:
            "Momen istimewa menyambut anggota baru Paradise yang akan meneruskan tradisi dan semangat komunitas ke depannya.",
          imageUrl:
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80",
          sortOrder: 2,
        },
        {
          name: "Bakti Sosial Ramadan 2024",
          date: "Maret 2024",
          description:
            "Kegiatan sosial berbagi kebahagiaan di bulan Ramadan — membagikan sembako kepada masyarakat sekitar yang membutuhkan.",
          imageUrl:
            "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80",
          sortOrder: 3,
        },
        {
          name: "Tournament Futsal Antar Divisi",
          date: "Februari 2024",
          description:
            "Kompetisi futsal seru antar divisi Paradise yang mempererat persaudaraan sekaligus menjaga kesehatan anggota.",
          imageUrl:
            "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80",
          sortOrder: 4,
        },
        {
          name: "Workshop Pengembangan Diri",
          date: "November 2023",
          description:
            "Sesi pengembangan diri yang menghadirkan narasumber inspiratif untuk membekali anggota dengan skills kehidupan dan karir.",
          imageUrl:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
          sortOrder: 5,
        },
        {
          name: "Malam Keakraban Paradise",
          date: "Agustus 2023",
          description:
            "Malam keakraban penuh keceriaan yang menghadirkan penampilan seni, permainan, dan momen tak terlupakan bagi seluruh anggota.",
          imageUrl:
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
          sortOrder: 6,
        },
      ]);
    console.log("✅ Activities seeded");
  }

  // ── Gallery ────────────────────────────────────────────────────────────────
  const existingGallery = await db.select().from(gallery);
  if (existingGallery.length === 0) {
    await db.insert(gallery)
      .values([
        {
          imageUrl:
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
          caption: "Kebersamaan di setiap momen",
          sortOrder: 1,
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
          caption: "Gathering tahunan Paradise",
          sortOrder: 2,
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
          caption: "Selamat datang anggota baru",
          sortOrder: 3,
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
          caption: "Momen bersama yang tak terlupakan",
          sortOrder: 4,
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1543269664-56d93c216f63?w=800&q=80",
          caption: "Semangat kebersamaan Paradise",
          sortOrder: 5,
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
          caption: "Malam keakraban yang meriah",
          sortOrder: 6,
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=800&q=80",
          caption: "Bersama meraih impian",
          sortOrder: 7,
        },
        {
          imageUrl:
            "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80",
          caption: "Komunitas yang hangat dan inklusif",
          sortOrder: 8,
        },
      ]);
    console.log("✅ Gallery seeded");
  }

  // ── Officers ───────────────────────────────────────────────────────────────
  const existingOfficers = await db.select().from(officers);
  if (existingOfficers.length === 0) {
    await db.insert(officers)
      .values([
        {
          name: "Rizky Pratama",
          position: "Ketua",
          photoUrl:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
          sortOrder: 1,
        },
        {
          name: "Sari Dewi",
          position: "Wakil Ketua",
          photoUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
          sortOrder: 2,
        },
        {
          name: "Ahmad Fauzi",
          position: "Sekretaris",
          photoUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
          sortOrder: 3,
        },
        {
          name: "Putri Rahayu",
          position: "Bendahara",
          photoUrl:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
          sortOrder: 4,
        },
        {
          name: "Dimas Arya",
          position: "Koordinator Acara",
          photoUrl:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
          sortOrder: 5,
        },
      ]);
    console.log("✅ Officers seeded");
  }

  // ── Contact ────────────────────────────────────────────────────────────────
  const existingContact = await db.select().from(contact);
  if (existingContact.length === 0) {
    await db.insert(contact)
      .values({
        instagram: "@paradise.community",
        whatsapp: "628123456789",
        email: "paradisecommunity@gmail.com",
        additional: "[]",
      });
    console.log("✅ Contact seeded");
  }

  // ── Admin ──────────────────────────────────────────────────────────────────
  const existingAdmin = await db.select().from(admins);
  if (existingAdmin.length === 0) {
    const passwordHash = await bcrypt.hash("paradise2026", 12);
    await db.insert(admins)
      .values({
        username: "admin",
        passwordHash,
      });
    console.log("✅ Admin seeded (username: admin, password: paradise2026)");
  }

  console.log("\n🎉 Seed completed!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
