import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./RegisterForm.schema";
import { Link } from "@tanstack/react-router";
import { useAPIMutation } from "@/lib/api.hooks";
import { RegisterParams, RegisterResponse } from "./types";

function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const { mutate, isPending } = useAPIMutation<
    RegisterParams,
    RegisterResponse
  >("/users/register", {
    toastOption: {
      success: {
        description: "Success! You can now log in.",
      },
    },
    onSuccess: () => {
      form.reset();
    },
  });

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Name"
                  type="text"
                  {...field}
                  className="text-lg py-6"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  className="text-lg py-6"
                  {...field}
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
            className="mx-1 py-4 rounded-full "
            disabled={isPending}
          >
            Register
          </Button>
          <div className="px-4 flex items-center justify-center gap-2">
            <div className="w-full border-b"></div>
            <p>or</p>
            <div className="w-full border-b"></div>
          </div>
          <Button
            size="lg"
            className="mx-1 py-4 rounded-full w-full pl-6 "
            variant="ghost"
            asChild
          >
            <Link to="/"> Log In</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default RegisterForm;
