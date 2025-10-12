CREATE TABLE "hobbyQuestionsAndAnswers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"questions_with_answers_id" uuid[]
);
--> statement-breakpoint
CREATE TABLE "questionsWithAnswers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"question" text,
	"answer" text
);
--> statement-breakpoint
ALTER TABLE "hobbyProfiles" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "hobbyProfiles" ADD COLUMN "resourceLink" text;