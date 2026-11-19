'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function RegisteredModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = searchParams.get('registered') === '1';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [open]);

  // Fires for the OK button and the Esc key. Dropping ?registered=1 keeps
  // the modal from reappearing on refresh.
  const handleClose = () => {
    router.replace(pathname, { scroll: false });
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-labelledby="registered-title"
      className="m-auto w-full max-w-sm rounded-lg p-6 shadow-xl backdrop:bg-black/40"
    >
      <h2 id="registered-title" className="text-lg font-semibold">
        Registration successful
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Your account has been created. Please log in to continue.
      </p>
      <form method="dialog" className="mt-6 flex justify-end">
        <button
          type="submit"
          autoFocus
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          OK
        </button>
      </form>
    </dialog>
  );
}
