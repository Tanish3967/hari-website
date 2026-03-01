import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
    return (
        <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
                    SBK Healthcare Centre
                </Link>
                <div className="hidden md:flex gap-6 items-center">
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Home</Link>
                    <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">About</Link>
                    <Link href="/services" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Services</Link>
                    <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Contact</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/book">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all hover:shadow-lg">
                            Book Appointment
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
