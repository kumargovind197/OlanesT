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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export function LoginForm() {
  const { t } = useI18n();
  const { toast } = useToast();
  const router = useRouter();

  const FormSchema = z.object({
    email: z.string().email({ message: t("form.errorEmailInvalid") }),
    password: z.string().min(1, "Password is required."),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      if (!user) throw new Error("User not found");

      // ✅ Admin Check (Hardcoded)
      if (user.email === "admin123@olanest.com") {
        toast({
          title: t("toast.loginSuccess"),
          description: t("toast.loginSuccessDescription"),
        });
        router.push("/admin/dashboard");
        return;
      }

      // ✅ Check contractor role
      const contractorRef = doc(db, "Userrolecontactor", user.uid);
      const contractorSnap = await getDoc(contractorRef);

      if (contractorSnap.exists()) {
        toast({
          title: t("toast.loginSuccess"),
          description: t("toast.loginSuccessDescription"),
        });
        router.push("/contractor/dashboard");
        return;
      }

      // ✅ Check homeowner role
      const homeownerRef = doc(db, "Userrolehomeowner", user.uid);
      const homeownerSnap = await getDoc(homeownerRef);

      if (homeownerSnap.exists()) {
        toast({
          title: t("toast.loginSuccess"),
          description: t("toast.loginSuccessDescription"),
        });
        router.push("/homeowner/dashboard");
        return;
      }

      // ❌ Role not found
      throw new Error("User role not assigned.");

    } catch (error: any) {
      console.error("Login failed:", error);

      let errorMessage = t("toast.loginFailedGeneric");

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = t("toast.loginInvalidCredentials");
      } else if (error.code === "auth/invalid-email") {
        errorMessage = t("toast.loginInvalidEmailFormat");
      }

      toast({
        title: t("toast.loginError"),
        description: errorMessage,
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
              <FormLabel>{t("form.emailLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form.emailPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.passwordLabel")}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={t("form.passwordPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link href="/auth/forgot-password" passHref>
              <span className="font-medium text-primary hover:text-primary/90 cursor-pointer">
                {t("pages.login.forgotPassword")}
              </span>
            </Link>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? t("common.loading") : t("navbar.login")}
        </Button>
        <div className="mt-4 text-center text-sm">
          {t("pages.login.dontHaveAccount")}{" "}
          <Link href="/auth/signup" passHref>
            <span className="font-medium text-primary hover:text-primary/90 cursor-pointer">
              {t("navbar.signUp")}
            </span>
          </Link>
        </div>
      </form>
    </Form>
  );
}
