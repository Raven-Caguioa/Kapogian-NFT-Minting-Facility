'use client';

import {
  Link as LinkIcon,
  Box,
  ShoppingCart,
  ShieldCheck,
} from 'lucide-react';

const logos = [
  { name: 'SUI Network', icon: LinkIcon },
  { name: 'IPFS Storage', icon: Box },
  { name: 'Tradeport', icon: ShoppingCart },
  { name: 'Soulbound', icon: ShieldCheck },
];

export default function LogoMarquee() {
  return (
    <div className="relative w-full overflow-hidden bg-card py-6 border-y">
      <div className="flex w-max animate-marquee">
        {[...logos, ...logos, ...logos, ...logos].map((logo, index) => {
          const Icon = logo.icon;
          return (
            <div key={index} className="flex items-center gap-2 font-semibold text-lg tracking-tight px-8 text-muted-foreground hover:text-foreground transition-colors">
              <Icon className="w-6 h-6" />
              <span>{logo.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
