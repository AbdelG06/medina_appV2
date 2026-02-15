import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import linkdin from "../assets/linkdin.jpg";

const team = [
  {
    name: "Aya Et-touil",
    email: "ayaettouil4@gmail.com",
    linkedin: "https://www.linkedin.com/in/aya-et_touil",
    linkedinUrl: "/aya-et_touil",
  },
  {
    name: "Aya IDRISSI-EL-BOUZAIDI",
    email: "aya18idrissi@gmail.com",
    linkedin: "https://www.linkedin.com/in/aya-idrissi-el-bouzaidi",
    linkedinUrl: "/aya-idrissi-el-bouzaidi",
  },
  {
    name: "Abdelkrim Garwaoui",
    email: "a.garwaoui@icloud.com",
    linkedin: "https://www.linkedin.com/in/abdelkrim-garwaoui",
    linkedinUrl: "/abdelkrim-garwaoui",
  },
];

const AboutPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6 text-center">À propos de nous</h1>
        <p className="font-body text-lg text-muted-foreground mb-8 text-center">
          Cette application est dédiée à la découverte de la médina de Fès, patrimoine mondial de l’UNESCO, et à la valorisation de ses artisans, monuments, hébergements et lieux de vie. Elle a été conçue pour offrir une expérience immersive, moderne et accessible à tous les visiteurs et passionnés de la ville.
        </p>
        <div className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-moroccan-ochre-dark mb-4 text-center">L’équipe</h2>
          <ul className="space-y-6">
            {team.map((member) => (
              <li key={member.name} className="flex items-center gap-4 bg-background border border-border rounded-lg p-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <img src={linkdin} alt="LinkedIn" className="w-7 h-7 object-contain rounded" />
                  </a>
                </div>
                <div>
                  <div className="font-heading text-lg text-foreground">{member.name}</div>
                  <div className="font-body text-sm text-muted-foreground">{member.email}</div>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline">LinkedIn{member.linkedinUrl}</a>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>
            © 2026 Médina de Fès — Application réalisée par l’équipe ci-dessus.<br />
            Tous droits réservés.
          </p>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default AboutPage;
