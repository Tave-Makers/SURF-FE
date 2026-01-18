'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Markdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children: c, className, ...rest }) => (
          <h2 {...rest} className={`${className ?? ''} mt-15`}>
            {c}
          </h2>
        ),
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
          <ul {...rest} className={`mb-2 list-disc pl-15 ${className ?? ''}`}>
            {c}
          </ul>
        ),
        ol: ({ children: c, className, ...rest }) => (
          <ol {...rest} className={`mb-2 list-decimal pl-15 ${className ?? ''}`}>
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
