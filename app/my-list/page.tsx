import MyListPage from '@/components/MyListPage'

// Force dynamic rendering since we use localStorage
export const dynamic = 'force-dynamic'

export default function MyListRoute() {
  return <MyListPage />
}