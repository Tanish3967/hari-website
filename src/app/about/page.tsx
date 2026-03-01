import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function About() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 py-16 flex-1">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/3 bg-blue-50 p-8 flex flex-col items-center justify-center border-r border-slate-100">
                            <div className="w-48 h-48 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center mb-6">
                                {/* Fallback image */}
                                <div className="text-slate-400 font-medium text-center p-4">Doctor<br />Image</div>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 text-center">Dr. John Smith</h1>
                            <p className="text-blue-600 font-medium mb-4 text-center">MBBS, MD - General Medicine</p>

                            <div className="w-full space-y-3 pt-6 border-t border-slate-200">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Experience</span>
                                    <span className="font-semibold text-slate-900">15+ Years</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Consultations</span>
                                    <span className="font-semibold text-slate-900">10,000+</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Rating</span>
                                    <span className="font-semibold text-slate-900 flex items-center">
                                        4.9 <svg className="w-4 h-4 text-yellow-400 ml-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-2/3 p-8 md:p-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6 relative inline-block">
                                About The Doctor
                                <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-600 rounded-full"></span>
                            </h2>

                            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                                <p>
                                    Dr. Smith is a highly respected general physician dedicated to providing exceptional, patient-centered care. With over 15 years of clinical experience, he brings a wealth of knowledge and a compassionate approach to every consultation.
                                </p>
                                <p>
                                    He completed his medical degree at the prestigious Metropolitan Medical University, followed by an intensive residency program at Central City Hospital. Throughout his career, Dr. Smith has been recognized for his diagnostic acumen and his ability to communicate complex medical concepts with clarity and empathy.
                                </p>

                                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4">Core Philosophy</h3>
                                <blockquote className="border-l-4 border-blue-500 pl-4 italic bg-slate-50 p-4 rounded-r-lg">
                                    "I believe that the foundation of good medicine is a strong doctor-patient relationship built on trust, open communication, and mutual respect. My goal is not just to treat illness, but to empower my patients to achieve optimal long-term health."
                                </blockquote>
                            </div>

                            <div className="mt-10 flex gap-4">
                                <Link href="/book">
                                    <Button className="bg-blue-600 hover:bg-blue-700">Book Appointment</Button>
                                </Link>
                                <Link href="/services">
                                    <Button variant="outline">View Services</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
