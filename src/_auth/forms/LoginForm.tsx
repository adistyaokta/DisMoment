import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useLoginAccount } from '@/lib/react-query/queriesAndMutation';
import { LoginValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiLoader5Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import type { z } from 'zod';

export const LoginForm = () => {
  const { toast } = useToast();
  const { mutateAsync: loginAccount, isPending: loading } = useLoginAccount();
  const navigate = useNavigate();
  const [useDemo, setUseDemo] = useState(false);

  const form = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      username: '',
      password: ''
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
    <div className='h-full w-full flex justify-center items-center'>
      <Form {...form}>
        <div className='w-full lg:w-1/2 h-full flex flex-col items-center justify-center border border-x-0 transition-all duration-300'>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full h-fit flex flex-col items-center justify-center gap-5 px-2 py-3'
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className='w-1/2 flex flex-col justify-start gap-5 text-center'
            >
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base font-outfit'>Username</FormLabel>
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
                    <FormLabel className='text-base font-outfit'>Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-1/2 h-10 mx-auto'>
                {loading ? <RiLoader5Fill className='animate-spin' /> : 'Login'}
              </Button>
            </motion.div>
          </form>
          <div className='flex justify-center items-center gap-2'>
            <Checkbox id='demo-checkbox' onClick={() => setUseDemo(!useDemo)} />
            <div className='grid gap-1.5 leading-none'>
              <label
                htmlFor='demo-checkbox'
                className='text-sm font-medium font-outfit leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Use demo account?
              </label>
            </div>
          </div>
          <div
            className={`flex flex-col text-muted-foreground my-5 text-center font-outfit italic ${!useDemo && 'opacity-0'} transition-all duration-300`}
          >
            <p>username: discover-demo</p>
            <p>password: demo12345</p>
          </div>
        </div>
      </Form>
    </div>
  );
};
