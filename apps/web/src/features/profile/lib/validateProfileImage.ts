import { ALLOWED_TYPES, MAX_FILE_SIZE, MAX_SIZE, MIN_SIZE } from '../model/constants';

async function validateProfileImage(file: File): Promise<void> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('지원하지 않는 이미지 형식입니다. (JPG, PNG, WebP만 가능합니다.)');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('이미지 용량은 10MB 이하만 가능합니다.');
  }

  const img = new Image();

  await new Promise<void>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const { width, height } = img;

      URL.revokeObjectURL(objectUrl);

      if (width < MIN_SIZE || height < MIN_SIZE || width > MAX_SIZE || height > MAX_SIZE) {
        reject(new Error('이미지 크기는 200×200 이상, 4096×4096 이하여야 합니다.'));
        return;
      }

      resolve();
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('이미지를 불러올 수 없습니다.'));
    };

    img.src = objectUrl;
  });
}

export { validateProfileImage };
