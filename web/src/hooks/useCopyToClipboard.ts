import { useEffect, useState } from "react";

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const id = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(id);
    }
  }, [isCopied]);

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      // eslint-disable-next-line no-console
      console.log("Copied to clipboard:", content);
    } catch (error) {
      setIsCopied(false);
      // eslint-disable-next-line no-console
      console.error("Unable to copy to clipboard:", error);
    }
  };

  return { isCopied, copyToClipboard };
};
