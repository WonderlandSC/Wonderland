'use client';

import type { TOCItemType } from 'fumadocs-core/server';

type TableOfContentsLinkProps = {
  item: TOCItemType;
};

export const TableOfContentsLink = ({ item }: TableOfContentsLinkProps) => {
  return (
    <a
      href={item.url}
      onClick={(e) => {
        e.preventDefault();
        const element = document.querySelector(item.url);
        if (element) {
          const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100; // 8rem = 128px
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
          });
        }
      }}
      className="line-clamp-3 flex rounded-sm text-foreground text-sm underline decoration-foreground/0 transition-colors hover:decoration-foreground/50"
    >
      {item.title}
    </a>
  );
};