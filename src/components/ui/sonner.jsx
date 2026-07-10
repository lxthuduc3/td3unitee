import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

const Toaster = ({ ...props }) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme}
      className='toaster group'
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            'group toast rounded-2xl border border-amber-200/90 bg-amber-50/95 text-amber-950 shadow-xl shadow-amber-900/10 backdrop-blur-xl dark:border-amber-800/80 dark:bg-stone-950/95 dark:text-amber-50',
          title: 'font-bold',
          description: 'text-amber-800/80 dark:text-amber-200/75',
          icon: 'text-amber-600 dark:text-amber-400',
          success:
            'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-100 dark:border-yellow-700 dark:from-yellow-950 dark:to-amber-950',
          info: 'border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-100 dark:border-amber-700 dark:from-amber-950 dark:to-yellow-950',
          warning:
            'border-orange-300 bg-gradient-to-r from-amber-50 to-orange-100 dark:border-orange-800 dark:from-amber-950 dark:to-orange-950',
          error:
            'border-red-300 bg-gradient-to-r from-red-50 to-amber-50 text-red-950 dark:border-red-900 dark:from-red-950 dark:to-stone-950 dark:text-red-50',
          actionButton:
            'rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 font-semibold text-amber-950 hover:from-yellow-500 hover:to-amber-600',
          cancelButton:
            'rounded-lg bg-amber-100 font-medium text-amber-900 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-100',
          closeButton:
            'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-stone-900 dark:text-amber-200',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
