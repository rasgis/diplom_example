import React, { useRef, useState } from "react";
import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  currentImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);

      // Создаем превью изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className={styles.input}
        hidden
      />
      <div className={styles.preview} onClick={handleClick}>
        {preview ? (
          <img src={preview} alt="Preview" className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <span>Нажмите для загрузки изображения</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
