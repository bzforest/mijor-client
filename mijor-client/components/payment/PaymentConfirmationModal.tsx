/* ===== Component: PaymentConfirmationModal ===== */
// Responsibility: Display payment confirmation modal

import Modal from "@/components/ui/Modal";

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const PaymentConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
}: PaymentConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm booking"
      primaryActionButton="Confirm"
      secondaryActionButton="Cancel"
      onPrimaryAction={onConfirm}
      onSecondaryAction={onClose}
      className="max-w-100"
    >
      <p className="text-body-2 text-brand-gray-400">Confirm booking and payment?</p>
    </Modal>
  );
};
