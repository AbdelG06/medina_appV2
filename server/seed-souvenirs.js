import { env } from "./config/env.js";
import { SouvenirPhoto } from "./models/SouvenirPhoto.js";
import { User } from "./models/User.js";
import { hashPassword } from "./utils/security.js";

const demoSouvenirs = [
  {
    caption: "Couleurs de la medina au coucher du soleil.",
    imageUrl: "/souvenirs/boujloud2.jpg",
  },
  {
    caption: "Patrimoine et architecture traditionnelle.",
    imageUrl: "/souvenirs/dar-batha.jpg",
  },
  {
    caption: "Ambiance artisanale a Seffarine.",
    imageUrl: "/souvenirs/seffarine.jpg",
  },
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const ensureSouvenirsDemoData = async (adminUserId) => {
  const demoEmail = String(env.demoUserEmail || "").trim().toLowerCase();
  const demoPassword = String(env.demoUserPassword || "");

  let demoUser = await User.findOne({ email: demoEmail });
  if (!demoUser) {
    demoUser = await User.create({
      firstName: env.demoUserFirstName,
      lastName: env.demoUserLastName,
      email: demoEmail,
      passwordHash: await hashPassword(demoPassword),
      role: "user",
      status: "accepted",
      bio: "Passionne(e) de la medina de Fes.",
    });
  }

  const likeCandidates = await User.find({ _id: { $in: [adminUserId, demoUser._id] } })
    .select("_id")
    .lean();
  const likeIds = likeCandidates.map((item) => item._id);

  const toInsert = [];
  for (const item of demoSouvenirs) {
    const exists = await SouvenirPhoto.exists({
      imageUrl: item.imageUrl,
      caption: item.caption,
      isApproved: true,
    });
    if (exists) continue;

    const likes =
      likeIds.length && Math.random() > 0.35
        ? likeIds.filter(() => Math.random() > 0.4)
        : [];

    toInsert.push({
      user: demoUser._id,
      caption: item.caption,
      imageUrl: item.imageUrl,
      isApproved: true,
      views: randomInt(120, 3800),
      likes,
      comments: [],
    });
  }

  if (toInsert.length) {
    await SouvenirPhoto.insertMany(toInsert);
  }

  return { demoUser };
};
