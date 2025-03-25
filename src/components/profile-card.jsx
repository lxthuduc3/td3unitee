import { getAbbreviationName } from '@/lib/utils'
import { format, differenceInYears, subMonths } from 'date-fns'

import { userRoles, userStatus } from '@/lib/display-text'

import { Edit } from 'lucide-react'
import FiRrEnvelope from './flaticons/fi-rr-envelope'
import FiRrPhoneCall from './flaticons/fi-rr-phone-call'
import FiBrandsFacebook from './flaticons/fi-brands-facebook'
import FiRrCrossReligion from './flaticons/fi-rr-cross-religion'
import FiRrCakeBirthday from './flaticons/fi-rr-cake-birthday'
import FiRrMapMarkerHome from './flaticons/fi-rr-map-marker-home'
import FiRrSchool from './flaticons/fi-rr-school'
import FiRrGraduationCap from './flaticons/fi-rr-graduation-cap'
import FiRrStar from './flaticons/fi-rr-star'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Link } from 'react-router-dom'

const ProfileCard = ({ profile, isAbleToEdit }) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col items-center gap-1'>
        <Avatar className='h-24 w-24'>
          <AvatarImage src={profile.avatar} />
          <AvatarFallback>{getAbbreviationName(profile.givenName || 'User')}</AvatarFallback>
        </Avatar>
        <h3 className='text-xl font-bold uppercase'>
          {profile.familyName} {profile.givenName}
        </h3>
        <p>
          {userRoles[profile.role]} | Phòng {profile.room || 'N/A'}
        </p>

        {isAbleToEdit ? (
          <Button asChild>
            <Link to='/profile/edit'>
              <Edit /> Chỉnh sửa
            </Link>
          </Button>
        ) : (
          <Badge variant='outline'>{userStatus[profile.status]}</Badge>
        )}
      </div>

      <Separator />

      <div>
        <div>
          <h3 className='font-semibold'>Liên hệ</h3>
          <div className='mt-2 flex flex-col gap-2'>
            <Link
              to={`mailto:${profile.email}`}
              className='bg-card text-card-foreground flex flex-row items-center gap-2 rounded-lg border p-2 break-all shadow'
            >
              <FiRrEnvelope className='shrink-0' />
              {profile.email}
            </Link>

            {profile.phone && (
              <Link
                to={profile.phone ? `tel:${profile.phone}` : '#'}
                className='bg-card text-card-foreground flex flex-row items-center gap-2 rounded-lg border p-2 break-all shadow'
              >
                <FiRrPhoneCall className='shrink-0' />
                {profile.phone}
              </Link>
            )}

            {profile.facebook && (
              <Link
                to={profile.facebook || '#'}
                target='_blank'
                className='bg-card text-card-foreground flex flex-row items-center gap-2 rounded-lg border p-2 break-all shadow'
              >
                <FiBrandsFacebook className='shrink-0' />
                {profile.facebook}
              </Link>
            )}
          </div>
        </div>

        <div className='mt-4'>
          <h3 className='font-semibold'>Thông tin</h3>
          <div className='mt-2 flex flex-col gap-2 px-2'>
            <span className='flex flex-row items-center gap-2'>
              <FiRrCrossReligion />
              {profile.baptismalName || 'N/A'}
            </span>

            <span className='flex flex-row items-center gap-2'>
              <FiRrCakeBirthday />
              {profile.dateOfBirth ? format(profile.dateOfBirth, 'dd/MM/yyyy') : 'N/A'}
            </span>

            <span className='flex flex-row items-center gap-2'>
              <FiRrMapMarkerHome />
              {profile.hometown || 'N/A'}
            </span>

            <span className='flex flex-row items-center gap-2'>
              <FiRrSchool />
              {profile.school || 'N/A'}
            </span>

            <span className='flex flex-row items-center gap-2'>
              <FiRrGraduationCap />
              {profile.major || 'N/A'}
            </span>

            <span className='flex flex-row items-center gap-2'>
              <FiRrStar />
              {profile.firstSchoolYear
                ? `Năm ${differenceInYears(subMonths(new Date(), 7), new Date(profile.firstSchoolYear, 7, 1))}`
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard

export const ProfileCardSkeleton = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col items-center gap-1'>
        <Skeleton className='h-24 w-24 rounded-full' />
        <Skeleton className='mt-2 h-6 w-48' />
        <Skeleton className='mt-1 h-4 w-36' />
        <Skeleton className='mt-2 h-10 w-32' />
      </div>

      <Separator />

      <div>
        <div>
          <Skeleton className='mb-2 h-5 w-20' />
          <div className='mt-2 flex flex-col gap-2'>
            {[1, 2, 3].map((_, index) => (
              <Skeleton
                key={index}
                className='h-10 w-full'
              />
            ))}
          </div>
        </div>

        <div className='mt-4'>
          <Skeleton className='mb-2 h-5 w-24' />
          <div className='mt-2 flex flex-col gap-2 px-2'>
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div
                key={index}
                className='flex items-center gap-2'
              >
                <Skeleton className='h-4 w-4' />
                <Skeleton className='h-4 w-full max-w-[200px]' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
