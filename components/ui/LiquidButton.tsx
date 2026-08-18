import { ArrowUpRight } from "lucide-react";
import { instagramUrl } from "@/lib/content/minus-one";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export function LiquidButton({ children = "Order via Instagram", className = "" }: Props) {
  return (
    <a className={`liquid-button ${className}`} href={instagramUrl} target="_blank" rel="noreferrer">
      <span>{children}</span>
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}
