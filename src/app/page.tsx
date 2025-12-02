'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, Ban, Bell, Activity, Globe, Cpu, Zap, Eye, Filter, Download } from 'lucide-react'

interface Attack {
  id: number
  timestamp: string
  sourceIP: string
  type: string
  severity: 'rendah' | 'sedang' | 'tinggi' | 'kritis'
  blocked: boolean
  blockedAt?: string
  targetPort?: number
  protocol?: string
}

export default function SecurityDashboard() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [stats, setStats] = useState({
    totalAttacks: 0,
    blockedIPs: 0,
    activeThreats: 0,
    threatsBlocked: 0
  })

  useEffect(() => {
    fetchAttacks()
    const interval = setInterval(fetchAttacks, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchAttacks = async () => {
  try {
    // Gunakan full URL atau relative path
    const response = await fetch('/api/attacks', {
      headers: {
        'Content-Type': 'application/json',
      },
      // Tambahkan cache control
      cache: 'no-cache'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    setAttacks(data.attacks)
    setStats(data.stats)
  } catch (error) {
    console.error('Error fetching attacks:', error)
    // Fallback data jika error
    setAttacks([
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        sourceIP: '192.168.1.1',
        type: 'Test Attack',
        severity: 'sedang',
        blocked: false
      }
    ])
    setStats({
      totalAttacks: 1,
      blockedIPs: 0,
      activeThreats: 1,
      threatsBlocked: 0
    })
  }
}

  const handleBlockIP = async (ip: string) => {
    try {
      await fetch('/api/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip }),
      })
      fetchAttacks()
    } catch (error) {
      console.error('Error blocking IP:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'kritis': return 'from-red-500 to-pink-600 border-red-200'
      case 'tinggi': return 'from-orange-500 to-red-500 border-orange-200'
      case 'sedang': return 'from-yellow-500 to-orange-500 border-yellow-200'
      case 'rendah': return 'from-blue-500 to-cyan-500 border-blue-200'
      default: return 'from-gray-500 to-gray-600 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DDoS': return <Activity className="h-4 w-4" />
      case 'Brute Force': return <Zap className="h-4 w-4" />
      case 'SQL Injection': return <Cpu className="h-4 w-4" />
      case 'Port Scanning': return <Globe className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getTypeTranslation = (type: string) => {
    switch (type) {
      case 'DDoS': return 'Serangan DDoS'
      case 'Brute Force': return 'Brute Force'
      case 'SQL Injection': return 'SQL Injection'
      case 'Port Scanning': return 'Port Scanning'
      case 'XSS Attack': return 'Serangan XSS'
      case 'Malware': return 'Malware'
      default: return type
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-xl blur opacity-75 animate-pulse"></div>
                <Shield className="h-10 w-10 text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sistem Monitoring Keamanan
                </h1>
                <p className="text-sm text-gray-600">Pemantauan Ancaman Real-time</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium text-sm">Sistem Online</span>
              </div>
              <button className="bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-colors">
                <Filter className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Ancaman</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAttacks}</p>
                <p className="text-xs text-green-600 mt-1">+12% dari kemarin</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">IP Terblokir</p>
                <p className="text-3xl font-bold text-gray-900">{stats.blockedIPs}</p>
                <p className="text-xs text-green-600 mt-1">Perlindungan aktif</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Ban className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Ancaman Aktif</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeThreats}</p>
                <p className="text-xs text-red-600 mt-1">Perhatian segera</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Bell className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Ancaman Diblokir</p>
                <p className="text-3xl font-bold text-gray-900">{stats.threatsBlocked}</p>
                <p className="text-xs text-blue-600 mt-1">98% tingkat keberhasilan</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Attacks Table */}
          <div className="xl:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200/60 bg-white/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Deteksi Ancaman Langsung
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-colors">
                      24 Jam Terakhir
                    </button>
                    <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      Ekspor
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ancaman</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sumber</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tingkat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/60">
                    {attacks.map((attack) => (
                      <tr key={attack.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getTypeIcon(attack.type)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{getTypeTranslation(attack.type)}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(attack.timestamp).toLocaleTimeString('id-ID')}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-mono text-sm text-gray-900">{attack.sourceIP}</p>
                            <p className="text-xs text-gray-500">
                              Port {attack.targetPort} • {attack.protocol}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getSeverityColor(attack.severity)} text-white border`}>
                            {attack.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            attack.blocked 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {attack.blocked ? '🚫 Terblokir' : '⚠️ Aktif'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {!attack.blocked && (
                              <button
                                onClick={() => handleBlockIP(attack.sourceIP)}
                                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                Blokir IP
                              </button>
                            )}
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm h-full">
              <div className="px-6 py-4 border-b border-gray-200/60 bg-white/50">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-green-500" />
                  Notifikasi Keamanan
                </h2>
              </div>
              <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                {attacks
                  .filter(attack => attack.blocked)
                  .map((attack) => (
                    <div key={attack.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg mt-1">
                          <Ban className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-green-800">Ancaman Dinentralisasi</p>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                              Terblokir
                            </span>
                          </div>
                          <p className="text-sm text-green-700 mb-2">
                            IP <span className="font-mono">{attack.sourceIP}</span> berhasil diblokir
                          </p>
                          <div className="flex items-center justify-between text-xs text-green-600">
                            <span>Serangan {getTypeTranslation(attack.type)}</span>
                            <span>{new Date(attack.blockedAt!).toLocaleTimeString('id-ID')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {/* Sample notifications when no data */}
                {attacks.filter(attack => attack.blocked).length === 0 && (
                  <>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg mt-1">
                          <Shield className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-blue-800 mb-1">Sistem Aman</p>
                          <p className="text-sm text-blue-700">Semua sistem berjalan normal</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg mt-1">
                          <Activity className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 mb-1">Pemantauan Aktif</p>
                          <p className="text-sm text-gray-700">Deteksi ancaman real-time aktif</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}