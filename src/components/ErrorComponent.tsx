type ErrorComponentProps = {
  error: Error;
};

export default function ErrorComponent({ error }: ErrorComponentProps) {
  return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-red-100 flex items-center justify-center'>
            <svg
              className='w-6 h-6 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              오류가 발생했습니다
            </h3>
            <p className='text-sm text-muted-foreground max-w-md'>
              {error.message}
            </p>
          </div>
      </div>
    </div>
  );
}