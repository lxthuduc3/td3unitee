import { getAbbreviationName, removeVietnameseTones } from '@/lib/utils'
import { userRoles } from '@/lib/display-text'

import { Phone, CircleEllipsis } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router-dom'

const ContactList = ({ contacts, searchName }) => {
  return (
    <div className='flex flex-col gap-4'>
      {contacts
        .filter((contact) =>
          removeVietnameseTones(`${contact.familyName} ${contact.givenName}`)
            .toLowerCase()
            .includes(removeVietnameseTones(searchName || '').toLowerCase())
        )
        .map((contact) => (
          <div
            className='flex items-center justify-between'
            key={contact._id}
          >
            <div className='flex items-center space-x-4'>
              <Avatar>
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{getAbbreviationName(contact.givenName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm leading-none font-medium'>
                  {contact.familyName} {contact.givenName}
                </p>
                <p className='text-muted-foreground text-sm'>
                  {userRoles[contact.role]} | Phòng {contact.room || 'N/A'}
                </p>
              </div>
            </div>
            <div>
              <Button
                variant='ghost'
                size='icon'
                asChild
              >
                <Link to={`tel:${contact.phone}`}>
                  <Phone />
                </Link>
              </Button>
              <Button
                variant='ghost'
                size='icon'
                asChild
              >
                <Link to={`/contacts/${contact._id}`}>
                  <CircleEllipsis />
                </Link>
              </Button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default ContactList

export const ContactListSkeleton = () => {
  return (
    <div className='flex flex-col gap-4'>
      {[...Array(10)].map((_, index) => (
        <div
          className='flex items-center justify-between'
          key={index}
        >
          <div className='flex items-center space-x-4'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div>
              <Skeleton className='h-4 w-[200px]' />
              <Skeleton className='mt-2 h-4 w-[150px]' />
            </div>
          </div>
          <div className='flex flex-row gap-2'>
            <Skeleton className='h-6 w-6 rounded-md' />
            <Skeleton className='h-6 w-6 rounded-md' />
          </div>
        </div>
      ))}
    </div>
  )
}
