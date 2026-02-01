-- Seed templates used for the "gifted" first login experience.
-- The app copies these into couple-scoped tables on first login.

insert into public.seed_templates (kind, payload)
values
  (
    'memory',
    jsonb_build_object(
      'title', 'The first coffee that felt like home',
      'memory_date', '2021-03-14',
      'location', 'A quiet corner table',
      'story', 'We weren’t in a hurry. We just sat, talked, and made a small world feel soft.'
    )
  ),
  (
    'memory',
    jsonb_build_object(
      'title', 'The walk that turned into a tradition',
      'memory_date', '2021-06-05',
      'location', 'Your favorite neighborhood loop',
      'story', 'Same streets, different sky. Somehow it always feels new with you.'
    )
  ),
  (
    'memory',
    jsonb_build_object(
      'title', 'A rainy day movie marathon',
      'memory_date', '2022-11-19',
      'location', 'Living room',
      'story', 'Blankets, snacks, and the kind of laughter that makes the rain feel lucky.'
    )
  ),
  (
    'memory',
    jsonb_build_object(
      'title', 'The little celebration nobody else saw',
      'memory_date', '2023-02-10',
      'location', 'Kitchen',
      'story', 'Just us, music low, a toast with whatever was in the fridge — perfect anyway.'
    )
  ),
  (
    'memory',
    jsonb_build_object(
      'title', 'A photo you took that I still replay',
      'memory_date', '2024-09-22',
      'location', 'Somewhere sunny',
      'story', 'It’s funny how a single frame can hold a whole feeling.'
    )
  ),
  (
    'wishlist_item',
    jsonb_build_object('title', 'A candlelit date night at home', 'category', 'date_night', 'status', 'planned', 'notes', 'Cook together + playlist + no phones.', 'target_date', null)
  ),
  (
    'wishlist_item',
    jsonb_build_object('title', 'Weekend coastal drive', 'category', 'trip', 'status', 'idea', 'notes', 'Pick a small town, stay somewhere cozy.', 'target_date', null)
  ),
  (
    'wishlist_item',
    jsonb_build_object('title', 'Try a new bakery every month', 'category', 'food', 'status', 'planned', 'notes', 'Rate the croissants.', 'target_date', null)
  ),
  (
    'wishlist_item',
    jsonb_build_object('title', 'A museum date with matching outfits', 'category', 'date_night', 'status', 'idea', 'notes', 'Minimal, soft colors.', 'target_date', null)
  ),
  (
    'wishlist_item',
    jsonb_build_object('title', 'Make a photo book together', 'category', 'gift', 'status', 'idea', 'notes', 'Pick 30 favorites and write tiny captions.', 'target_date', null)
  ),
  (
    'wishlist_item',
    jsonb_build_object('title', 'Picnic at sunset', 'category', 'date_night', 'status', 'planned', 'notes', 'Bring something fizzy.', 'target_date', null)
  ),
  (
    'wishlist_item',
    jsonb_build_object('title', 'Learn one dance', 'category', 'someday', 'status', 'idea', 'notes', 'Just one. Slowly.', 'target_date', null)
  ),
  (
    'wishlist_item',
    jsonb_build_object('title', 'Plan a surprise “yes day”', 'category', 'date_night', 'status', 'idea', 'notes', 'One day of tiny yeses.', 'target_date', null)
  ),
  (
    'wishlist_item',
    jsonb_build_object('title', 'Try a tasting menu', 'category', 'food', 'status', 'idea', 'notes', 'Dress up a little.', 'target_date', null)
  ),
  (
    'wishlist_item',
    jsonb_build_object('title', 'Leave each other handwritten notes', 'category', 'gift', 'status', 'planned', 'notes', 'Hide them where we’ll find them later.', 'target_date', null)
  ),
  (
    'wishlist_item',
    jsonb_build_object('title', 'Book a tiny cabin for a night', 'category', 'trip', 'status', 'idea', 'notes', 'Fireplace if possible.', 'target_date', null)
  ),
  (
    'note',
    jsonb_build_object('title', 'A tiny promise', 'body', 'More “us” time. Less rushing. Always gentleness.')
  ),
  (
    'note',
    jsonb_build_object('title', 'What I love lately', 'body', '- The way you look when you’re thinking\\n- Your laugh when you try not to\\n- How safe it feels to be ordinary with you')
  ),
  (
    'note',
    jsonb_build_object('title', 'Next date idea', 'body', 'Pick a neighborhood we don’t know and wander until we find *our* spot.')
  ),
  (
    'note',
    jsonb_build_object('title', 'One-line gratitude', 'body', 'Today I’m grateful for your steadiness.')
  ),
  (
    'note',
    jsonb_build_object('title', 'Home is a verb', 'body', 'Let’s keep making it together — in little ways, every day.')
  );

