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
    <AppWrapper
      title='Đi chợ'
      className={'flex flex-col items-center gap-4'}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead className='text-center'>CN</TableHead>
            <TableHead className='text-center'>T2</TableHead>
            <TableHead className='text-center'>T3</TableHead>
            <TableHead className='text-center'>T4</TableHead>
            <TableHead className='text-center'>T5</TableHead>
            <TableHead className='text-center'>T6</TableHead>
            <TableHead className='text-center'>T7</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Trưa</TableCell>
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
                  ></Checkbox>
                </TableCell>
              ))}
          </TableRow>
          <TableRow>
            <TableCell>Tối</TableCell>
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
                  ></Checkbox>
                </TableCell>
              ))}
          </TableRow>
        </TableBody>
      </Table>
      <span className='text-muted-foreground text-sm italic'>Chủ nhật là {format(baseDay, 'dd/MM/yyy')}</span>
      <Button onClick={handleCalculateIngredientsToBuy}>
        <Calculator />
        Ước tính
      </Button>
      {ingredients && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nguyên liệu</TableHead>
              <TableHead className='text-right'>Số lượng</TableHead>
              <TableHead>Đơn vị</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient, index) => (
              <TableRow key={`ingredient${index}`}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell className='text-right'>
                  {Number.isInteger(ingredient.amount) ? ingredient.amount : parseFloat(ingredient.amount.toFixed(2))}
                </TableCell>
                <TableCell>{ingredient.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AppWrapper>
  )
}

export default ShoppingPage
