export default function DocumentationPage() {
  return (
    <div>
      <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl font-bold'>Documentation</h1>
          <p className='text-sm text-muted-foreground'>
            This is the documentation for the project.
          </p>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-3 gap-4'>
            <div className='bg-muted/50 aspect-video rounded-xl'></div>
            <div className='bg-muted/50 aspect-video rounded-xl'></div>
            <div className='bg-muted/50 aspect-video rounded-xl'></div>
            <div className='bg-muted/50 aspect-video rounded-xl'></div>
            <div className='bg-muted/50 aspect-video rounded-xl'></div>
          </div>
          <div className='bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min md:h-auto'>123</div>
        </div>
      </div>
    </div>
  );
}
