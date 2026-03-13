/* ===== Component: ExpiredBookingModal ===== */
// Responsibility: Display expired booking modal

import { useRouter } from "next/router";
import Modal from "@/components/ui/Modal";

interface ExpiredBookingModalProps {
  isOpen: boolean;
  onPrimaryAction: () => void;
}

export const ExpiredBookingModal = ({
  isOpen,
  onPrimaryAction,
}: ExpiredBookingModalProps) => {
  const router = useRouter();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => router.back()}
      title="Booking expired"
      primaryActionButton="OK"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={() => router.back()}
      className="max-w-100"
    >
      <p className="text-body-2 text-brand-gray-400">
        You did not complete the checkout process in time, please start again
      </p>
    </Modal>
  );
};
