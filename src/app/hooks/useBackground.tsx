import { useState, useEffect } from "react";
import { clientSelfUser } from "@/app/types/global";

export function useBackground(user: clientSelfUser | null, userLoading: boolean) {
  const [loading, setLoading] = useState<boolean>(true);
  const [bgImage, setBgImage] = useState<string>("");

  useEffect(() => {
    if (!userLoading) {
      const imgSrc = user?.uiBackground || "https://example.com/default-background.jpeg";
      const img = new Image();
      img.src = imgSrc;

      img.onload = () => {
        setBgImage(imgSrc);
        setLoading(false);
      };

      img.onerror = () => {
        setBgImage("https://example.com/fallback-background.jpeg");
        setLoading(false);
      };
    }
  }, [user, userLoading]);

  return { bgImage, loading };
}
