import Link from "next/link";
import { useState } from "react";

export const AwardCards = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {items.map((item) => (
        <Link
          href={item?.link}
          key={item?.link}
          className="relative group  block p-2 h-full w-full transition-all hover:scale-110"
        >
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20 ${className}`
      }
    >
      <div className="relative z-50">
        <div className="p-1">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={`text-zinc-100 font-bold tracking-wide mt-4 ${className}`}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={`mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm ${className}`}
    >
      {children}
    </p>
  );
};
