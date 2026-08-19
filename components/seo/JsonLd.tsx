/**
 * One <script type="application/ld+json"> per page. Deliberately NOT
 * next/script — that delays the script into the body and some structured-
 * data validators miss it there. dangerouslySetInnerHTML with JSON.stringify
 * is the correct, direct approach for a server-rendered, build-time-known
 * payload like this (no user input reaches it).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD requires a raw <script> body; the payload is build-time
      // content, never user input, so this is the intended, safe use.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
