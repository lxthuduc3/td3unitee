import { lazy, Suspense } from 'react'
import useFetch from '@/hooks/use-fetch'
import { useParams } from 'react-router-dom'

import AppWrapper from '@/components/app-wrapper'
const DocumentViewer = lazy(() => import('@/components/editor'))

const DocumentPage = () => {
  const { id } = useParams()
  const { data: document } = useFetch(`/documents/${id}`, { suspense: true })

  return (
    <AppWrapper title='Chi tiết tài liệu'>
      <Suspense fallback={<span className='text-muted-foreground w-full text-sm italic'>Đang tải...</span>}>
        <DocumentViewer content={{ type: 'doc', content: document.content }} />
      </Suspense>
    </AppWrapper>
  )
}

export default DocumentPage
