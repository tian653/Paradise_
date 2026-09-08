import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { db } from "../src/db/index.js";
import { admins } from "../src/db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function changePassword() {
  const newPassword = process.argv[2];

  if (!newPassword) {
    console.error("❌ Error: Harap masukkan password baru!");
    console.error('Contoh penggunaan: npx tsx scripts/change-password.ts "passwordBaruSaya123"');
    process.exit(1);
  }

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // Asumsikan username admin adalah 'admin'
    await db.update(admins)
      .set({ passwordHash })
      .where(eq(admins.username, "admin"));
      
    console.log(`✅ Sukses! Password untuk akun 'admin' berhasil diubah menjadi: ${newPassword}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Gagal mengubah password:", error);
    process.exit(1);
  }
}

changePassword();
