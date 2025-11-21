import { readonly } from 'vue';

export const useVideoModal = () => {
  const isVideoModalOpen = useState<boolean>('video-modal-open', () => false);
  const playbackId = useState<string | null>(
    'video-modal-playback-id',
    () => null
  );

  const openVideoModal = (id: string) => {
    playbackId.value = id;
    isVideoModalOpen.value = true;
  };

  const closeVideoModal = () => {
    isVideoModalOpen.value = false;
    // Clear playback ID after a short delay to allow for exit animation
    setTimeout(() => {
      playbackId.value = null;
    }, 300);
  };

  return {
    isVideoModalOpen: readonly(isVideoModalOpen),
    playbackId: readonly(playbackId),
    openVideoModal,
    closeVideoModal,
  };
};
