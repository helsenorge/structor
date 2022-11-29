interface Navigator {
    msSaveOrOpenBlob: (blobOrBase64: Blob | string, filename: string) => void;
}
