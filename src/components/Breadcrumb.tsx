'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
  const pathname = usePathname();

  // Split the pathname into segments
  const pathSegments = pathname.split('/').filter(segment => segment);

  // Skip specific segments like "blog"
  const breadcrumbItems = pathSegments.filter(segment => segment !== 'blog' && segment !== 'tags' && segment !== 'tag').map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    return { label: segment.replace(/-/g, ' '), path };
  });

  // Check if 'tag' exists in the pathname
  const hasTag = pathSegments.includes('tags') && pathSegments.includes('blog') || pathSegments.includes('tag');

  return (
    <nav aria-label="breadcrumb">
      <ol style={breadcrumbStyle}>
        <li style={breadcrumbItemStyle}>
          <a href="/" style={linkStyle}>
            Articles
          </a>
        </li>
        <li style={breadcrumbItemStyle}>
          <ChevronRight />
        </li>
        {breadcrumbItems.map((item, index) => (
          <li className='' key={index} style={breadcrumbItemStyle}>
            {index !== breadcrumbItems.length - 1 ? (
              <a href={item.path} style={linkStyle}>
                {hasTag ? item.label : item.label.slice(0, -7)}
              </a>
            ) : (
              <span style={activeStyle}>{hasTag || item.label === "about" ? item.label : item.label.slice(0, -7)}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Styles
const breadcrumbStyle = {
  listStyle: 'none',
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  margin: 0,
  marginBottom: '16px',
  fontSize: '14px',
};

const breadcrumbItemStyle = {
  marginRight: '8px',
  display: 'flex',
  alignItems: 'center',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#007bff',
};

const activeStyle = {
  color: '#6c757d',
  fontWeight: 'bold',
};

export default Breadcrumb;
