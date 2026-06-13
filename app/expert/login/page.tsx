import { redirect } from "next/navigation";

export default function ExpertLoginRedirect() {
  redirect("/auth/login?role=expert");
}
