-- List all blog-related tables
-- Expected tables include BlogPost, BlogAffiliateLink, BlogAffiliateEvent,
-- BlogEngagementEvent, BlogHighlight, BlogHighlightEvent
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename ILIKE 'blog%'
ORDER BY tablename;
