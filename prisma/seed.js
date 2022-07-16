import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { addons } from './data/addons.js';


// =============================================================================


/* This will seed the database with all of the required database content to get
 * the app up and running.
 *
 * Primarily for the moment we're concerning ourselves with the Addons that we
 * are supporting on the site. */
async function seed() {
  const result = await Promise.all(addons.map(async (item) => {
    return await prisma.twitchAddon.upsert({
      where: { addonId: item.addonId },
      update: item,
      create: item
    });
  }));

  console.log(result)
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