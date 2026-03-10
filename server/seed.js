import mongoose from "mongoose";
import { env } from "./config/env.js";
import { User } from "./models/User.js";
import { Monument } from "./models/Monument.js";
import { Product } from "./models/Product.js";

const users = [
  {
    name: "Admin Seed",
    email: "admin@seed.com",
    password: "admin123", // Hash en prod !
    role: "admin"
  },
  {
    name: "User Seed",
    email: "user@seed.com",
    password: "user123",
    role: "user"
  }
];

const monuments = [
  {
    name: "Bab Boujloud",
    description: "Porte emblématique de Fès.",
    location: "Fès Medina"
  }
];

const products = [
  {
    name: "Tapis Marocain",
    price: 120,
    description: "Tapis artisanal de Fès."
  }
];

async function seed() {
  await mongoose.connect(env.mongoUri);
  console.log("Connecté à MongoDB");

  await User.deleteMany();
  await Monument.deleteMany();
  await Product.deleteMany();

  await User.insertMany(users);
  await Monument.insertMany(monuments);
  await Product.insertMany(products);

  console.log("Seed terminé !");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
