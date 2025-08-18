CREATE TABLE "hobbyProfiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"time_commitment" text,
	"environment" text,
	"personality" text,
	"spend_amt" text
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text,
	"phone" varchar(256),
	"avatar_url" text,
	"updated_at" date,
	"hobby_profile_id" uuid
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_hobby_profile_id_hobbyProfiles_id_fk" FOREIGN KEY ("hobby_profile_id") REFERENCES "public"."hobbyProfiles"("id") ON DELETE cascade ON UPDATE no action;