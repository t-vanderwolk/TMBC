-- CreateEnum
CREATE TYPE "AcademyJourney" AS ENUM ('gear', 'nursery', 'postpartum');

-- CreateEnum
CREATE TYPE "LivingSpaceType" AS ENUM ('APARTMENT', 'CONDO', 'TOWNHOME', 'HOUSE');

-- CreateEnum
CREATE TYPE "SpaceSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "StairAccess" AS ENUM ('NONE', 'FEW', 'FULL_FLIGHT');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('SEDAN', 'SUV', 'MINIVAN', 'TRUCK', 'NONE');

-- CreateEnum
CREATE TYPE "CaregiverHeightRange" AS ENUM ('UNDER_5_4', 'FIVE_4_TO_FIVE_8', 'FIVE_8_TO_SIX', 'OVER_6');

-- CreateEnum
CREATE TYPE "FeedingIntent" AS ENUM ('BREASTFEEDING', 'FORMULA', 'COMBO', 'UNDECIDED');

-- CreateEnum
CREATE TYPE "AnimalType" AS ENUM ('DOG', 'CAT', 'OTHER');

-- CreateEnum
CREATE TYPE "SupportSystem" AS ENUM ('PARTNER', 'FAMILY_NEARBY', 'FRIENDS', 'NIGHT_NURSE', 'DOULA');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'MENTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "RegistryStatus" AS ENUM ('ACTIVE', 'NEEDED', 'RESERVED', 'PURCHASED', 'PURCHASED_ELSEWHERE', 'REMOVED_REMOTE');

-- CreateEnum
CREATE TYPE "AffiliateNetwork" AS ENUM ('CJ', 'IMPACT', 'AWIN', 'SHAREASALE', 'MYREGISTRY', 'DIRECT');

-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BlogAuthorRole" AS ENUM ('ADMIN', 'MENTOR');

-- CreateEnum
CREATE TYPE "BlogEngagementType" AS ENUM ('VIEW', 'READ_75', 'SHARE');

-- CreateEnum
CREATE TYPE "BlogHighlightEventType" AS ENUM ('CLICK');

-- CreateEnum
CREATE TYPE "AffiliatePosition" AS ENUM ('INLINE', 'CALLOUT', 'END_CARD');

-- CreateEnum
CREATE TYPE "AffiliateEventType" AS ENUM ('CLICK', 'CONVERSION');

-- CreateEnum
CREATE TYPE "RegistrySection" AS ENUM ('NURSERY', 'GEAR', 'FEEDING', 'POSTPARTUM', 'LATER');

-- CreateEnum
CREATE TYPE "RegistryItemStatus" AS ENUM ('CONSIDERING', 'ADDED', 'PURCHASED', 'REMOVED');

-- CreateEnum
CREATE TYPE "RegistryDecisionStatus" AS ENUM ('ACCEPTED');

-- CreateEnum
CREATE TYPE "CompareDecision" AS ENUM ('accept', 'modify', 'defer');

-- CreateEnum
CREATE TYPE "CompareSource" AS ENUM ('onboarding', 'academy', 'mentor', 'member');

-- CreateEnum
CREATE TYPE "WorkbookEntryType" AS ENUM ('JOURNAL', 'MOODBOARD', 'CHECKLIST', 'REFLECTION');

-- CreateEnum
CREATE TYPE "CommunityPostSourceType" AS ENUM ('COMMUNITY', 'WORKBOOK', 'MENTOR_PROMPT');

