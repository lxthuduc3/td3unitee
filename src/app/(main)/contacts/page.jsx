import { useState, lazy, Suspense } from 'react'
import useFetch from '@/hooks/use-fetch'

import AppWrapper from '@/components/app-wrapper'
import { Input } from '@/components/ui/input'
import { ContactListSkeleton } from '@/components/contact-list'
const ContactList = lazy(() => import('@/components/contact-list'))

const ContactsPage = () => {
  const [searchName, setSearchName] = useState('')
  const { data: contacts } = useFetch('/members', { suspense: true })

  return (
    <AppWrapper
      title='Danh bạ'
      className={'flex flex-col gap-4'}
    >
      <Input
        value={searchName}
        onChange={(e) => {
          setSearchName(e.target.value)
        }}
        placeholder='Nhập từ khóa để tìm kiếm...'
      />
      <Suspense fallback={<ContactListSkeleton />}>
        <ContactList
          contacts={contacts}
          searchName={searchName}
        />
      </Suspense>
    </AppWrapper>
  )
}

export default ContactsPage
