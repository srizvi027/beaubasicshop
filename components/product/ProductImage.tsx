import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";

/**
 * Next Image wrapper. Product photography on white is multiplied onto the card
 * background so packshots sit naturally on our mist/blush surfaces.
 */
export function ProductImage({ className, blend = true, src, ...rest }: ImageProps & { blend?: boolean }) {
  const isSvg = typeof src === "string" && src.endsWith(".svg");
  return <Image src={src} unoptimized={isSvg} className={cn("object-contain", blend && "mix-blend-multiply", className)} {...rest} />;
}
