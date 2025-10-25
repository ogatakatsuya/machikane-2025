"use client";

import Image from "next/image";
import { useState } from "react";
import Modal from "./Modal";

interface InstagramShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

const InstagramShareModal = ({
  isOpen,
  onClose,
  groupId,
}: InstagramShareModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/instagram-share/${groupId}`);
      const data = await response.json();

      if (data.status === "OK") {
        setImageData(data.image);
      } else {
        setError(data.error || "画像の生成に失敗しました");
      }
    } catch (err) {
      setError("画像の生成に失敗しました");
      console.error("Instagram share error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveImage = async () => {
    if (!imageData) return;

    try {
      // base64をblobに変換
      const base64Response = await fetch(`data:image/png;base64,${imageData}`);
      const blob = await base64Response.blob();
      const file = new File([blob], `machikane-quiz-result-${groupId}.png`, { 
        type: 'image/png' 
      });

      // Web Share APIが利用可能でファイル共有がサポートされている場合
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
        });
        return;
      }

      // フォールバック: 従来のダウンロード方式
      downloadImage();
    } catch (error) {
      console.error('Share failed:', error);
      // エラーが発生した場合はダウンロードにフォールバック
      downloadImage();
    }
  };

  const downloadImage = () => {
    if (!imageData) return;

    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imageData}`;
    link.download = `machikane-quiz-result-${groupId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setImageData(null);
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Instagramストーリーで共有"
    >
      <div className="p-6 space-y-4">
        {!imageData && !isGenerating && (
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">結果画像を生成します</h3>
            <p className="text-gray-600 text-sm">
              Instagramストーリー用の画像を生成します
            </p>
            <button
              type="button"
              onClick={generateImage}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              画像を生成する
            </button>
          </div>
        )}

        {isGenerating && (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <h3 className="text-lg font-semibold">画像を生成中...</h3>
            <p className="text-gray-600 text-sm">しばらくお待ちください</p>
          </div>
        )}

        {error && (
          <div className="text-center space-y-4">
            <div className="text-red-500 text-6xl">⚠️</div>
            <h3 className="text-lg font-semibold text-red-600">
              エラーが発生しました
            </h3>
            <p className="text-gray-600 text-sm">{error}</p>
            <button
              type="button"
              onClick={generateImage}
              className="w-full py-3 px-4 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              再試行
            </button>
          </div>
        )}

        {imageData && (
          <div className="text-center space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Image
                src={`data:image/png;base64,${imageData}`}
                alt="Instagram用画像"
                width={216}
                height={384}
                className="w-full max-w-sm mx-auto"
              />
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={saveImage}
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                📱 画像を保存
              </button>
              <p className="text-xs text-gray-500 text-center">
                スマホの場合、写真アプリに保存されます
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InstagramShareModal;
