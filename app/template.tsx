import { PageTransition } from "@/components/animations/PageTransition";

/** Re-mounts on every navigation → quick fade/slide between pages. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
