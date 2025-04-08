"use client";

import { Drawer as VaulDrawer } from "vaul";
import useGlobal from "@/hooks/useGlobal";

export default function AdminDrawer() {
  const { showDrawer, setShowDrawer } = useGlobal();

  return (
    <VaulDrawer.Root open={showDrawer} onOpenChange={setShowDrawer}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
        <VaulDrawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none">
          {/* DRAWER CONTENT */}
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
