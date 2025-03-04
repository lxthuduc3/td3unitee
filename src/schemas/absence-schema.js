import { z } from 'zod'

export const absenceSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  reason: z.string().min(1, 'Lý do là bắt buộc'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Định dạng ngày không hợp lệ',
  }),
})
