import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { BANDS, artUrl, logoUrl } from "../app/bandori-roster.ts";
import { choreography } from "../app/show/band-choreography.ts";

// Independent official desktop-position snapshot, audited 2026-09-20.
// See docs/official-roster-order.md for CSS selectors, sources and MyGO's tied order.
const official = {
  poppinparty: ["ushigome-rimi", "yamabuki-saya", "toyama-kasumi", "ichigaya-arisa", "hanazono-tae"],
  afterglow: ["uehara-himari", "hazawa-tsugumi", "mitake-ran", "udagawa-tomoe", "aoba-moca"],
  "hello-happy-world": ["kitazawa-hagumi", "michelle", "tsurumaki-kokoro", "seta-kaoru", "matsubara-kanon"],
  "pastel-palettes": ["shirasagi-chisato", "wakamiya-eve", "maruyama-aya", "yamato-maya", "hikawa-hina"],
  roselia: ["hikawa-sayo", "udagawa-ako", "minato-yukina", "shirokane-rinko", "imai-lisa"],
  morfonica: ["yashio-rui", "hiromachi-nanami", "kurata-mashiro", "futaba-tsukushi", "kirigaya-toko"],
  "raise-a-suilen": ["pareo", "masking", "layer", "chu2", "lock"],
  mygo: ["chihaya-anon", "nagasaki-soyo", "takamatsu-tomori", "shiina-taki", "kaname-rana"],
  avemujica: ["togawa-sakiko", "yahata-umiri", "misumi-uika", "yutenji-nyamu", "wakaba-mutsumi"],
  yumemita: ["minetsuki-ritsu", "sengoku-yuno", "nakamachi-arale", "fuji-miyako", "miyanaga-nonoka"],
  millsage: ["kotohira-nagi", "hamasaki-mahoro", "shiomi-hotaru", "izumi-houka", "izawa-natsume"],
  "ikka-dumb-rock": ["yakura-yomogi", "umezato-chieri", "suga-raika", "shinomiya-shizuku", "mahashi-miku"],
};

test("the official snapshot covers all 12 bands and 60 unique characters", () => {
  assert.deepEqual(BANDS.map((band) => band.slug).sort(), Object.keys(official).sort());
  const characters = BANDS.flatMap((band) => band.characters.map((character) => character.slug));
  assert.equal(characters.length, 60);
  assert.equal(new Set(characters).size, 60);
});

for (const [slug, order] of Object.entries(official)) {
  test(`${slug}: official left-to-right positions, matching assets and valid entrance ranks`, () => {
    const band = BANDS.find((candidate) => candidate.slug === slug);
    assert.ok(band);
    assert.deepEqual(band.characters.map((character) => character.slug), order);
    for (const character of band.characters) {
      assert.ok(existsSync(new URL(`../public${artUrl(band, character)}`, import.meta.url)), character.slug);
    }
    assert.ok(existsSync(new URL(`../public${logoUrl(band)}`, import.meta.url)));
    assert.deepEqual([...choreography(slug).order].sort(), [0, 1, 2, 3, 4]);
  });
}
