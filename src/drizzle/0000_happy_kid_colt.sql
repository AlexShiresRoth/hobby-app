CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text,
	"full_name" text,
	"phone" varchar(256),
	"gender" text,
	"avatar_url" text
);
