import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAPIMutation } from "@/lib/api.hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./LogInForm.schema";
import { LogInParams, LogInResponse } from "./types";

function LogInForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useAPIMutation<LogInParams, LogInResponse>(
    "/users/login",
    {
      toastOption: {
        success: {
          description: "Email sent! Check your inbox for the login URL.",
        },
      },
      onSuccess: () => {
        form.reset();
      },
    }
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 "
        id="form"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                  className="text-lg py-6"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4 max-w-96 mx-auto w-full">
          <Button
            type="submit"
            size="lg"
            className="mx-1 py-4 rounded-full bg-teal-500"
            disabled={isPending}
          >
            Log In
          </Button>
          <div className="px-4 flex items-center justify-center gap-2">
            <div className="w-full border-b"></div>
            <p>or</p>
            <div className="w-full border-b"></div>
          </div>
          <Button size="lg" className="mx-1 py-4 rounded-full w-full" asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default LogInForm;
