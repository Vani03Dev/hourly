import { Metadata, ResolvingMetadata } from "next";
import { mockExperts } from "@/lib/mock-data";

type Props = {
  params: { id: string }
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const expert = mockExperts.find(e => e.id === id);

  if (!expert) {
    return {
      title: "Expert Not Found",
    }
  }

  return {
    title: `${expert.name} - ${expert.title}`,
    description: `Book a 1-on-1 session with ${expert.name}, ${expert.title}. ${expert.bio.substring(0, 120)}...`,
    openGraph: {
      title: `${expert.name} | Hourly`,
      description: `Book a session with ${expert.name} on Hourly.`,
      images: [expert.photo],
    },
    twitter: {
      card: "summary_large_image",
      title: `${expert.name} | Hourly`,
      description: `Book a session with ${expert.name} on Hourly.`,
      images: [expert.photo],
    }
  }
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
