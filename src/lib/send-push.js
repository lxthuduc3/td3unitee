import { toast } from "sonner"

export const sendPush = async ({ title, body, url }, accessToken) => {

  const resNoti = await fetch(import.meta.env.VITE_API_BASE + '/notifications/subscriptions?topic=admin', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!resNoti.ok) {
    toast.error(`Thông tin đến Ban điều hành thất bại`, { description: `Mã lỗi: ${resNoti.status}` })
    console.log(await resNoti.json())

    return
  }

  const subscriptions = await resNoti.json()
  if (subscriptions.length == 0) {
    toast.error(`Ban điều hành chưa bật thông báo`)

    return
  }

  const notificationPromises = subscriptions.map(async (sub) => {
    const res2 = await fetch(import.meta.env.VITE_API_BASE + '/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title,
        body,
        url,
        endpoint: sub.endpoint,
        keys: sub.keys,
      }),
    })
    return res2.ok
  })

  const results = await Promise.all(notificationPromises)
  const successCount = results.filter(Boolean).length

  //toast.success(`Thông tin đến Ban điều hành thành công: ${successCount}/${subscriptions.length}`)
}