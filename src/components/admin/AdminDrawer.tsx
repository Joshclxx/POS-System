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
        // When open becomes false, trigger onClose.
        // (The drawer will only close via the X button.)
        if (!open) {
          onClose();
        }
        setShowDrawer(open);
      }}
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay
          className="fixed inset-0 bg-black/40"
          onClick={(e) => e.preventDefault()}
        />
        {showDrawer && (
          <VaulDrawer.Content
            className="flex flex-col w-full max-w-[1280px] h-screen fixed top-[80px] left-0 outline-none z-50 bg-primary"
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
