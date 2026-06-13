import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn how you can book expertise on-demand or monetize your own knowledge. Find out how Sessionly works for both experts and businesses.",
  openGraph: {
    title: "How Sessionly Works",
    description: "Learn how you can book expertise on-demand or monetize your own knowledge.",
  }
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
