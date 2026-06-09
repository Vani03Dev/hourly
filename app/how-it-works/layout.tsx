import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn how you can rent expertise by the hour or monetize your own knowledge. Find out how Hourly works for both experts and learners.",
  openGraph: {
    title: "How Hourly Works",
    description: "Learn how you can rent expertise by the hour or monetize your own knowledge.",
  }
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
