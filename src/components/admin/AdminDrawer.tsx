"use client";

import { Drawer as VaulDrawer } from "vaul";
import { ReactNode } from "react";
import useGlobal from "@/hooks/useGlobal";

type AdminDrawerProps = {
  children: ReactNode;
  onClose: () => void;
};

export default function AdminDrawer({ children, onClose }: AdminDrawerProps) {
  const { showDrawer, setShowDrawer } = useGlobal();

  return (
    <VaulDrawer.Root
      open={showDrawer}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
        setShowDrawer(open);
      }}
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay
          className="fixed inset-0 bg-black/40 z-40"
          onClick={(e) => e.preventDefault()}
        />
        {showDrawer && (
          <VaulDrawer.Content
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1280px] h-[914px] rounded-xl overflow-y-auto z-50 bg-primary p-6 hide-scrollbar"
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            {children}
          </VaulDrawer.Content>
        )}
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
