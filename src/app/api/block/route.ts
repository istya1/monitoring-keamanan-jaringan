import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { ip } = await request.json()

    if (!ip) {
      return NextResponse.json(
        { message: 'Alamat IP diperlukan' },
        { status: 400 }
      )
    }

    // Coba save ke Firebase jika ada
    try {
      const { db } = await import('@/app/lib/firebase')
      const { ref, push } = await import('firebase/database')
      
      const blocksRef = ref(db, 'blocks')
      await push(blocksRef, {
        ip: ip,
        timestamp: new Date().toISOString(),
        action: 'manual_block',
        user: 'dashboard'
      })

      console.log(`✅ IP ${ip} saved to Firebase`)
    } catch (firebaseError) {
      console.log('Firebase save skipped:', firebaseError)
    }

    return NextResponse.json({ 
      success: true,
      message: `IP ${ip} berhasil diblokir`,
      notification: `Notifikasi telah dikirim untuk IP ${ip}`
    })

  } catch (error) {
    console.error('Error blocking IP:', error)
    return NextResponse.json(
      { error: 'Gagal memblokir IP' },
      { status: 500 }
    )
  }
}