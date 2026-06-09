import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Experts",
  description: "Browse and filter through our verified network of industry experts. Find the perfect professional for your next 1-on-1 session.",
  openGraph: {
    title: "Search Experts | Hourly",
    description: "Browse and filter through our verified network of industry experts.",
  }
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
