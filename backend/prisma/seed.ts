import { PrismaClient, RegistryStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { buildAffiliateUrl } from '../src/services/affiliate.service';

const prisma = new PrismaClient();

const seed = async () => {
  const password = await bcrypt.hash('Karma', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@me.com' },
    update: {},
    create: {
      email: 'admin@me.com',
      password,
      name: 'TMBC Admin',
      role: Role.ADMIN,
    },
  });

  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@me.com' },
    update: {},
    create: {
      email: 'mentor@me.com',
      password,
      name: 'Taylor Mentor',
      role: Role.MENTOR,
    },
  });

  await prisma.invite.upsert({
    where: { code: 'ADMIN-INVITE' },
    update: {},
    create: {
      code: 'ADMIN-INVITE',
      role: Role.MEMBER,
      createdById: admin.id,
    },
  });

  await prisma.invite.upsert({
    where: { code: 'MENTOR-INVITE' },
    update: {},
    create: {
      code: 'MENTOR-INVITE',
      role: Role.MEMBER,
      createdById: mentor.id,
    },
  });

  // placeholder member for dashboard data
  const member = await prisma.user.upsert({
    where: { email: 'member@me.com' },
    update: {},
    create: {
      email: 'member@me.com',
      password,
      name: 'Founding Member',
      role: Role.MEMBER,
    },
  });

  const products = [
    {
      id: 'nuna-pipa-rx',
      name: 'Nuna PIPA rx Infant Car Seat',
      brand: 'Nuna',
      category: 'infant-car-seat',
      imageUrl: 'https://images.tmbc.app/products/nuna-pipa-rx.jpg',
      affiliateUrl: 'https://www.macrobaby.com/products/nuna-pipa-rx',
      merchant: 'MacroBaby',
      moduleCodes: ['car-seat-masterclass', 'travel-system-lab'],
      price: 549,
    },
    {
      id: 'uppababy-mesa-max',
      name: 'UPPAbaby MESA Max',
      brand: 'UPPAbaby',
      category: 'infant-car-seat',
      imageUrl: 'https://images.tmbc.app/products/mesa-max.jpg',
      affiliateUrl: 'https://www.albeebaby.com/uppababy-mesa-max.html',
      merchant: 'AlbeeBaby',
      moduleCodes: ['car-seat-masterclass'],
      price: 399,
    },
    {
      id: 'cybex-cloud-g',
      name: 'Cybex Cloud G',
      brand: 'Cybex',
      category: 'convertible-car-seat',
      imageUrl: 'https://images.tmbc.app/products/cybex-cloud-g.jpg',
      affiliateUrl: 'https://www.silvercrossus.com/products/cybex-cloud-g',
      merchant: 'SilverCross',
      moduleCodes: ['car-seat-masterclass', 'gear-journey'],
      price: 579,
    },
    {
      id: 'hatch-rest-plus',
      name: 'Hatch Rest+ Sound Machine',
      brand: 'Hatch',
      category: 'sound-machine',
      imageUrl: 'https://images.tmbc.app/products/hatch-rest-plus.jpg',
      affiliateUrl: 'https://www.awin1.com/cread.php?rest-plus',
      merchant: 'Awin',
      moduleCodes: ['safe-sleep-nursery'],
      price: 199,
    },
    {
      id: 'snuggle-me-organic',
      name: 'Snuggle Me Organic Infant Lounger',
      brand: 'Snuggle Me',
      category: 'lounger',
      imageUrl: 'https://images.tmbc.app/products/snuggle-me.jpg',
      affiliateUrl: 'https://www.macrobaby.com/products/snuggle-me',
      merchant: 'MacroBaby',
      moduleCodes: ['safe-sleep-nursery', 'essentials-refresh'],
      price: 109,
    },
    {
      id: 'elvie-stride',
      name: 'Elvie Stride Breast Pump',
      brand: 'Elvie',
      category: 'pumping',
      imageUrl: 'https://images.tmbc.app/products/elvie-stride.jpg',
      affiliateUrl: 'https://www.impact.com/elvie-stride',
      merchant: 'Impact',
      moduleCodes: ['feeding-essentials'],
      price: 399,
    },
  ];

  for (const product of products) {
    const { id, ...productData } = product;
    await prisma.product.upsert({
      where: { id },
      update: productData,
      create: { id, ...productData },
    });
  }

  const resolveProduct = (id: string) => products.find((product) => product.id === id)!;

  const nuna = resolveProduct('nuna-pipa-rx');
  await prisma.registryItem.upsert({
    where: { id: 'registry-nuna' },
    update: {},
    create: {
      id: 'registry-nuna',
      userId: member.id,
      productId: 'nuna-pipa-rx',
      title: nuna.name,
      url: buildAffiliateUrl({ url: nuna.affiliateUrl, merchant: nuna.merchant }),
      merchant: nuna.merchant,
      category: nuna.category,
      moduleCode: nuna.moduleCodes[0],
      image: nuna.imageUrl,
      price: nuna.price,
      quantity: 1,
      status: RegistryStatus.NEEDED,
      notes: 'Primary seat from newborn through the first year.',
    },
  });

  const hatch = resolveProduct('hatch-rest-plus');
  await prisma.registryItem.upsert({
    where: { id: 'registry-hatch' },
    update: {},
    create: {
      id: 'registry-hatch',
      userId: member.id,
      productId: 'hatch-rest-plus',
      title: hatch.name,
      url: buildAffiliateUrl({ url: hatch.affiliateUrl, merchant: hatch.merchant }),
      merchant: hatch.merchant,
      category: hatch.category,
      moduleCode: hatch.moduleCodes[0],
      image: hatch.imageUrl,
      price: hatch.price,
      quantity: 1,
      status: RegistryStatus.RESERVED,
      notes: 'Night nurse recommended for gentle sound.',
    },
  });

  await prisma.mentorNote.upsert({
    where: { id: 'note-nuna' },
    update: {
      note: 'Watch for the spring MacroBaby sale—usually drops to $499.',
    },
    create: {
      id: 'note-nuna',
      memberId: member.id,
      mentorId: mentor.id,
      productId: 'nuna-pipa-rx',
      note: 'Watch for the spring MacroBaby sale—usually drops to $499.',
    },
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-console
    console.log('Seed complete');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
