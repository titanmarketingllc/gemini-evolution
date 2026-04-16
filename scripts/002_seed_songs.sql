-- Seed sample songs for Gemini Evolution
-- These are placeholder songs - replace with actual data

INSERT INTO public.songs (title, slug, genre, description, duration, artwork_url, audio_url, play_count, download_count, featured, release_date)
VALUES
  (
    'Lakeside Dreams',
    'lakeside-dreams',
    'Country',
    'A peaceful tribute to summer nights on Table Rock Lake, where the water meets the stars.',
    234,
    '/images/songs/lakeside-dreams.jpg',
    'https://example.com/audio/lakeside-dreams.mp3',
    1247,
    456,
    true,
    '2024-01-15'
  ),
  (
    'Evolution',
    'evolution',
    'Pop',
    'The anthem that started it all - about growing, changing, and becoming who you''re meant to be.',
    198,
    '/images/songs/evolution.jpg',
    'https://example.com/audio/evolution.mp3',
    2891,
    892,
    true,
    '2024-02-20'
  ),
  (
    'Ozark Heart',
    'ozark-heart',
    'Country',
    'A love letter to the mountains and valleys that shaped us.',
    267,
    '/images/songs/ozark-heart.jpg',
    'https://example.com/audio/ozark-heart.mp3',
    1856,
    623,
    true,
    '2024-03-10'
  ),
  (
    'Midnight Drive',
    'midnight-drive',
    'Acoustic',
    'Windows down, radio up, and the open road ahead.',
    212,
    '/images/songs/midnight-drive.jpg',
    'https://example.com/audio/midnight-drive.mp3',
    987,
    321,
    false,
    '2024-04-05'
  ),
  (
    'Better Days',
    'better-days',
    'Ballad',
    'When the weight of the world feels heavy, remember better days are coming.',
    289,
    '/images/songs/better-days.jpg',
    'https://example.com/audio/better-days.mp3',
    1432,
    567,
    false,
    '2024-05-12'
  ),
  (
    'Friday Night Lights',
    'friday-night-lights',
    'Upbeat',
    'That electric feeling when the weekend finally hits.',
    186,
    '/images/songs/friday-night-lights.jpg',
    'https://example.com/audio/friday-night-lights.mp3',
    2156,
    734,
    false,
    '2024-06-01'
  ),
  (
    'Hometown Glory',
    'hometown-glory',
    'Country',
    'No matter where life takes you, home is always calling.',
    245,
    '/images/songs/hometown-glory.jpg',
    'https://example.com/audio/hometown-glory.mp3',
    1678,
    489,
    false,
    '2024-07-15'
  ),
  (
    'Summer Storm',
    'summer-storm',
    'Acoustic',
    'The calm before, the fury during, and the peace after.',
    223,
    '/images/songs/summer-storm.jpg',
    'https://example.com/audio/summer-storm.mp3',
    1123,
    398,
    false,
    '2024-08-20'
  ),
  (
    'Dancing in the Kitchen',
    'dancing-in-the-kitchen',
    'Pop',
    'Those spontaneous moments that become lifelong memories.',
    201,
    '/images/songs/dancing-in-the-kitchen.jpg',
    'https://example.com/audio/dancing-in-the-kitchen.mp3',
    1567,
    512,
    false,
    '2024-09-10'
  ),
  (
    'The Long Way Home',
    'the-long-way-home',
    'Ballad',
    'Sometimes the scenic route is exactly what your soul needs.',
    312,
    '/images/songs/the-long-way-home.jpg',
    'https://example.com/audio/the-long-way-home.mp3',
    1890,
    645,
    false,
    '2024-10-01'
  )
ON CONFLICT (slug) DO NOTHING;
