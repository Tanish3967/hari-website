import Navbar from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, Heart, Shield, Stethoscope, Thermometer, UserPlus } from "lucide-react";

export default function Services() {
    const servicesList = [
        {
            title: "General Consultations",
            description: "Comprehensive medical evaluations for acute and chronic conditions.",
            icon: <Stethoscope className="w-8 h-8 text-blue-600" />
        },
        {
            title: "Preventive Care",
            description: "Routine check-ups, health screenings, and preventative medicine strategies.",
            icon: <Shield className="w-8 h-8 text-blue-600" />
        },
        {
            title: "Cardiovascular Health",
            description: "Blood pressure management, ECGs, and heart health monitoring.",
            icon: <Heart className="w-8 h-8 text-blue-600" />
        },
        {
            title: "Diagnostic Services",
            description: "In-clinic testing, lab test referrals, and comprehensive diagnostics.",
            icon: <Activity className="w-8 h-8 text-blue-600" />
        },
        {
            title: "Fever & Infection",
            description: "Rapid diagnosis and treatment plans for viral and bacterial infections.",
            icon: <Thermometer className="w-8 h-8 text-blue-600" />
        },
        {
            title: "Health Certificates",
            description: "Fitness certificates, insurance medical forms, and general medical letters.",
            icon: <UserPlus className="w-8 h-8 text-blue-600" />
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <div className="bg-blue-600 text-white py-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Medical Services</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Providing comprehensive, compassionate, and evidence-based healthcare tailored to your individual needs.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 flex-1 max-w-6xl">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {servicesList.map((service, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>
                            <Link href={`/book?service=${encodeURIComponent(service.title)}`} className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center group-hover:translate-x-1 transition-transform">
                                Book this <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 text-center border border-blue-100">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Need a specific treatment not listed here?</h2>
                    <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                        Every patient is unique. If you have specific health concerns, schedule a general consultation to discuss a personalized care plan.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/book">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Schedule Consultation</Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="bg-white">Contact Us</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
