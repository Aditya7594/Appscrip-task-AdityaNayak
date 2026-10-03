'use client';

import React, { useSyncExternalStore } from 'react';
import { HeartIcon } from '@/components/ui/icons';

interface WishlistButtonProps {
  productId: number;
  title: string;
  className?: string;
  iconClassName?: string;
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('wishlist-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('wishlist-change', callback);
  };
}

function getSnapshot(): string {
  try {
    return localStorage.getItem('plp.wishlist') || '[]';
  } catch {
    return '[]';
  }
}

function getServerSnapshot(): string {
  return '[]';
}

export function WishlistButton({
  productId,
  title,
  className,
  iconClassName,
}: WishlistButtonProps) {
  const wishlistJson = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  let isWishlisted = false;
  try {
    const ids = JSON.parse(wishlistJson);
    if (Array.isArray(ids)) {
      isWishlisted = ids.includes(productId);
    }
  } catch {
    // Ignore JSON parse error
  }

  const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const stored = localStorage.getItem('plp.wishlist');
      let ids: number[] = [];
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          ids = parsed;
        }
      }

      if (!isWishlisted) {
        if (!ids.includes(productId)) {
          ids.push(productId);
        }
      } else {
        ids = ids.filter((id) => id !== productId);
      }

      localStorage.setItem('plp.wishlist', JSON.stringify(ids));
      window.dispatchEvent(new Event('wishlist-change'));
    } catch {
      // Ignore write errors
    }
  };

  const label = isWishlisted
    ? `Remove ${title} from wishlist`
    : `Add ${title} to wishlist`;

  return (
    <button
      type="button"
      className={className}
      aria-pressed={isWishlisted}
      aria-label={label}
      onClick={toggleWishlist}
    >
      <HeartIcon
        size={20}
        filled={isWishlisted}
        className={iconClassName}
      />
    </button>
  );
}
