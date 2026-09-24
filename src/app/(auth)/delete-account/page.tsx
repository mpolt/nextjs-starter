import { DeleteAccountForm } from "@/features/auth/components/delete-account-form"

type DeleteAccountPageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function DeleteAccountPage({
  searchParams,
}: DeleteAccountPageProps) {
  const params = await searchParams

  return <DeleteAccountForm token={params.token ?? null} />
}
