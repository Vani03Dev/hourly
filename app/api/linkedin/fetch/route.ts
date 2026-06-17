import { NextResponse } from 'next/server';

// Mock Proxycurl Fetch
export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes('linkedin.com/in/')) {
      return NextResponse.json({ error: 'Invalid LinkedIn URL' }, { status: 400 });
    }
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Extract a username from the URL for a slightly more personalized mock
    const match = url.match(/linkedin\.com\/in\/([^\/]+)/);
    const username = match ? match[1] : "expert";
    const formattedName = username.charAt(0).toUpperCase() + username.slice(1).replace(/-/g, ' ');

    const mockData = {
      full_name: formattedName,
      headline: "Senior Leader at Tech Innovators",
      summary: "Passionate professional with extensive experience building scalable systems and leading teams.",
      experiences: [
        {
          title: "Senior Leader",
          company: "Tech Innovators",
          starts_at: { year: 2020, month: 1, day: 1 },
          ends_at: null,
          description: "Leading the core infrastructure team and driving architectural decisions."
        },
        {
          title: "Software Engineer",
          company: "Global Solutions Inc",
          starts_at: { year: 2016, month: 5, day: 1 },
          ends_at: { year: 2019, month: 12, day: 31 },
          description: "Developed microservices in Node.js and managed cloud deployments."
        }
      ],
      education: [
        {
          school: "University of Technology",
          degree_name: "Bachelor of Science",
          field_of_study: "Computer Science",
          starts_at: { year: 2012, month: 9, day: 1 },
          ends_at: { year: 2016, month: 5, day: 1 }
        }
      ]
    };

    return NextResponse.json(mockData);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch LinkedIn profile' }, { status: 500 });
  }
}