-- CreateEnum
CREATE TYPE "WorkbookSection" AS ENUM ('REFLECT', 'APPLY', 'INTEGRATE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "myRegistryAccessToken" TEXT,
    "myRegistryRefreshToken" TEXT,
    "myRegistryTokenExpires" TIMESTAMP(3),
    "myRegistryLastSyncedAt" TIMESTAMP(3),
    "pinterestAccessToken" TEXT,
    "pinterestRefreshToken" TEXT,
    "pinterestTokenExpires" TIMESTAMP(3),
    "myRegistryEmail" TEXT,
    "myRegistryUserId" TEXT,
    "myRegistryRegistryId" TEXT,
    "myRegistryCreatedAt" TIMESTAMP(3),
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TIMESTAMP(3),
    "inviteCodeUsed" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "mentorId" TEXT,
    "mentorCollabRequestedAt" TIMESTAMP(3),
    "mentorCollabConfirmedAt" TIMESTAMP(3),
    "mentorCollabEmail" TEXT,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "profileCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "affiliateName" TEXT NOT NULL,
    "affiliateType" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payoutValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogAffiliateEvent" (
    "id" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "affiliateLinkId" TEXT NOT NULL,
    "event" "AffiliateEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogAffiliateEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" JSONB NOT NULL,
    "heroImage" TEXT,
    "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
    "isAffiliate" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRoleSnapshot" "BlogAuthorRole" NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogAffiliateLink" (
    "id" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "network" "AffiliateNetwork" NOT NULL,
    "label" TEXT NOT NULL,
    "position" "AffiliatePosition" NOT NULL,
    "destinationUrl" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogAffiliateLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogEngagementEvent" (
    "id" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "event" "BlogEngagementType" NOT NULL,
    "viewerId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogEngagementEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogHighlight" (
    "id" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "productId" TEXT,
    "brandName" TEXT,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogHighlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogHighlightEvent" (
    "id" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "highlightId" TEXT NOT NULL,
    "event" "BlogHighlightEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogHighlightEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "myRegistryId" TEXT NOT NULL,
    "title" TEXT,
    "source" TEXT NOT NULL DEFAULT 'MYREGISTRY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" TIMESTAMP(3),
    "shippingAddress" JSONB,

    CONSTRAINT "Registry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "role" "Role",
    "success" BOOLEAN NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "city" TEXT,
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT,
    "imageUrl" TEXT,
    "inviteRequestId" TEXT,
    "lastName" TEXT,
    "state" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "lifestyleSnapshot" JSONB,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakeResponse" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "step" TEXT,
    "responses" JSONB NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntakeResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "createdById" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "usedById" TEXT,
    "sentAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByEmail" TEXT,
    "email" TEXT,
    "maxUses" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InviteCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemedById" TEXT,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "InviteCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waitlist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InviteRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "inviteCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedById" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "message" TEXT,

    CONSTRAINT "InviteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistryItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "registryId" TEXT,
    "externalGiftId" TEXT,
    "myRegistryId" TEXT,
    "myRegistryItemId" TEXT,
    "name" TEXT,
    "title" TEXT,
    "url" TEXT,
    "brand" TEXT,
    "merchant" TEXT,
    "category" TEXT,
    "price" DOUBLE PRECISION,
    "quantity" INTEGER,
    "image" TEXT,
    "imageUrl" TEXT,
    "affiliateId" TEXT,
    "affiliateLink" TEXT,
    "source" TEXT,
    "purchaseSource" TEXT,
    "section" "RegistrySection" NOT NULL,
    "status" "RegistryItemStatus" NOT NULL DEFAULT 'CONSIDERING',
    "decisionStatus" "RegistryDecisionStatus",
    "mentorNote" TEXT,
    "userNote" TEXT,
    "notes" TEXT,
    "addedByMentor" BOOLEAN NOT NULL DEFAULT false,
    "purchasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompareEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "registryId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "itemIds" TEXT[],
    "decision" "CompareDecision" NOT NULL,
    "source" "CompareSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompareEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistryItemBlogInfluence" (
    "id" TEXT NOT NULL,
    "registryItemId" TEXT NOT NULL,
    "postSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistryItemBlogInfluence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateLink" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "retailerName" TEXT NOT NULL,
    "network" "AffiliateNetwork" NOT NULL,
    "outboundUrl" TEXT NOT NULL,
    "affiliateId" TEXT,
    "region" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorNote" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "productId" TEXT,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moduleId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorProductSuggestion" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "MentorProductSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalRegistry" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT,
    "documentUrl" TEXT,
    "documentLabel" TEXT,
    "referenceOnly" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalRegistry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalRegistryNote" (
    "id" TEXT NOT NULL,
    "registryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalRegistryNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanSection" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "decisionState" TEXT,
    "mentorNote" TEXT,
    "memberNote" TEXT,
    "memberAcknowledgement" TEXT,
    "updatedByRole" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademyModule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "trackId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "heroImage" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "journey" "AcademyJourney" NOT NULL DEFAULT 'nursery',
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AcademyModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademyProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademyProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "moduleId" TEXT,
    "minRole" "Role" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityPost" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sourcePrompt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAnnouncement" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "pinnedAt" TIMESTAMP(3),
    "workbookEntryId" TEXT,
    "sourceType" "CommunityPostSourceType" NOT NULL DEFAULT 'COMMUNITY',
    "sourceSection" "WorkbookSection",
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "isMentorPrompt" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityReply" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "format" TEXT,
    "hostId" TEXT,
    "hostName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "location" TEXT,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRsvp" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventRsvp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "inviteOnly" BOOLEAN NOT NULL DEFAULT true,
    "defaultMentorId" TEXT,
    "pinterestClientId" TEXT,
    "pinterestSecret" TEXT,
    "myRegistryMerchantId" TEXT,
    "affiliateNetwork" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorFeedback" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "moduleId" TEXT,
    "registryItemId" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderRole" "Role" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,

    CONSTRAINT "ConversationMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorTask" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "referenceId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalShare" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeCapsule" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "scheduledFor" TIMESTAMP(3),
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimeCapsule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistryConflict" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "localValue" TEXT,
    "remoteValue" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistryConflict_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceSnapshot" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "affiliatePartnerId" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistryPriceWatch" (
    "id" TEXT NOT NULL,
    "registryItemId" TEXT NOT NULL,
    "watchStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchaseRecordedAt" TIMESTAMP(3),
    "lastNotifiedAt" TIMESTAMP(3),

    CONSTRAINT "RegistryPriceWatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliatePartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "network" "AffiliateNetwork" NOT NULL,
    "awinmid" INTEGER,
    "cookieDays" INTEGER,
    "regions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "defaultLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliatePartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageThread" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "threadId" INTEGER NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkbookEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "type" "WorkbookEntryType" NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkbookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConversationParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateEvent_userId_affiliateName_key" ON "AffiliateEvent"("userId", "affiliateName");

-- CreateIndex
CREATE INDEX "BlogAffiliateEvent_blogPostId_idx" ON "BlogAffiliateEvent"("blogPostId");

-- CreateIndex
CREATE INDEX "BlogAffiliateEvent_affiliateLinkId_idx" ON "BlogAffiliateEvent"("affiliateLinkId");

-- CreateIndex
CREATE INDEX "BlogAffiliateEvent_event_idx" ON "BlogAffiliateEvent"("event");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_status_isAffiliate_idx" ON "BlogPost"("status", "isAffiliate");

-- CreateIndex
CREATE INDEX "BlogPost_publishedAt_idx" ON "BlogPost"("publishedAt");

-- CreateIndex
CREATE INDEX "BlogAffiliateLink_blogPostId_idx" ON "BlogAffiliateLink"("blogPostId");

-- CreateIndex
CREATE INDEX "BlogAffiliateLink_partnerName_idx" ON "BlogAffiliateLink"("partnerName");

-- CreateIndex
CREATE INDEX "BlogEngagementEvent_blogPostId_idx" ON "BlogEngagementEvent"("blogPostId");

-- CreateIndex
CREATE INDEX "BlogEngagementEvent_event_idx" ON "BlogEngagementEvent"("event");

-- CreateIndex
CREATE INDEX "BlogEngagementEvent_createdAt_idx" ON "BlogEngagementEvent"("createdAt");

-- CreateIndex
CREATE INDEX "BlogHighlight_blogPostId_idx" ON "BlogHighlight"("blogPostId");

-- CreateIndex
CREATE INDEX "BlogHighlight_productId_idx" ON "BlogHighlight"("productId");

-- CreateIndex
CREATE INDEX "BlogHighlight_brandName_idx" ON "BlogHighlight"("brandName");

-- CreateIndex
CREATE INDEX "BlogHighlightEvent_blogPostId_idx" ON "BlogHighlightEvent"("blogPostId");

-- CreateIndex
CREATE INDEX "BlogHighlightEvent_highlightId_idx" ON "BlogHighlightEvent"("highlightId");

-- CreateIndex
CREATE INDEX "BlogHighlightEvent_event_idx" ON "BlogHighlightEvent"("event");

-- CreateIndex
CREATE INDEX "BlogHighlightEvent_createdAt_idx" ON "BlogHighlightEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Registry_userId_key" ON "Registry"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Registry_myRegistryId_key" ON "Registry"("myRegistryId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_inviteRequestId_key" ON "Profile"("inviteRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingProfile_userId_key" ON "OnboardingProfile"("userId");

-- CreateIndex
CREATE INDEX "IntakeResponse_userId_idx" ON "IntakeResponse"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_code_key" ON "Invite"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_usedById_key" ON "Invite"("usedById");

-- CreateIndex
CREATE UNIQUE INDEX "InviteCode_code_key" ON "InviteCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "InviteCode_redeemedById_key" ON "InviteCode"("redeemedById");

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_email_key" ON "Waitlist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InviteRequest_email_key" ON "InviteRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InviteRequest_inviteCode_key" ON "InviteRequest"("inviteCode");

-- CreateIndex
CREATE INDEX "RegistryItem_affiliateId_idx" ON "RegistryItem"("affiliateId");

-- CreateIndex
CREATE INDEX "CompareEvent_userId_idx" ON "CompareEvent"("userId");

-- CreateIndex
CREATE INDEX "CompareEvent_registryId_idx" ON "CompareEvent"("registryId");

-- CreateIndex
CREATE INDEX "CompareEvent_category_idx" ON "CompareEvent"("category");

-- CreateIndex
CREATE INDEX "RegistryItemBlogInfluence_registryItemId_idx" ON "RegistryItemBlogInfluence"("registryItemId");

-- CreateIndex
CREATE INDEX "RegistryItemBlogInfluence_postSlug_idx" ON "RegistryItemBlogInfluence"("postSlug");

-- CreateIndex
CREATE INDEX "MentorNote_memberId_idx" ON "MentorNote"("memberId");

-- CreateIndex
CREATE INDEX "MentorNote_mentorId_idx" ON "MentorNote"("mentorId");

-- CreateIndex
CREATE INDEX "MentorProductSuggestion_mentorId_idx" ON "MentorProductSuggestion"("mentorId");

-- CreateIndex
CREATE INDEX "MentorProductSuggestion_memberId_idx" ON "MentorProductSuggestion"("memberId");

-- CreateIndex
CREATE INDEX "MentorProductSuggestion_category_idx" ON "MentorProductSuggestion"("category");

-- CreateIndex
CREATE INDEX "ExternalRegistry_memberId_idx" ON "ExternalRegistry"("memberId");

-- CreateIndex
CREATE INDEX "ExternalRegistryNote_registryId_idx" ON "ExternalRegistryNote"("registryId");

-- CreateIndex
CREATE INDEX "ExternalRegistryNote_authorId_idx" ON "ExternalRegistryNote"("authorId");

-- CreateIndex
CREATE INDEX "PlanSection_memberId_idx" ON "PlanSection"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanSection_memberId_sectionKey_key" ON "PlanSection"("memberId", "sectionKey");

-- CreateIndex
CREATE UNIQUE INDEX "AcademyModule_slug_key" ON "AcademyModule"("slug");

-- CreateIndex
CREATE INDEX "AcademyProgress_userId_idx" ON "AcademyProgress"("userId");

-- CreateIndex
CREATE INDEX "AcademyProgress_moduleId_idx" ON "AcademyProgress"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "AcademyProgress_userId_moduleId_key" ON "AcademyProgress"("userId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityRoom_name_key" ON "CommunityRoom"("name");

-- CreateIndex
CREATE INDEX "CommunityRoom_moduleId_idx" ON "CommunityRoom"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityRoom_moduleId_key" ON "CommunityRoom"("moduleId");

-- CreateIndex
CREATE INDEX "CommunityPost_roomId_idx" ON "CommunityPost"("roomId");

-- CreateIndex
CREATE INDEX "CommunityPost_userId_idx" ON "CommunityPost"("userId");

-- CreateIndex
CREATE INDEX "CommunityPost_isAnnouncement_idx" ON "CommunityPost"("isAnnouncement");

-- CreateIndex
CREATE INDEX "CommunityReply_postId_idx" ON "CommunityReply"("postId");

-- CreateIndex
CREATE INDEX "CommunityReply_userId_idx" ON "CommunityReply"("userId");

-- CreateIndex
CREATE INDEX "TimeCapsule_userId_idx" ON "TimeCapsule"("userId");

-- CreateIndex
CREATE INDEX "RegistryConflict_userId_idx" ON "RegistryConflict"("userId");

-- CreateIndex
CREATE INDEX "RegistryConflict_itemId_idx" ON "RegistryConflict"("itemId");

-- CreateIndex
CREATE INDEX "RegistryConflict_userId_resolved_idx" ON "RegistryConflict"("userId", "resolved");

-- CreateIndex
CREATE INDEX "PriceSnapshot_productId_idx" ON "PriceSnapshot"("productId");

-- CreateIndex
CREATE INDEX "PriceSnapshot_affiliatePartnerId_idx" ON "PriceSnapshot"("affiliatePartnerId");

-- CreateIndex
CREATE INDEX "PriceSnapshot_capturedAt_idx" ON "PriceSnapshot"("capturedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RegistryPriceWatch_registryItemId_key" ON "RegistryPriceWatch"("registryItemId");

-- CreateIndex
CREATE INDEX "WorkbookEntry_userId_idx" ON "WorkbookEntry"("userId");

-- CreateIndex
CREATE INDEX "WorkbookEntry_moduleId_idx" ON "WorkbookEntry"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkbookEntry_userId_moduleId_type_key" ON "WorkbookEntry"("userId", "moduleId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "_ConversationParticipants_AB_unique" ON "_ConversationParticipants"("A", "B");

-- CreateIndex
CREATE INDEX "_ConversationParticipants_B_index" ON "_ConversationParticipants"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateEvent" ADD CONSTRAINT "AffiliateEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogAffiliateEvent" ADD CONSTRAINT "BlogAffiliateEvent_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogAffiliateEvent" ADD CONSTRAINT "BlogAffiliateEvent_affiliateLinkId_fkey" FOREIGN KEY ("affiliateLinkId") REFERENCES "BlogAffiliateLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogAffiliateLink" ADD CONSTRAINT "BlogAffiliateLink_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogEngagementEvent" ADD CONSTRAINT "BlogEngagementEvent_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogHighlight" ADD CONSTRAINT "BlogHighlight_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogHighlight" ADD CONSTRAINT "BlogHighlight_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogHighlightEvent" ADD CONSTRAINT "BlogHighlightEvent_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogHighlightEvent" ADD CONSTRAINT "BlogHighlightEvent_highlightId_fkey" FOREIGN KEY ("highlightId") REFERENCES "BlogHighlight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registry" ADD CONSTRAINT "Registry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginEvent" ADD CONSTRAINT "LoginEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_inviteRequestId_fkey" FOREIGN KEY ("inviteRequestId") REFERENCES "InviteRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingProfile" ADD CONSTRAINT "OnboardingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntakeResponse" ADD CONSTRAINT "IntakeResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InviteCode" ADD CONSTRAINT "InviteCode_redeemedById_fkey" FOREIGN KEY ("redeemedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InviteRequest" ADD CONSTRAINT "InviteRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryItem" ADD CONSTRAINT "RegistryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryItem" ADD CONSTRAINT "RegistryItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryItem" ADD CONSTRAINT "RegistryItem_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Registry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryItem" ADD CONSTRAINT "RegistryItem_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "AffiliatePartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompareEvent" ADD CONSTRAINT "CompareEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompareEvent" ADD CONSTRAINT "CompareEvent_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "Registry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryItemBlogInfluence" ADD CONSTRAINT "RegistryItemBlogInfluence_registryItemId_fkey" FOREIGN KEY ("registryItemId") REFERENCES "RegistryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorNote" ADD CONSTRAINT "MentorNote_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorNote" ADD CONSTRAINT "MentorNote_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorNote" ADD CONSTRAINT "MentorNote_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "AcademyModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorNote" ADD CONSTRAINT "MentorNote_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorProductSuggestion" ADD CONSTRAINT "MentorProductSuggestion_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorProductSuggestion" ADD CONSTRAINT "MentorProductSuggestion_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorProductSuggestion" ADD CONSTRAINT "MentorProductSuggestion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalRegistry" ADD CONSTRAINT "ExternalRegistry_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalRegistryNote" ADD CONSTRAINT "ExternalRegistryNote_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "ExternalRegistry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalRegistryNote" ADD CONSTRAINT "ExternalRegistryNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSection" ADD CONSTRAINT "PlanSection_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademyProgress" ADD CONSTRAINT "AcademyProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "AcademyModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademyProgress" ADD CONSTRAINT "AcademyProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityRoom" ADD CONSTRAINT "CommunityRoom_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "AcademyModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "CommunityRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityReply" ADD CONSTRAINT "CommunityReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityReply" ADD CONSTRAINT "CommunityReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRsvp" ADD CONSTRAINT "EventRsvp_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorFeedback" ADD CONSTRAINT "MentorFeedback_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorFeedback" ADD CONSTRAINT "MentorFeedback_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorFeedback" ADD CONSTRAINT "MentorFeedback_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "AcademyModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorFeedback" ADD CONSTRAINT "MentorFeedback_registryItemId_fkey" FOREIGN KEY ("registryItemId") REFERENCES "RegistryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMessage" ADD CONSTRAINT "ConversationMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMessage" ADD CONSTRAINT "ConversationMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorTask" ADD CONSTRAINT "MentorTask_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorTask" ADD CONSTRAINT "MentorTask_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeCapsule" ADD CONSTRAINT "TimeCapsule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryConflict" ADD CONSTRAINT "RegistryConflict_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "RegistryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryConflict" ADD CONSTRAINT "RegistryConflict_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceSnapshot" ADD CONSTRAINT "PriceSnapshot_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceSnapshot" ADD CONSTRAINT "PriceSnapshot_affiliatePartnerId_fkey" FOREIGN KEY ("affiliatePartnerId") REFERENCES "AffiliatePartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryPriceWatch" ADD CONSTRAINT "RegistryPriceWatch_registryItemId_fkey" FOREIGN KEY ("registryItemId") REFERENCES "RegistryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "MessageThread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkbookEntry" ADD CONSTRAINT "WorkbookEntry_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "AcademyModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkbookEntry" ADD CONSTRAINT "WorkbookEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationParticipants" ADD CONSTRAINT "_ConversationParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationParticipants" ADD CONSTRAINT "_ConversationParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

