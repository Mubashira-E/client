"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useState } from "react";

type LoginImageSectionProps = {
  imageSrc: StaticImageData | string;
};

export function LoginImageSection({ imageSrc }: LoginImageSectionProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isStringUrl = typeof imageSrc === "string";

  const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZyI+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNmZmZmZmYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZjVmNWY1Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+Cjwvc3ZnPg==";

  return (
    <section className="group relative hidden h-full w-full sm:flex sm:flex-1 bg-white">
      {isStringUrl
        ? (
            <>
              <Image
                src={imageSrc}
                fill
                className="h-full w-full object-cover blur-sm"
                alt=""
                quality={1}
                priority
                unoptimized
              />
              <Image
                src={imageSrc}
                fill
                className={`h-full w-full object-cover transition-opacity duration-100 ease-in-out ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                alt="Medical personnel cover image"
                priority
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
                sizes="(max-width: 640px) 0vw, 50vw"
                unoptimized
              />
            </>
          )
        : (
            <>
              <Image
                src={imageSrc}
                fill
                className="h-full w-full object-cover blur-sm"
                alt=""
                quality={1}
                priority
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
              <Image
                src={imageSrc}
                fill
                className={`h-full w-full object-cover transition-opacity duration-100 ease-in-out ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                alt="Medical personnel cover image"
                priority
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
                sizes="(max-width: 640px) 0vw, 50vw"
              />
            </>
          )}
    </section>
  );
}
