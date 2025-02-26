import { useErrorBoundary } from 'react-error-boundary'

const Error = ({ error }) => {
  const { resetBoundary } = useErrorBoundary()

  return (
    <div role='alert'>
      <p>Đã có lỗi xảy ra</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetBoundary}>Thử lại</button>
    </div>
  )
}

export default Error
