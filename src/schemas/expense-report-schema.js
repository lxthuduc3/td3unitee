import { z } from 'zod'

export const expenseReportSchema = z.object({
  desc: z.string().min(1, 'Mô tả là bắt buộc'),
  amount: z.coerce.number({ invalid_type_error: 'Số tiền phải ở định dạng số' }).positive('Số tiền phải là một số dương'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Định dạng ngày không hợp lệ',
  }),
  funded: z.boolean(),
})
