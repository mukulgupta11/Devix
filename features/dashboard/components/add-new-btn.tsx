"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Braces, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import TemplateSelectionModal from "@/components/modal/template-selector-modal";
import { createPlayground } from "@/features/playground/actions";

const AddNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => {
    const result = await createPlayground(data);
    toast.success("Playground created");
    setIsModalOpen(false);
    router.push(`/playground/${result?.id}`);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsModalOpen(true)}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className="group relative min-h-52 overflow-hidden rounded-2xl border border-border bg-[#24231e] p-6 text-left text-white"
      >
        <div className="dvx-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/20 blur-3xl transition-transform duration-700 group-hover:scale-150" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/5">
              <Plus className="size-5 transition-transform duration-500 group-hover:rotate-90" />
            </span>
            <ArrowUpRight className="size-5 text-white/35 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
          </div>
          <div className="mt-12">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
              <Sparkles className="size-3 text-[#ff7043]" />
              Start from a template
            </div>
            <h3 className="font-headline text-2xl font-normal tracking-[-0.04em]">
              Create a playground
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">
              Launch a complete framework environment and start coding instantly.
            </p>
          </div>
        </div>
        <Braces className="absolute bottom-5 right-6 size-16 text-white/[0.035]" />
      </motion.button>

      <TemplateSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddNewButton;
