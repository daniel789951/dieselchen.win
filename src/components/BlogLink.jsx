import React from 'react';

const BlogLink = () => {
  return (
    <div id="blog-link">
      <h3>技術顧問</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
        <a
          href="https://blog.giveanornot.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', width: '100%' }}
        >
          安顧問
        </a>
        <a
          href="https://www.starnight.one/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', width: '100%' }}
        >
          達顧問
        </a>
      </div>
    </div>
  );
};

export default BlogLink;
