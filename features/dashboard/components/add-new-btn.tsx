"use client";
import TemplateSelectionModal from "@/components/modal/template-selector-modal";
import { Button } from "@/components/ui/button"
import { createPlayground } from "@/features/playground/actions";
import { Plus } from 'lucide-react'
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";

const AddNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  } | null>(null)
  const router = useRouter()

  const handleSubmit = async(data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => {
    setSelectedTemplate(data)
    const res = await createPlayground(data);
    toast("Playground created successfully");
    // Here you would typically handle the creation of a new playground
    // with the selected template data
    console.log("Creating new playground:", data)
    setIsModalOpen(false)
    router.push(`/playground/${res?.id}`)
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group px-6 py-6 flex flex-row justify-between items-center border border-border rounded-2xl bg-card cursor-pointer 
        transition-all duration-300 ease-in-out
        hover:bg-muted hover:border-primary hover:-translate-y-1
        shadow-sm
        hover:shadow-md"
      >
        <div className="flex flex-row justify-center items-start gap-5">
          <div
            className="flex justify-center flex-shrink-0 items-center w-12 h-12 rounded-xl bg-muted border border-border text-muted-foreground group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-colors duration-300"
          >
            <Plus size={24} className="transition-transform duration-300 group-hover:rotate-90" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-headline text-foreground group-hover:text-primary transition-colors">Add New Playground</h1>
            <p className="text-sm text-muted-foreground max-w-[220px] font-body">Create a new dev environment</p>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <Image
            src={"/add-new.svg"}
            alt="Create new playground"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
      
      <TemplateSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default AddNewButton
