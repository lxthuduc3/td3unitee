import { Suspense } from 'react'
import { format } from 'date-fns'
import useFetch from '@/hooks/use-fetch'
import { buildUrl } from '@/lib/utils'

import { documentCategories } from '@/lib/display-text'

import { FileText } from 'lucide-react'

import AppWrapper from '@/components/app-wrapper'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

const DocumentsPage = () => {
  const { data: documents } = useFetch(buildUrl('/documents'), { suspense: true })

  return (
    <AppWrapper
      title='Tài liệu'
      className={'flex flex-col gap-4'}
    >
      <Suspense fallback={<span className='text-muted-foreground w-full text-center text-sm italic'>Đang tải...</span>}>
        {documents.length > 0 ? (
          documents.map((document) => (
            <Link
              to={`/documents/${document._id}`}
              key={document._id}
              className='hover:bg-muted/50 relative flex flex-row gap-2 rounded-xl border'
            >
              <div className='bg-muted flex aspect-square w-24 items-center justify-center rounded-l-xl p-2'>
                <FileText className='h-8 w-8' />
              </div>
              <div className='p-2'>
                <div className='font-bold'>{document.title}</div>
                <Badge variant='outline'>{documentCategories[document.category]}</Badge>
                <div>
                  <span className='ml-2 text-xs'>
                    {document.creator.familyName} {document.creator.givenName}
                  </span>
                  {' - '}
                  <time className={'text-xs font-medium'}>{format(document.createdAt, 'HH:mm dd/MM/yyyy')}</time>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <span className='text-muted-foreground w-full text-center text-sm italic'>Không có tài liệu</span>
        )}
      </Suspense>
    </AppWrapper>
  )
}

export default DocumentsPage
