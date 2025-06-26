type LoadingComponentProps = {
  message?: string;
};

export default function LoadingComponent({ message }: LoadingComponentProps) {
  return (
    <div className='flex items-center justify-center min-h-[400px]'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin'></div>
          <p className='text-sm text-muted-foreground'>
            {message || '로딩 중...'}
          </p>
        </div>
      </div>
  );
}