
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { useState } from "react";
import { Paperclip, X } from "lucide-react";

interface ContactContractorFormProps {
    contractorName: string;
    onSuccess: () => void;
}

const formSchema = z.object({
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(20, { message: "Message must be at least 20 characters." }),
  attachments: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactContractorForm({ contractorName, onSuccess }: ContactContractorFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: FormValues) {
    console.log("Simulating sending email to contractor:", {
      to: contractorName,
      fromName: user?.displayName || "A Homeowner",
      fromEmail: user?.email,
      subject: data.subject,
      message: data.message,
      attachments: attachedFiles.map(f => f.name),
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description: `Your project inquiry has been sent to ${contractorName}.`,
    });
    
    form.reset();
    setAttachedFiles([]);
    onSuccess();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
          setAttachedFiles(Array.from(event.target.files));
      }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Kitchen Renovation Inquiry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your project, timeline, and any other important details."
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="attachments"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Attach Pictures</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                id="attachments"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                    handleFileChange(e);
                                    field.onChange(e.target.files);
                                }}
                                className="pl-10"
                            />
                            <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        {attachedFiles.length > 0 && (
            <div className="space-y-2">
                <h4 className="text-sm font-medium">Attached files:</h4>
                <ul className="list-disc list-inside bg-secondary/50 p-2 rounded-md">
                    {attachedFiles.map((file, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center justify-between">
                            <span>{file.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Send Inquiry"}
        </Button>
      </form>
    </Form>
  );
}
