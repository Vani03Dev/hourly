import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In Next.js 15+, params is a Promise
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      title: 'Expert Profile | Hourly',
      description: 'Book a 1-on-1 session with this expert.',
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: profile } = await supabase
    .from('expert_profiles')
    .select('first_name, last_name, title, bio, avatar_url')
    .eq('id', id)
    .single();

  if (!profile) {
    return {
      title: 'Expert Profile | Hourly',
      description: 'Book a 1-on-1 session with this expert.',
    };
  }

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous Expert';
  const title = `Book a session with ${fullName}`;
  const description = profile.title ? `${profile.title} - ${profile.bio || 'Book a 1-on-1 session today.'}`.substring(0, 160) : 'Book a 1-on-1 session on Hourly.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: profile.avatar_url ? [{ url: profile.avatar_url, width: 800, height: 800, alt: fullName }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
