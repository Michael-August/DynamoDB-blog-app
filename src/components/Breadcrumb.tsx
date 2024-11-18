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
  const breadcrumbItems = pathSegments.filter(segment => segment !== 'blog').map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    return { label: segment.replace(/-/g, ' '), path };
  });

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
          <li key={index} style={breadcrumbItemStyle}>
            {index !== breadcrumbItems.length - 1 ? (
              <Link href={item.path} style={linkStyle}>
                {item.label}
              </Link>
            ) : (
              <span style={activeStyle}>{item.label}</span>
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
