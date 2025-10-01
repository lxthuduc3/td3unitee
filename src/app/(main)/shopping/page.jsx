import { useState } from 'react'
import { getAccessToken } from '@/lib/auth'
import { toast } from 'sonner'
import { addDays, format, startOfDay, startOfWeek } from 'date-fns'

import { Calculator } from 'lucide-react'

import AppWrapper from '@/components/app-wrapper'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

const ShoppingPage = () => {
  const [selectedMeals, setSelectedMeals] = useState([])
  const [ingredients, setIngredients] = useState()

  let today = new Date()
  if (today.getDay() == 6 && today.getHours() >= 19) {
    today = addDays(today, 1)
  }
  const baseDay = startOfDay(startOfWeek(today))

  const handleCalculateIngredientsToBuy = async () => {
    const accessToken = await getAccessToken()

    const res = await fetch(import.meta.env.VITE_API_BASE + '/meals/ingredients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ meals: selectedMeals }),
    })

    if (!res.ok) {
      toast.error(`Ước tính nguyên liệu thất bại.`, { description: `Mã lỗi: ${res.status}` })
      console.log(await res.json())

      return
    }
    setIngredients(await res.json())
    toast.success(`Ước tính nguyên liệu thành công.`)
  }

  return (
    <AppWrapper className='min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-yellow-900/20'>
      {/* Header Section */}
      <div className='mb-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 p-6 text-white shadow-lg dark:from-yellow-600 dark:via-amber-600 dark:to-yellow-700'>
        <div className='mb-2 flex items-center gap-3'>
          <div className='rounded-xl bg-white/20 p-2'>
            <Calculator className='h-6 w-6' />
          </div>
          <h1 className='text-2xl font-bold'>Lên danh sách đi chợ</h1>
        </div>
        <p className='text-white/90'>Chọn các bữa ăn trong tuần để tính toán nguyên liệu cần mua</p>
      </div>

      {/* Week Selection Card */}
      <div className='mb-6 rounded-2xl border border-yellow-200 bg-white p-6 shadow-lg dark:border-yellow-800 dark:bg-gray-800'>
        <div className='mb-4 flex items-center gap-2'>
          <div className='h-2 w-2 rounded-full bg-yellow-400'></div>
          <h2 className='font-semibold text-gray-800 dark:text-gray-200'>Chọn bữa ăn trong tuần</h2>
        </div>
        <div className='mb-4 text-center'>
          <span className='text-muted-foreground rounded-full bg-yellow-100 px-3 py-1 text-sm dark:bg-yellow-900/30'>
            Chủ nhật: {format(baseDay, 'dd/MM/yyyy')}
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow className='border-b border-yellow-200 dark:border-yellow-800'>
              <TableHead className='font-semibold text-gray-700 dark:text-gray-300'>Bữa ăn</TableHead>
              <TableHead className='text-center font-semibold text-red-600 dark:text-red-400'>CN</TableHead>
              <TableHead className='text-center font-semibold text-gray-700 dark:text-gray-300'>T2</TableHead>
              <TableHead className='text-center font-semibold text-gray-700 dark:text-gray-300'>T3</TableHead>
              <TableHead className='text-center font-semibold text-gray-700 dark:text-gray-300'>T4</TableHead>
              <TableHead className='text-center font-semibold text-gray-700 dark:text-gray-300'>T5</TableHead>
              <TableHead className='text-center font-semibold text-gray-700 dark:text-gray-300'>T6</TableHead>
              <TableHead className='text-center font-semibold text-blue-600 dark:text-blue-400'>T7</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className='transition-colors hover:bg-yellow-50 dark:hover:bg-yellow-900/10'>
              <TableCell className='flex items-center gap-2 font-medium text-orange-600 dark:text-orange-400'>
                <span className='h-2 w-2 rounded-full bg-orange-400'></span>
                Trưa
              </TableCell>
              {Array.from({ length: 7 })
                .map((_, index) => addDays(baseDay, index))
                .map((date) => (
                  <TableCell
                    key={`day${date.getDay()}Lunch`}
                    className='px-0 text-center'
                  >
                    <Checkbox
                      checked={selectedMeals.some((meal) => meal.date.getDay() == date.getDay() && meal.meal == 'lunch')}
                      onCheckedChange={(checked) => {
                        setSelectedMeals((prevMeals) =>
                          checked
                            ? [...prevMeals, { date: date, meal: 'lunch' }]
                            : prevMeals.filter((meal) => !(meal.date.getDay() == date.getDay() && meal.meal == 'lunch'))
                        )
                      }}
                      className='data-[state=checked]:border-yellow-500 data-[state=checked]:bg-yellow-500 dark:border-gray-600 dark:bg-black'
                    />
                  </TableCell>
                ))}
            </TableRow>
            <TableRow className='transition-colors hover:bg-yellow-50 dark:hover:bg-yellow-900/10'>
              <TableCell className='flex items-center gap-2 font-medium text-purple-600 dark:text-purple-400'>
                <span className='h-2 w-2 rounded-full bg-purple-400'></span>
                Tối
              </TableCell>
              {Array.from({ length: 7 })
                .map((_, index) => addDays(baseDay, index))
                .map((date) => (
                  <TableCell
                    key={`day${date.getDay()}Dinner`}
                    className='px-0 text-center'
                  >
                    <Checkbox
                      checked={selectedMeals.some((meal) => meal.date.getDay() == date.getDay() && meal.meal == 'dinner')}
                      onCheckedChange={(checked) => {
                        setSelectedMeals((prevMeals) =>
                          checked
                            ? [...prevMeals, { date: date, meal: 'dinner' }]
                            : prevMeals.filter((meal) => !(meal.date.getDay() == date.getDay() && meal.meal == 'dinner'))
                        )
                      }}
                      className='data-[state=checked]:border-yellow-500 data-[state=checked]:bg-yellow-500 dark:border-gray-600 dark:bg-black'
                    />
                  </TableCell>
                ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Action Button */}
      <div className='mb-6 flex justify-center'>
        <Button
          onClick={handleCalculateIngredientsToBuy}
          className='transform rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 px-8 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-yellow-600 hover:to-amber-600 hover:shadow-xl'
          disabled={selectedMeals.length === 0}
        >
          <Calculator className='mr-2 h-5 w-5' />
          Ước tính nguyên liệu ({selectedMeals.length} bữa)
        </Button>
      </div>
      {/* Ingredients Results */}
      {ingredients && (
        <div className='overflow-hidden rounded-2xl border border-green-200 bg-white shadow-lg dark:border-green-800 dark:bg-gray-800'>
          <div className='bg-gradient-to-r from-green-500 to-emerald-500 p-4'>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-white'>
              🛒 Danh sách cần mua
              <span className='rounded-full bg-white/20 px-2 py-1 text-sm'>{ingredients.length} món</span>
            </h3>
          </div>

          <div className='p-4'>
            <Table>
              <TableHeader>
                <TableRow className='border-b border-green-200 dark:border-green-800'>
                  <TableHead className='font-semibold text-gray-700 dark:text-gray-300'>Nguyên liệu</TableHead>
                  <TableHead className='text-right font-semibold text-gray-700 dark:text-gray-300'>Số lượng</TableHead>
                  <TableHead className='font-semibold text-gray-700 dark:text-gray-300'>Đơn vị</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map((ingredient, index) => (
                  <TableRow
                    key={`ingredient${index}`}
                    className='transition-colors hover:bg-green-50 dark:hover:bg-green-900/10'
                  >
                    <TableCell className='font-medium text-gray-800 dark:text-gray-200'>
                      <div className='flex items-center gap-2'>
                        <span className='h-2 w-2 rounded-full bg-green-400'></span>
                        {ingredient.name}
                      </div>
                    </TableCell>
                    <TableCell className='text-right font-semibold text-green-600 dark:text-green-400'>
                      {Number.isInteger(ingredient.amount) ? ingredient.amount : parseFloat(ingredient.amount.toFixed(2))}
                    </TableCell>
                    <TableCell className='text-gray-600 dark:text-gray-400'>{ingredient.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </AppWrapper>
  )
}

export default ShoppingPage
