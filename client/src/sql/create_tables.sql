-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  bio TEXT,
  languages TEXT[],
  specialties TEXT[],
  rating FLOAT DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  completed_projects INTEGER DEFAULT 0,
  on_time_percentage INTEGER DEFAULT 100,
  rate_per_word FLOAT DEFAULT 0.10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  translator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT,
  status TEXT DEFAULT 'pending',
  word_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  translation_id UUID REFERENCES translations(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  translator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles
CREATE POLICY profiles_select_policy ON profiles
  FOR SELECT USING (true);

-- Allow users to update only their own profile
CREATE POLICY profiles_update_policy ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to insert only their own profile
CREATE POLICY profiles_insert_policy ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for translations
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own translations
CREATE POLICY translations_select_policy ON translations
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = translator_id);

-- Allow clients to create translations
CREATE POLICY translations_insert_policy ON translations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow translators to update translations assigned to them
CREATE POLICY translations_update_policy ON translations
  FOR UPDATE USING (auth.uid() = translator_id);

-- Create RLS policies for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read reviews
CREATE POLICY reviews_select_policy ON reviews
  FOR SELECT USING (true);

-- Allow clients to create reviews for their own translations
CREATE POLICY reviews_insert_policy ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage policy to allow public read access to avatars
CREATE POLICY avatars_public_read ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Create storage policy to allow authenticated users to upload their own avatar
CREATE POLICY avatars_auth_insert ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create storage policy to allow users to update their own avatar
CREATE POLICY avatars_auth_update ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
