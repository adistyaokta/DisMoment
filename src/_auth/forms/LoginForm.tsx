import { useAuthStore } from '@/app/store/authStore';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useLoginAccount } from '@/lib/react-query/queriesAndMutation';
import { LoginValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import type { z } from 'zod';

export const LoginForm = () => {
  const { toast } = useToast();
  const { mutateAsync: loginAccount, isPending: loading } = useLoginAccount();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      username: 'admin2',
      password: 'admin2'
    }
  });

  async function onSubmit(values: z.infer<typeof LoginValidation>) {
    try {
      const session = await loginAccount({ username: values.username, password: values.password });

      if (!session) return;

      if (session) {
        form.reset();
        navigate('/');
      }
    } catch (error: any) {
      toast({ title: error });
    }
  }

  return (
    <Form {...form}>
      <div className='w-1/2 flex justify-center items-center flex-col'>
        <span className='bg-primary p-2 rounded-lg text-white font-black'>DisMoment</span>
        <h2 className='font-bold pt-3'>Log in to your account</h2>
        <p className='font-thin'>Hey welcome back! Please enter your details to continue.</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5 w-full mt-4'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>{loading ? 'Loding' : 'Login'}</Button>
          <p className='text-sm text-center font-thin'>
            Don't have an account?
            <Link to='/sign-up' className='font-bold'>
              {' '}
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};