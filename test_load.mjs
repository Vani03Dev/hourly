import { z } from "zod";
try {
  const schema = z.object({
    linkedinUrl: z.string().url().includes("linkedin.com")
  });
  console.log("Schema valid");
} catch (e) {
  console.error("Zod Error:", e);
}
