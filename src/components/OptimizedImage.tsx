import { memo, useMemo } from "react";

type OptimizedImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
};

const cloudinarySizes = [320, 480, 768, 1024, 1366];
const isValidImageSrc = (value: string) => {
  const src = String(value || "").trim();
  if (!src || src === "invalid/" || src === "invalid") {
    return false;
  }
  if (src.startsWith("/") || src.startsWith("./") || src.startsWith("../")) {
    return true;
  }
  return /^https?:\/\//i.test(src) || src.startsWith("data:image/");
};

const buildCloudinaryVariant = (url: string, width: number) => {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return "";
  }

  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
};

const OptimizedImageComponent = ({ src, alt, className, sizes = "100vw", eager = false }: OptimizedImageProps) => {
  const safeSrc = isValidImageSrc(src) ? src : "";

  const srcSet = useMemo(() => {
    if (!safeSrc.includes("res.cloudinary.com")) {
      return undefined;
    }

    return cloudinarySizes
      .map((size) => {
        const variant = buildCloudinaryVariant(safeSrc, size);
        return variant ? `${variant} ${size}w` : "";
      })
      .filter(Boolean)
      .join(", ");
  }, [safeSrc]);

  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      {safeSrc ? (
        <img
          src={safeSrc}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={alt}
          className="h-full w-full object-cover"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
        />
      ) : null}
    </div>
  );
};

export const OptimizedImage = memo(OptimizedImageComponent);
