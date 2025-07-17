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
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/context/i18n-context";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import app from "@/firebase/config";

export function ForgotPasswordForm() {
  const { t } = useI18n();
  const { toast } = useToast();

  const FormSchema = z.object({
    email: z.string().email({ message: t('form.errorEmailInvalid') }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const firebase_app = app;
      const auth = getAuth(firebase_app);
      await sendPasswordResetEmail(auth, data.email);
      toast({
        title: t('toast.passwordResetRequestedTitle'),
        description: t('toast.passwordResetRequestedDescription', { email: data.email }),
      });
      form.reset();
    } catch (error: any) {
      console.error("Password reset failed:", error);
      toast({
        title: t('toast.loginError'),
        description: t('toast.loginFailedGeneric'),
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.emailLabel')}</FormLabel>
              <FormControl>
                <Input placeholder={t('form.emailPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t('common.loading') : t('pages.forgotPassword.sendResetLinkButton')}
        </Button>
      </form>
    </Form>
  );
}
