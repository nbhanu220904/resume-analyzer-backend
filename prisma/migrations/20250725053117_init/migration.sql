-- CreateTable
CREATE TABLE "Resume" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "linkedinUrl" TEXT,
    "portfolioUrl" TEXT,
    "summary" TEXT NOT NULL,
    "workExperience" JSONB NOT NULL,
    "education" JSONB NOT NULL,
    "technicalSkills" TEXT[],
    "softSkills" TEXT[],
    "resumeRating" INTEGER NOT NULL,
    "improvementAreas" TEXT NOT NULL,
    "upskillSuggestions" TEXT[],
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);
