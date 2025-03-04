import { z } from 'zod'
import { format } from 'date-fns'

const profileSchema = z.object({
  dateOfBirth: z
    .string()
    .refine((date) => new Date(date).toString() != 'Invalid Date', {
      message: 'A valid date of birth is required.',
    })
    .transform((date) => format(date, 'yyyy-MM-dd'))
    .optional(),
  baptismalName: z.string().optional(),
  phone: z.string().optional(),
  facebook: z.string().optional(),
  hometown: z.string().optional(),
  school: z.string().optional(),
  firstSchoolYear: z.coerce.number().int().optional(),
  major: z.string().optional(),
})

export default profileSchema
