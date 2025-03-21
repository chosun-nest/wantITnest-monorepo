import Cropper from "react-easy-crop";
import Modal from "react-modal";
import { useState } from "react";
import getCroppedImg from "../../utils/imagecrop";

interface ImageCropModalProps {
  imageSrc: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCropDone: (croppedImg: string) => void;
}

export default function ImageCropModal({
  imageSrc,
  isOpen,
  onClose,
  onCropDone,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropDone = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropDone(cropped);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <div style={{ position: "relative", width: "100%", height: 400 }}>
        <Cropper
          image={imageSrc!}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <button onClick={handleCropDone}>자르기 완료</button>
    </Modal>
  );
}
