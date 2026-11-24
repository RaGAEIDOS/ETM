import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  SELF_DEVELOPMENT_BOOKS,
  findSelfDevelopmentBook,
} from "../../lib/self-development.ts";

test("self-development catalogue: two books with unique slugs", () => {
  assert.equal(SELF_DEVELOPMENT_BOOKS.length, 2);
  assert.equal(new Set(SELF_DEVELOPMENT_BOOKS.map((book) => book.slug)).size, 2);
});

test("every hosted PDF exists under public/library", () => {
  for (const book of SELF_DEVELOPMENT_BOOKS) {
    assert.match(book.pdf, /^\/library\/self-development\/[a-z0-9-]+\.pdf$/);
    const file = join(process.cwd(), "public", book.pdf.replace(/^\//, ""));
    assert.ok(existsSync(file), `${book.pdf} should exist at ${file}`);
  }
});

test("every book has a complete original summary", () => {
  for (const book of SELF_DEVELOPMENT_BOOKS) {
    assert.ok(book.title.length > 0);
    assert.ok(book.author.length > 0);
    assert.ok(book.pages > 0);
    assert.ok(book.description.length >= 80, `${book.slug} description is substantial`);
    assert.ok(book.keyIdeas.length >= 5, `${book.slug} has key ideas`);
    assert.ok(book.sections.length >= 8, `${book.slug} has enough sections`);
    assert.ok(book.takeaway.length > 0);
    for (const section of book.sections) {
      assert.ok(section.title.length > 0);
      assert.ok(section.paragraphs.length > 0);
      assert.ok(section.paragraphs.every((paragraph) => paragraph.length >= 60));
      if (section.bullets) {
        assert.ok(section.bullets.every((bullet) => bullet.length > 0));
      }
    }
  }
});

test("findSelfDevelopmentBook resolves known slugs only", () => {
  assert.equal(findSelfDevelopmentBook("dopamine-nation")?.titleEn, "Dopamine Nation");
  assert.equal(findSelfDevelopmentBook("48-laws-of-power")?.titleEn, "The 48 Laws of Power");
  assert.equal(findSelfDevelopmentBook("missing"), undefined);
});
