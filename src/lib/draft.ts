import { draftMode } from 'next/headers'

export async function getDraftMode(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode()
    return isEnabled
  } catch (error) {
    return false
  }
}
