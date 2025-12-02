import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fallback data jika Firebase error
    const fallbackData = {
      attacks: [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          sourceIP: `192.168.1.${Math.floor(Math.random() * 255)}`,
          type: 'SSH Brute Force',
          severity: 'tinggi',
          blocked: false,
          protocol: 'TCP',
          targetPort: 22
        }
      ],
      stats: {
        totalAttacks: 1,
        blockedIPs: 0,
        activeThreats: 1,
        threatsBlocked: 0
      }
    }

    // Coba ambil dari Firebase jika ada
    try {
      const { db } = await import('@/app/lib/firebase')
      const { ref, get } = await import('firebase/database')
      
      const attacksRef = ref(db, 'attacks')
      const snapshot = await get(attacksRef)
      
      let firebaseAttacks = []
      if (snapshot.exists()) {
        const data = snapshot.val()
        firebaseAttacks = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }))
      }

      // Jika ada data di Firebase, pakai itu
      if (firebaseAttacks.length > 0) {
        const stats = {
          totalAttacks: firebaseAttacks.length,
          blockedIPs: firebaseAttacks.filter(a => a.blocked).length,
          activeThreats: firebaseAttacks.filter(a => !a.blocked).length,
          threatsBlocked: firebaseAttacks.filter(a => a.blocked).length
        }
        
        return NextResponse.json({ 
          attacks: firebaseAttacks.slice(-20).reverse(), // 20 terbaru
          stats 
        })
      }
    } catch (firebaseError) {
      console.log('Firebase not configured, using fallback:', firebaseError)
    }

    // Jika Firebase error, return fallback
    return NextResponse.json(fallbackData)

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      attacks: [], 
      stats: {
        totalAttacks: 0,
        blockedIPs: 0,
        activeThreats: 0,
        threatsBlocked: 0
      }
    })
  }
}