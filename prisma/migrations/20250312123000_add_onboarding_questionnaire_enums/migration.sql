-- Add enums for structured onboarding questionnaire answers.
CREATE TYPE "LivingSpaceType" AS ENUM ('APARTMENT', 'CONDO', 'TOWNHOME', 'HOUSE');
CREATE TYPE "SpaceSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');
CREATE TYPE "StairAccess" AS ENUM ('NONE', 'FEW', 'FULL_FLIGHT');
CREATE TYPE "VehicleType" AS ENUM ('SEDAN', 'SUV', 'MINIVAN', 'TRUCK', 'NONE');
CREATE TYPE "CaregiverHeightRange" AS ENUM ('UNDER_5_4', 'FIVE_4_TO_FIVE_8', 'FIVE_8_TO_SIX', 'OVER_6');
CREATE TYPE "FeedingIntent" AS ENUM ('BREASTFEEDING', 'FORMULA', 'COMBO', 'UNDECIDED');
CREATE TYPE "AnimalType" AS ENUM ('DOG', 'CAT', 'OTHER');
CREATE TYPE "SupportSystem" AS ENUM ('PARTNER', 'FAMILY_NEARBY', 'FRIENDS', 'NIGHT_NURSE', 'DOULA');

-- Add a read-only snapshot field for mentors.
ALTER TABLE "OnboardingProfile" ADD COLUMN "lifestyleSnapshot" JSONB;
