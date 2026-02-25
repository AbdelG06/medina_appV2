import { useMemo, useState } from "react";

type OptimizedImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
};

const cloudinarySizes = [320, 480, 768, 1024, 1366];

const buildCloudinaryVariant = (url: string, width: number) => {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return "";
  }

  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
};

export const OptimizedImage = ({ src, alt, className, sizes = "100vw", eager = false }: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);

  const srcSet = useMemo(() => {
    if (!src.includes("res.cloudinary.com")) {
      return undefined;
    }

    return cloudinarySizes
      .map((size) => {
        const variant = buildCloudinaryVariant(src, size);
        return variant ? `${variant} ${size}w` : "";
      })
      .filter(Boolean)
      .join(", ");
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      {!loaded ? <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden="true" /> : null}
      <img
        src={src}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};
