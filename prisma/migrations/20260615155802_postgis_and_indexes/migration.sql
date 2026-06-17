CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE "Moment" ADD COLUMN "location" geometry(Point, 4326);

CREATE INDEX "moment_location_idx" ON "Moment" USING GIST (location);
CREATE INDEX "Moment_userId_idx" ON "Moment"("userId");
CREATE INDEX "Moment_expiresAt_idx" ON "Moment"("expiresAt");
CREATE INDEX "Moment_category_idx" ON "Moment"("category");
CREATE INDEX "Moment_archived_idx" ON "Moment"("archived");
CREATE INDEX "Moment_userId_archived_expiresAt_idx" ON "Moment"("userId", "archived", "expiresAt");
CREATE INDEX "Connection_requesterId_idx" ON "Connection"("requesterId");
CREATE INDEX "Connection_receiverId_idx" ON "Connection"("receiverId");
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");