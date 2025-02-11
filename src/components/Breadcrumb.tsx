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
  const breadcrumbItems = pathSegments.filter(segment => segment !== 'blog' && segment !== 'tags').map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    return { label: segment.replace(/-/g, ' '), path };
  });

  // Check if 'tag' exists in the pathname
  const hasTag = pathSegments.includes('tags') && pathSegments.includes('blog');

  return (
    <nav aria-label="breadcrumb">
      <ol style={breadcrumbStyle}>
        <li style={breadcrumbItemStyle}>
          <Link href="/" style={linkStyle}>
            Articles
          </Link>
        </li>
        <li style={breadcrumbItemStyle}>
          <ChevronRight />
        </li>
        {breadcrumbItems.map((item, index) => (
          <li className='capitalize' key={index} style={breadcrumbItemStyle}>
            {index !== breadcrumbItems.length - 1 ? (
              <Link href={item.path} style={linkStyle}>
                {hasTag ? item.label : item.label.slice(0, -7)}
              </Link>
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
