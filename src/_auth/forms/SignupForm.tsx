import { SignupValidation } from '@/app/lib/validation';
import { useAuthStore } from '@/app/store/authStore';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import type { z } from 'zod';

export const SignupForm = () => {
  const { toast } = useToast();
  const { signup, login } = useAuthStore();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const success = await signup(values.username, values.email, values.password);

    if (!success) {
      return toast({
        title: 'Sign up failed. Please try again'
      });
    }

    const session = await login(values.username, values.password);

    if (session) {
      form.reset();
      navigate('/');
    } else {
      toast({ title: 'Sign in failed. Please try again.' });
    }
  }
  return (
    <Form {...form}>
      <div className='w-1/2 flex justify-center items-center flex-col'>
        <span className='bg-primary p-2 rounded-lg text-white font-black'>DisMoment</span>
        <h2 className='font-bold pt-3'>Create a new account</h2>
        <p className='font-thin'>Enter your details and start capturing this moment.</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5 w-full mt-4'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>username</FormLabel>
                <FormControl>
                  <Input type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' {...field} />
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
          <Button type='submit'>Signup</Button>
          <p className='text-sm text-center font-thin'>
            Already registered?
            <Link to='/sign-in' className='font-bold'>
              {' '}
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};
