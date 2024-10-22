import { useEffect, useState } from "react";

export const useCopyToClipboard = (): {
  isCopied: boolean;
  copyToClipboard: (content: string) => Promise<void>;
} => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const id = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return (): void => clearTimeout(id);
    }
  }, [isCopied]);

  const copyToClipboard = async (content: string): Promise<void> => {
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
