type UseDownloadFileReturn = {
  download: (valueSet: string, fileName: string, type?: string) => void;
};

export const useDownloadFile = (): UseDownloadFileReturn => {
  const download = (
    valueSet: string,
    fileName: string,
    type: string = "application/json",
  ): void => {
    const blob = new Blob([valueSet], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return { download };
};
