import "dotenv/config"
import { randomUUID } from "node:crypto"

import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../generated/prisma/client"
import { hashPassword } from "better-auth/crypto"

const SEED_COUNT = 100
const SEED_PASSWORD = "Password123!"
const SEED_EMAIL_DOMAIN = "seed.local"

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }

  const adapter = new PrismaMariaDb(connectionString)
  return new PrismaClient({ adapter })
}

function seedEmail(index: number) {
  const padded = String(index).padStart(3, "0")
  return `user-${padded}@${SEED_EMAIL_DOMAIN}`
}

function seedName(index: number) {
  const padded = String(index).padStart(3, "0")
  return `Seed User ${padded}`
}

async function main() {
  const prisma = createPrismaClient()
  const passwordHash = await hashPassword(SEED_PASSWORD)

  let created = 0
  let skipped = 0

  try {
    for (let index = 1; index <= SEED_COUNT; index++) {
      const email = seedEmail(index)
      const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      })

      if (existing) {
        skipped += 1
        continue
      }

      const userId = randomUUID()

      await prisma.user.create({
        data: {
          id: userId,
          name: seedName(index),
          email,
          emailVerified: true,
          role: "user",
          banned: false,
          accounts: {
            create: {
              id: randomUUID(),
              accountId: userId,
              providerId: "credential",
              password: passwordHash,
            },
          },
        },
      })

      created += 1
    }

    console.log(
      `Seed fertig: ${created} Nutzer angelegt, ${skipped} übersprungen.`
    )
    console.log(`Login-Passwort für Seed-Nutzer: ${SEED_PASSWORD}`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
