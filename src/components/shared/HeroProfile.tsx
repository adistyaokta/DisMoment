import { useAuthStore } from '@/app/store';
import type { IUser } from '@/app/type';
import { getInitials } from '@/app/utils/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { IoSettingsOutline } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../ui/use-toast';

import { useEditUser, useFollowUser, useUnfollowUser, useUploadImage } from '@/lib/react-query/queriesAndMutation';
import { UpdateProfileValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState, useEffect } from 'react';
import type { z } from 'zod';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type HeroProfileProps = {
  user: IUser;
};

export const HeroProfile = ({ user }: HeroProfileProps) => {
  const { toast } = useToast();
  const { user: isUser } = useAuthStore();
  const validUser = isUser?.id === user?.id;
  const inputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<File | null>(null);
  const { mutateAsync: uploadAva } = useUploadImage();
  const { mutateAsync: updateProfile } = useEditUser();
  const { mutateAsync: followUser } = useFollowUser();
  const { mutateAsync: unfollowUser } = useUnfollowUser();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof UpdateProfileValidation>>({
    resolver: zodResolver(UpdateProfileValidation),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avaUrl: user?.avaUrl || '',
      name: user?.name || ''
    }
  });

  const followers = user?.followers || [];

  const userHasFollowed = followers.some((follower) => follower?.id === isUser?.id);

  useEffect(() => {
    form.reset({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avaUrl: user?.avaUrl || '',
      name: user?.name || ''
    });
  }, [user]);

  async function onSubmit(values: z.infer<typeof UpdateProfileValidation>) {
    let mediaFilePath = null;
    if (imagePreview) {
      const uploadedAva = await uploadAva({ image: imagePreview, folder: 'ava' });
      mediaFilePath = uploadedAva.filePath;
    }

    const updatedUserData = {
      id: user?.id,
      user: {
        username: values.username,
        email: values.email,
        bio: values.bio,
        avaUrl: mediaFilePath || '',
        name: values.name
      }
    };

    try {
      await updateProfile(updatedUserData);
      toast({ title: 'User updated successfully' });
      setDialogOpen(false);
    } catch (error: any) {
      setDialogOpen(true);
      toast({ title: error });
    }

    return;
  }

  async function handleFollowUnfollowUser(postId: number) {
    try {
      if (userHasFollowed) {
        const unfollResponse = await unfollowUser(postId);
        return unfollResponse;
      }
      const follResponse = await followUser(postId);

      return follResponse;
    } catch (error: any) {
      toast({ title: error });
    }
  }

  return (
    <div className='w-full h-full relative border-b flex flex-col justify-around'>
      <div className=' hidden text-4xl lg:text-9xl h-full tracking-normal lg:flex items-center'>{user?.name || ''}</div>
      <div className='w-full flex flex-row justify-between items-center p-2'>
        <div className='flex items-center gap-2'>
          <Avatar>
            <AvatarImage src={user?.avaUrl || ''} />
            <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
          </Avatar>
          <p className='text-lg'>@{user?.username || ''}</p>
        </div>
        <div>
          {!validUser && (
            <Button
              className='capitalize font-outfit text-md font-semibold'
              onClick={() => handleFollowUnfollowUser(user.id)}
            >
              {userHasFollowed ? 'unfollow' : 'follow'}
            </Button>
          )}
        </div>
      </div>
      {validUser && (
        <div className='absolute top-2 right-2 w-8 h-8 max-h-10 flex items-center justify-center group'>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <IoSettingsOutline size={20} />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-full flex flex-col gap-5 px-2 py-3'>
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
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type='text' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='bio'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea className='w-full h-28 max-h-28' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='avaUrl'
                    render={() => (
                      <FormItem className='h-10'>
                        <FormControl>
                          <Input
                            ref={inputRef}
                            className='h-full'
                            type='file'
                            accept='images/*'
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                setImagePreview(file);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='flex-grow' />
                  <Button type='submit'>Update</Button>
                </form>
              </Form>
              <DialogDescription />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};
