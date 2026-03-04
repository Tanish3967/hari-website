"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck, Smartphone } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

export default function MFASetupPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [enrolling, setEnrolling] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // MFA State
    const [isMfaEnabled, setIsMfaEnabled] = useState(false)
    const [factorId, setFactorId] = useState<string | null>(null)
    const [qrCodeData, setQrCodeData] = useState<string | null>(null)
    const [verifyCode, setVerifyCode] = useState("")

    useEffect(() => {
        checkMfaStatus()
    }, [])

    const checkMfaStatus = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase.auth.mfa.listFactors()
            if (error) throw error

            const factorsList = data?.totp || (data as any)?.all || []
            const verifiedFactor = factorsList.find((f: any) => f.factor_type === 'totp' && f.status === 'verified')

            if (verifiedFactor) {
                setIsMfaEnabled(true)
                setFactorId(verifiedFactor.id)
            } else {
                setIsMfaEnabled(false)
            }
        } catch (err: any) {
            console.error("Error checking MFA status:", err)
            setError(err.message || "Failed to load security settings")
        } finally {
            setLoading(false)
        }
    }

    const startEnrollment = async () => {
        try {
            setEnrolling(true)
            setError("")

            // 1. Unenroll any existing unverified factors first to prevent clutter
            const { data: factorsData } = await supabase.auth.mfa.listFactors()
            const unverified = (factorsData?.totp || (factorsData as any)?.all || []).filter((f: any) => f.status === 'unverified')
            for (const factor of unverified) {
                await supabase.auth.mfa.unenroll({ factorId: factor.id })
            }

            // 2. Enroll completely new factor
            const { data, error } = await supabase.auth.mfa.enroll({
                factorType: 'totp',
            })

            if (error) throw error

            setFactorId(data.id)
            setQrCodeData(data.totp.qr_code) // Supabase returns the URI for the QR code

        } catch (err: any) {
            setError(err.message || "Failed to initialize Authenticator pairing")
        } finally {
            setEnrolling(false)
        }
    }

    const verifyAndEnable = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!factorId) return

        try {
            setVerifying(true)
            setError("")

            const challenge = await supabase.auth.mfa.challenge({ factorId })
            if (challenge.error) throw challenge.error

            const verify = await supabase.auth.mfa.verify({
                factorId,
                challengeId: challenge.data.id,
                code: verifyCode
            })

            if (verify.error) throw verify.error

            // Success!
            setIsMfaEnabled(true)
            setQrCodeData(null)
            setSuccess("Google Authenticator successfully linked! Two-Factor Authentication is now active.")
            setVerifyCode("")

        } catch (err: any) {
            setError(err.message || "Invalid authentication code. Please try again.")
        } finally {
            setVerifying(false)
        }
    }

    const disableMfa = async () => {
        if (!factorId) return
        if (!window.confirm("Are you sure you want to disable Two-Factor Authentication? This will make your account less secure.")) return

        try {
            setLoading(true)
            const { error } = await supabase.auth.mfa.unenroll({ factorId })
            if (error) throw error

            setIsMfaEnabled(false)
            setFactorId(null)
            setSuccess("Two-Factor Authentication has been disabled.")
        } catch (err: any) {
            setError(err.message || "Failed to disable MFA")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Security Settings</h1>
                <p className="text-slate-500 mt-2">Manage your account security and Two-Factor Authentication.</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold">Security Error</h4>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium mt-0.5">{success}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isMfaEnabled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                            {isMfaEnabled ? <ShieldCheck className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Authenticator App (TOTP)</h2>
                            <p className="text-slate-500 text-sm mt-1">
                                {isMfaEnabled
                                    ? "Your account is currently protected by Two-Factor Authentication."
                                    : "Add an extra layer of security using Google Authenticator or Authy."}
                            </p>
                        </div>
                    </div>
                    <div>
                        {isMfaEnabled ? (
                            <Button variant="destructive" onClick={disableMfa}>
                                Disable MFA
                            </Button>
                        ) : (
                            !qrCodeData && (
                                <Button onClick={startEnrollment} disabled={enrolling}>
                                    {enrolling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    Setup Authenticator
                                </Button>
                            )
                        )}
                    </div>
                </div>

                {qrCodeData && !isMfaEnabled && (
                    <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-900 mb-6">Link Your Authenticator App</h3>

                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 inline-block">
                                <QRCodeSVG value={qrCodeData} size={200} />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h4 className="font-medium text-slate-900">1. Scan the QR Code</h4>
                                    <p className="text-sm text-slate-500 mt-1">Open Google Authenticator or Authy on your phone and scan the QR code shown here.</p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-slate-900 mb-2">2. Enter the Verification Code</h4>
                                    <p className="text-sm text-slate-500 mb-3">Type the 6-digit code from your app to verify the connection.</p>

                                    <form onSubmit={verifyAndEnable} className="flex gap-3 max-w-xs">
                                        <Input
                                            placeholder="000000"
                                            value={verifyCode}
                                            onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="text-center tracking-widest font-mono text-lg"
                                            maxLength={6}
                                        />
                                        <Button type="submit" disabled={verifying || verifyCode.length !== 6}>
                                            {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
