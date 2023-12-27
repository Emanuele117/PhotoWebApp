import React, { ChangeEvent, useState } from "react";
import { uploadPhoto } from "../../api/photo";

export const Uploader: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      try {
        await uploadPhoto(formData);
        console.log("Upload success");
        // Puoi aggiungere qui qualsiasi logica successiva all'upload
      } catch (error) {
        console.error("Upload error:", error);
        setError("Si è verificato un errore durante l'upload.");
        // Puoi aggiungere qui qualsiasi logica di gestione degli errori
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <form>
      <p>Upload files:</p>
      <input type="file" multiple onChange={uploadFile} />
      {uploading && <p>Sto caricando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};
