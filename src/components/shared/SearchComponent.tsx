import useDebounce from '@/app/utils/utils';
import { useGetMostLikedPost, useSearchPosts } from '@/lib/react-query/queriesAndMutation';
import { useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { ScrollArea } from '../ui/scroll-area';
import { PostCard } from './PostCard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Loader } from './Loader';

type SearchComponentProps = {
  showTrending?: boolean;
  modal?: boolean;
};

export const SearchComponent = ({ showTrending = false, modal = false }: SearchComponentProps) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearch = useDebounce(searchValue, 1000);
  const { data: searchedPosts, isPending: searchLoading } = useSearchPosts(debouncedSearch);
  const { data: mostLikedPosts, isPending: mostLikeLoading } = useGetMostLikedPost();
  const inputRef = useRef<HTMLInputElement>(null);

  if (mostLikeLoading) {
    return <Loader />;
  }

  if (modal)
    return (
      <Dialog aria-describedby={'search-modal'}>
        <DialogTrigger className='w-full h-10 p-1 bg-black rounded-2xl rounded-t-none bg-opacity-10 flex justify-center items-center group-hover/card:bg-opacity-50 group-hover/card:h-1 lg:group-hover/card:h-1/4 transition-all duration-300 backdrop-blur-md'>
          <FaSearch size={20} className='cursor-pointer group-hover:opacity-100 transition-all duration-300' />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='min-h-96 w-full max-w-full overflow-hidden relative'>
              <div className='w-full h-12 px-2'>
                <label htmlFor='search-box' className='flex flex-row h-full w-full'>
                  <input
                    ref={inputRef}
                    type='text'
                    onChange={(e) => {
                      const { value } = e.target;
                      setSearchValue(value);
                    }}
                    className='w-full lg:w-10/12 rounded-l-md p-2 border border-input border-r-0 bg-background outline-none text-sm text-secondary-foreground'
                    id='search-box'
                    placeholder='Discover more...'
                  />
                  <div className='w-2/12 flex justify-center items-center border border-input border-l-0 rounded-r-md bg-background'>
                    {searchValue && searchedPosts?.length ? (
                      <IoMdCloseCircleOutline
                        size={25}
                        onClick={() => {
                          setSearchValue('');
                          if (inputRef.current) {
                            inputRef.current.value = '';
                          }
                        }}
                        className='cursor-pointer hover:scale-110 transition-all duration-300'
                      />
                    ) : (
                      <FaSearch size={20} className='cursor-pointer hover:scale-110 transition-all duration-300' />
                    )}
                  </div>
                </label>
              </div>
              <div
                className={
                  'min-h-full h-1 overflow-y-scroll w-full px-1 py-3 flex flex-col gap-4 rounded-lg absolute top-16 z-50 '
                }
              >
                {searchedPosts?.length === 0 && (
                  <div className='text-muted-foreground italic text-center'>No result found</div>
                )}
                {searchValue &&
                  searchedPosts?.map((post) => (
                    <div key={post.id} className='w-full h-full text-left'>
                      <PostCard post={post} />
                    </div>
                  ))}
                <div className='mb-20' />
                {!searchValue && !searchedPosts && (
                  <>
                    {showTrending && (
                      <>
                        <p className='w-full font-outfit font-bold text-center'>Trending Moment</p>
                        <ScrollArea className='w-full px-1 h-full scroll-smooth'>
                          <div className='grid grid-cols-1 gap-2 px-2'>
                            {mostLikedPosts?.map((post) => (
                              <PostCard key={post.id} post={post} className='last:mb-20' />
                            ))}
                          </div>
                        </ScrollArea>
                      </>
                    )}
                  </>
                )}
              </div>
            </DialogTitle>

            <DialogDescription />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

  return (
    <div className='h-full overflow-hidden relative py-2'>
      <div className='w-full h-12 px-2'>
        <label htmlFor='search-box' className='flex flex-row h-full w-full'>
          <input
            ref={inputRef}
            type='text'
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
            className='w-10/12 rounded-l-md p-2 border border-input border-r-0 bg-background outline-none text-sm text-secondary-foreground'
            id='search-box'
            placeholder='Discover more...'
          />
          <div className='w-2/12 flex justify-center items-center border border-input border-l-0 rounded-r-md bg-background'>
            {searchValue && searchedPosts?.length ? (
              <IoMdCloseCircleOutline
                size={25}
                onClick={() => {
                  setSearchValue('');
                  if (inputRef.current) {
                    inputRef.current.value = '';
                  }
                }}
                className='cursor-pointer hover:scale-110 transition-all duration-300'
              />
            ) : (
              <FaSearch size={20} className='cursor-pointer hover:scale-110 transition-all duration-300' />
            )}
          </div>
        </label>
      </div>
      <div className={'w-full h-full px-1 py-3 flex flex-col gap-4 rounded-lg absolute z-50 '}>
        {searchValue && searchLoading && <Loader />}
        {searchedPosts?.length === 0 && <div className='text-muted-foreground italic text-center'>No result found</div>}
        {searchValue && searchedPosts?.map((post) => <PostCard key={post.id} post={post} className='max-h-80' />)}
        {!searchValue && !searchedPosts && showTrending && (
          <ScrollArea className='h-1 min-h-full w-full'>
            <p className='w-full font-outfit font-bold text-center mb-2'>Trending Moment</p>
            <div className='grid grid-cols-1 gap-2 px-2 mb-20'>
              {mostLikedPosts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
