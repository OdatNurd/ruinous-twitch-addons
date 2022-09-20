import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { addon_one } from '#seed/addons/addon_one';
import { addon_two } from '#seed/addons/addon_two';
import { addon_three } from '#seed/addons/addon_three';

import { users } from '#seed/users';
import { userAddons } from '#seed/userAddons';


// =============================================================================


async function seedAddons() {
  const addons = [ addon_one, addon_two, addon_three ];
  const result = await Promise.all(addons.map(async (item) => {
    return prisma.twitchAddon.upsert({
      where: { addonId: item.addonId },
      update: item,
      create: item
    });
  }));

  console.log("========== Addons ==========\n", result, "\n");
}


// =============================================================================


async function seedUsers() {
  const result = await Promise.all(users.map(async (item) => {
    return prisma.twitchUser.upsert({
      where: {
        userId: item.userId
      },
      update: item,
      create: item
    });
  }));

  console.log("========== Users ==========\n", result, "\n");
}


// =============================================================================


async function seedUserAddons() {
  const result = await Promise.all(userAddons.map(async (item) => {
    return prisma.twitchUserAddons.upsert({
      where: {
        userId_addonId: {
          userId: item.userId,
          addonId: item.addonId,
        }
      },
      update: item,
      create: item
    });
  }));

  console.log("========== User Addons ==========\n", result, "\n");

}


// =============================================================================


/* This will seed the database with all of the required database content to get
 * the app up and running.
 *
 * Primarily for the moment we're concerning ourselves with the Addons that we
 * are supporting on the site. */
async function seed() {
  await seedAddons();
  await seedUsers();
  await seedUserAddons();
}


// =============================================================================


seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })