-- The network: the ministries it runs and the code it publishes.
--
-- These were hard-coded in the page. They are the things most likely to change — a ministry launches,
-- a "coming soon" becomes live, a repository is added — and each change meant editing markup.

create table ministry (
    id           bigserial primary key,
    name         varchar(200) not null,
    blurb        text         not null,
    link_url     varchar(500),
    link_label   varchar(80),
    -- Shown as a pill on the card, e.g. "Coming Soon". Null when the ministry is simply live.
    badge        varchar(40),
    -- Which card treatment the bento grid gives it. The layout is markup; which one applies is data.
    style        varchar(20)  not null,
    -- Optional key of a cover image in the public MinIO bucket.
    image_key    varchar(300),
    -- For the Dead Puritan Society: a status line instead of a link.
    status_note  varchar(120),
    position     integer      not null,
    created_at   timestamptz  not null,
    updated_at   timestamptz
);

create table lab (
    id           bigserial primary key,
    name         varchar(200) not null,
    repo         varchar(120) not null,
    link_url     varchar(500) not null,
    position     integer      not null,
    created_at   timestamptz  not null,
    updated_at   timestamptz
);

insert into ministry (name, blurb, link_url, link_label, badge, style, image_key, status_note, position, created_at) values
 ('Pulpit Stream',
  'Stream sermons and discussions from trusted Reformed pastors.',
  'https://pulpitstream.com', 'Preview Page', 'Coming Soon', 'FEATURE', 'pulpit.webp', null, 1, now()),
 ('Confessions of Grace',
  'Theological reflections and devotional pieces.',
  'https://confessionsofgrace.com', 'Visit Blog', null, 'LIGHT', null, null, 2, now()),
 ('Confessional.social',
  'A decentralized space for Christian fellowship.',
  'https://confessional.social', 'Join Community', null, 'DARK', null, null, 3, now()),
 ('Dead Puritan Society',
  'Engage with profound wisdom from past theologians. This initiative provides curated quotes and resources for the modern church.',
  null, null, null, 'OUTLINE', null, 'LOCKED // COMING SOON', 4, now());

insert into lab (name, repo, link_url, position, created_at) values
 ('GBA Confession Reader', 'gba-2lbcf', 'https://github.com/reformed-witness/gba-2lbcf', 1, now()),
 ('Konfessio', 'konfessio', 'https://github.com/reformed-witness/konfessio', 2, now());
