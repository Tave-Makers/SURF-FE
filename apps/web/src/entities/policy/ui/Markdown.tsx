'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const isElement = (x: unknown): x is React.ReactElement<{ children?: React.ReactNode }> =>
  React.isValidElement<{ children?: React.ReactNode }>(x);

const toText = (nodes: React.ReactNode): string =>
  React.Children.toArray(nodes)
    .map((n) => {
      if (typeof n === 'string' || typeof n === 'number') return String(n);
      if (isElement(n)) return toText(n.props.children ?? null);
      // boolean | null | undefined | ReactPortal 등은 무시
      return '';
    })
    .join('');

export const Markdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children: c, className, ...rest }) => {
          const raw = toText(c).trim();
          const hasMy0 = /\[my-0\]\s*$/.test(raw);
          const hasMb0 = /\[mb-0\]\s*$/.test(raw);
          const hasNoMt = /\[no-mt\]\s*$/.test(raw);
          const label = raw.replace(/\s*\[(my-0|mb-0|no-mt)\]\s*$/, '');

          const cls = hasMy0
            ? 'my-0'
            : hasMb0
              ? 'mt-15 mb-0'
              : hasNoMt
                ? 'mt-0 mb-15'
                : 'mt-15 mb-15';

          return (
            <h2 {...rest} className={`${className ?? ''} ${cls}`}>
              {label}
            </h2>
          );
        },
        h3: ({ children: c, className, ...rest }) => (
          <h3 {...rest} className={`${className ?? ''} mt-15`}>
            {c}
          </h3>
        ),
        p: ({ children: c, className, ...rest }) => (
          <p {...rest} className={`mb-2 break-keep ${className ?? ''}`}>
            {c}
          </p>
        ),
        ul: ({ children: c, className, ...rest }) => (
          <ul {...rest} className={`mb-2 list-disc pl-13 ${className ?? ''}`}>
            {c}
          </ul>
        ),
        ol: ({ children: c, className, ...rest }) => (
          <ol {...rest} className={`mb-2 list-decimal pl-13 ${className ?? ''}`}>
            {c}
          </ol>
        ),
        li: ({ children: c, className, ...rest }) => (
          <li {...rest} className={`mb-1 ${className ?? ''}`}>
            {c}
          </li>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
