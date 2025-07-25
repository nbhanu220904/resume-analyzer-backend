const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.resume.create({
    data: {
      fileName: "sample_resume.pdf",
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "1234567890",
      linkedinUrl: "https://linkedin.com/in/janedoe",
      portfolioUrl: "https://janedoe.dev",
      summary: "Full-stack developer with 5 years experience.",
      workExperience: [
        {
          company: "TechCorp",
          role: "Frontend Developer",
          duration: "2 years",
          description: ["Built React apps", "Led UI redesign"],
        },
      ],
      education: [
        {
          degree: "B.Tech",
          institution: "VIT Bhimavaram",
          graduation_year: "2024",
        },
      ],
      technicalSkills: ["React", "Node.js", "PostgreSQL"],
      softSkills: ["Teamwork", "Communication"],
      resumeRating: 8,
      improvementAreas: "Expand leadership experience.",
      upskillSuggestions: ["Learn DevOps", "Contribute to OSS"],
    },
  });

  console.log("✅ Seed data inserted.");
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
