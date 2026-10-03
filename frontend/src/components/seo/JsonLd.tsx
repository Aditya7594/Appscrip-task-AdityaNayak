import React from 'react';

export interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Server component that renders application/ld+json script.
 * Replaces '<' with '\u003c' to prevent script injection attacks.
 */
export function JsonLd({ data }: JsonLdProps) {
  const jsonString = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
