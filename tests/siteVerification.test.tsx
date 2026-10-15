import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' })
}));

// next/script defers afterInteractive scripts outside the Next runtime; render a plain tag instead
vi.mock('next/script', () => ({
  default: (props: Record<string, unknown>) => {
    const attrs = { ...props };
    delete attrs.strategy;
    return <script {...attrs} />;
  }
}));

import RootLayout from '../src/app/layout';

describe('Site verification tags in the root layout', () => {
  const html = renderToStaticMarkup(
    <RootLayout>
      <div>Page content</div>
    </RootLayout>
  );
  const head = html.slice(html.indexOf('<head>'), html.indexOf('</head>'));

  it('renders the Impact verification meta tag in <head> with a value attribute', () => {
    expect(head).toContain(
      '<meta name="impact-site-verification" value="b0fc741b-a888-43de-95c8-64b9d15ce586"/>'
    );
  });

  it('keeps the Cloudflare Web Analytics beacon', () => {
    expect(html).toContain('static.cloudflareinsights.com/beacon.min.js');
  });
});
