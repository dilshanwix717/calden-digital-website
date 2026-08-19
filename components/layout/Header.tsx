import { Nav } from "@/components/layout/Nav";

/**
 * Thin wrapper so app/layout.tsx has one obvious thing to render for "the
 * top of the page" and Nav itself stays a plain, reusable component. All
 * the actual nav logic lives in Nav.tsx.
 */
export function Header({ currentPath }: { currentPath: string }) {
  return <Nav currentPath={currentPath} />;
}
